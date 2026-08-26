// A stand-in for Lux ID, so the suite can exercise the real sign-in instead of
// mocking around it.
//
// The app never talks to IAM directly: bankd proxies /v1/iam/* to whatever
// IAM_ENDPOINT names, and verifies every bearer against the JWKS it finds
// there. So pointing bankd here is the whole of the wiring — the browser runs
// the same PKCE redirect it runs in production, and the token that comes back
// is one bankd actually validates rather than one the test asserted about.
//
// It signs with a real RS256 key generated at boot and publishes the public half
// at the JWKS URL bankd reads. Nothing here is a shortcut past verification.
import { createServer } from 'node:http'
import { generateKeyPairSync, createSign, randomUUID } from 'node:crypto'

const PORT = Number(process.env.IAM_STUB_PORT || 8071)
const ISSUER = process.env.IAM_STUB_ISSUER || `http://127.0.0.1:${PORT}`
const SUB = process.env.IAM_STUB_SUB || 'lux-demo-subject'
const EMAIL = process.env.IAM_STUB_EMAIL || 'z@lux.financial'
const ORG = process.env.IAM_STUB_ORG || 'lux'
const KID = 'stub-1'

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
const jwk = publicKey.export({ format: 'jwk' })

const b64 = (buf) => Buffer.from(buf).toString('base64url')

function jwt(claims, ttlSeconds = 3600) {
  const now = Math.floor(Date.now() / 1000)
  const header = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: KID }))
  const payload = b64(JSON.stringify({
    iss: ISSUER, sub: SUB, aud: 'lux-bank',
    iat: now, exp: now + ttlSeconds,
    email: EMAIL, email_verified: true,
    name: EMAIL, preferred_username: EMAIL,
    // Base resolves the acting org from home-first MEMBERSHIP, not from the
    // owner claim — IAM stamps owner with the org of the application a token was
    // minted through, so reading it would put every tenant of one app on one
    // Base. The membership list is what a real IAM token carries.
    owner: ORG,
    orgs: [{ org: ORG, role: 'owner' }],
    ...claims,
  }))
  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${payload}`)
  return `${header}.${payload}.${signer.sign(privateKey).toString('base64url')}`
}

const json = (res, body, status = 200) => {
  res.writeHead(status, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
  res.end(JSON.stringify(body))
}

const discovery = {
  issuer: ISSUER,
  authorization_endpoint: `${ISSUER}/v1/iam/oauth/authorize`,
  token_endpoint: `${ISSUER}/v1/iam/oauth/token`,
  userinfo_endpoint: `${ISSUER}/v1/iam/oauth/userinfo`,
  jwks_uri: `${ISSUER}/v1/iam/.well-known/jwks`,
  response_types_supported: ['code'],
  grant_types_supported: ['authorization_code', 'refresh_token', 'password'],
  code_challenge_methods_supported: ['S256'],
  scopes_supported: ['openid', 'profile', 'email'],
}

createServer((req, res) => {
  const url = new URL(req.url, ISSUER)
  const path = url.pathname

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
    })
    return res.end()
  }

  if (path.endsWith('/.well-known/openid-configuration')) return json(res, discovery)
  if (path.endsWith('/.well-known/jwks') || path.endsWith('/.well-known/jwks.json')) {
    return json(res, { keys: [{ ...jwk, use: 'sig', alg: 'RS256', kid: KID }] })
  }

  // Authorize: hand the code straight back. The stub authenticates nobody —
  // what is under test is the app's half of the exchange, not IAM's login page.
  if (path.endsWith('/oauth/authorize')) {
    const redirect = url.searchParams.get('redirect_uri')
    if (!redirect) return json(res, { error: 'invalid_request' }, 400)
    const back = new URL(redirect)
    back.searchParams.set('code', randomUUID())
    const state = url.searchParams.get('state')
    if (state) back.searchParams.set('state', state)
    res.writeHead(302, { location: back.toString() })
    return res.end()
  }

  if (path.endsWith('/oauth/token')) {
    let body = ''
    req.on('data', (c) => { body += c })
    return req.on('end', () => json(res, {
      access_token: jwt({}),
      id_token: jwt({}),
      refresh_token: randomUUID(),
      token_type: 'Bearer',
      expires_in: 3600,
    }))
  }

  if (path.endsWith('/oauth/userinfo')) {
    return json(res, {
      sub: SUB, email: EMAIL, email_verified: true, name: EMAIL,
      preferred_username: EMAIL, owner: ORG, orgs: [{ org: ORG, role: 'owner' }],
    })
  }

  json(res, { error: 'not_found', path }, 404)
}).listen(PORT, '127.0.0.1', () => {
  console.log(`iam-stub listening on ${ISSUER}`)
})

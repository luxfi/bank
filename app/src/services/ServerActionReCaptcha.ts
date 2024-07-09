'use server';

export async function verifyCaptcha(token: string | null) {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  );

  const data = await response.json();

  if (data.score > 0.5) {
    return 'success!';
  } else {
    throw new Error('Failed Captcha');
  }
}

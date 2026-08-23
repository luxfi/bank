import { Link } from 'react-router'
import { EmptyState } from '@/components/ui'

// A mistyped /app path is a wrong turn inside the product. Signed in, you stay
// signed in: the shell keeps its nav and the page says so, rather than dropping
// the customer back onto the public site.
export function NotFound() {
  return (
    <EmptyState
      icon="globe"
      title="Page not found"
      body="This page isn’t part of your account."
      action={<Link to="/app" className="btn btn-primary">Back to home</Link>}
    />
  )
}

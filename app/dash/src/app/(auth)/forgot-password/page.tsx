import Link from 'next/link';

import { Container } from './styles';

export default async function ForgotPassword() {
  return (
    <Container>
      <Link href={'/'}>Sign In</Link>
    </Container>
  );
}

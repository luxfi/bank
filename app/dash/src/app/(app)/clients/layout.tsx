import ClientsProvider from '@/providers/ClientsProvider';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientsProvider>{children}</ClientsProvider>;
}

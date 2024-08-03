import localFont from 'next/font/local';

import { MessagesProvider } from '@/context/Messages';
import { SidebarProvider } from '@/context/useSidebar';

import NotificationProvider from '@/providers/NotificationProvider';
import ServerProviders from '@/providers/ServerProviders';
import StyledProviders from '@/providers/StylesProvider';

const myFont = localFont({
  variable: '--ds-icons',
  src: '../../public/fonts/ds-icons.ttf',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/image/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00569e" />
        <meta name="description" content="CDAX Forex Control Panel" />
        <meta property="og:title" content="CDAX Forex" />
        <meta property="og:description" content="CDAX Forex Control Panel" />
        <meta
          property="og:image"
          content="https://app.cdaxforex.com/images/snapshot.png"
        />
        <meta property="og:url" content="app.cdaxforex.com" />
        <meta property="og:type" content="website" />
        <title>CDAX Forex</title>
      </head>
      <body className={myFont.variable}>
        <main>
          <ServerProviders>
            <StyledProviders>
              <NotificationProvider>
                <MessagesProvider>
                  <SidebarProvider>{children}</SidebarProvider>
                </MessagesProvider>
              </NotificationProvider>
            </StyledProviders>
          </ServerProviders>
        </main>
      </body>
    </html>
  );
}

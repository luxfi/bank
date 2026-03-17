// Force all pages to be dynamically rendered (no SSG prerender)
// All pages are auth-gated and use client-side APIs (document, window)
export const dynamic = 'force-dynamic';

import localFont from 'next/font/local';

import { MessagesProvider } from '@/context/Messages';
import { SidebarProvider } from '@/context/useSidebar';

import NotificationProvider from '@/providers/NotificationProvider';
import ServerProviders from '@/providers/ServerProviders';
import StyledProviders from '@/providers/StylesProvider';
import { LUX_BRAND } from '@luxbank/brand';

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
        <meta name="description" content={`${LUX_BRAND.name} Control Panel`} />
        <meta property="og:title" content={LUX_BRAND.name} />
        <meta property="og:description" content={`${LUX_BRAND.name} Control Panel`} />
        <meta
          property="og:image"
          content={`https://${LUX_BRAND.domains.app}/images/snapshot.png`}
        />
        <meta property="og:url" content={LUX_BRAND.domains.app} />
        <meta property="og:type" content="website" />
        <title>{LUX_BRAND.name}</title>
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

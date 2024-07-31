export default function BaseLayout({
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
      <body>
        {children}
      </body>
    </html>
  );
}

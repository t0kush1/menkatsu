import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/menkatsulogo_192.png" />
        <link rel="apple-touch-icon" href="/icons/menkatsulogo_192.png" />
        <meta name="theme-color" content="#facc15" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

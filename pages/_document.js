import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Fonts: loaded via next/font/google in _app.js (static CSS, no JS).
            Theme: dark by default, light variant applied via
            @media (prefers-color-scheme: light) in styles/globals.css.
            Both work with JS disabled. */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

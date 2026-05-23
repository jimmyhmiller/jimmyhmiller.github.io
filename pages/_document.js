import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Fonts are loaded via next/font/google in _app.js — self-hosted at
            build time, with auto-generated size-adjusted fallbacks. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var mq = window.matchMedia('(prefers-color-scheme: light)');
                  var apply = function() {
                    document.documentElement.dataset.theme = mq.matches ? 'light' : 'dark';
                  };
                  apply();
                  if (mq.addEventListener) mq.addEventListener('change', apply);
                  else if (mq.addListener) mq.addListener(apply);
                } catch(e) {
                  document.documentElement.dataset.theme = 'dark';
                }
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

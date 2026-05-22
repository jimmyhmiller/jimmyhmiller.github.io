import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
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

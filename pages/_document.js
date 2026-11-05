import { Html, Head, Main, NextScript } from 'next/document';

// `data-paper-boot="pending"` keeps the content and the unpainted canvas
// invisible (without changing layout) until the paper scene draws its first
// frame; components/PaperDesk.js removes it, as does any startup failure.
// Without JavaScript the noscript style reveals the readable HTML at once.
// `data-theme="light"`: reading surfaces are light paper, so embedded demos
// that ask utils.useTheme() render their light variant.
const bootStyle = `html[data-paper-boot="pending"] :is(.site-content,#paper-lighting){visibility:hidden}`;
const noscriptStyle = `html[data-paper-boot="pending"] :is(.site-content,#paper-lighting){visibility:visible}`;

export default function Document() {
  return (
    <Html lang="en" data-paper-boot="pending" data-theme="light">
      <Head>
        <style dangerouslySetInnerHTML={{ __html: bootStyle }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: noscriptStyle }} />
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

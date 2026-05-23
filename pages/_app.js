import '../styles/globals.css';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Newsreader, JetBrains_Mono } from 'next/font/google';

// Self-hosted at build time. next/font generates a size-adjusted fallback so
// the layout doesn't shift when the webfont arrives, and (with output:
// 'export') the .woff2 files end up under /_next/static and ship from this
// origin — no Google CDN at runtime.
const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

// Localhost-only copy editor. dynamic + ssr:false so it never appears in the
// SSR output, and the component itself bails out on non-local hosts.
const CopyEditor = dynamic(() => import('../components/CopyEditor'), { ssr: false });

export default function App({ Component, pageProps }) {
  return (
    <div className={`${serif.variable} ${mono.variable}`} style={{ display: 'contents' }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <Component {...pageProps} />
      <CopyEditor />
    </div>
  );
}

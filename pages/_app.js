import '../styles/globals.css';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import PaperDesk from '../components/PaperDesk';

// Localhost-only copy editor. dynamic + ssr:false so it never appears in the
// SSR output, and the component itself bails out on non-local hosts.
const CopyEditor = dynamic(() => import('../components/CopyEditor'), { ssr: false });

// Pages that bring their own full-viewport design set `Page.paperDesk = false`
// and render without the paper scene.
export default function App({ Component, pageProps }) {
  const page = <Component {...pageProps} />;
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      {Component.paperDesk === false ? page : <PaperDesk>{page}</PaperDesk>}
      <CopyEditor />
    </>
  );
}

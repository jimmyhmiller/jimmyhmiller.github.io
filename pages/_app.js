import '../styles/globals.css';
import dynamic from 'next/dynamic';

// Localhost-only copy editor. dynamic + ssr:false so it never appears in the
// SSR output, and the component itself bails out on non-local hosts.
const CopyEditor = dynamic(() => import('../components/CopyEditor'), { ssr: false });

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <CopyEditor />
    </>
  );
}

import Head from 'next/head';
import { useEffect } from 'react';

export default function ProjectsRedirect() {
  useEffect(() => {
    window.location.replace('/#projects');
  }, []);

  return (
    <>
      <Head>
        <title>Projects — Jimmy Miller</title>
        <meta httpEquiv="refresh" content="0;url=/#projects" />
        <link rel="canonical" href="https://jimmyhmiller.com/#projects" />
      </Head>
      <p>Redirecting to <a href="/#projects">projects on the homepage</a>…</p>
    </>
  );
}

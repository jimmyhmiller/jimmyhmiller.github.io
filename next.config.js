import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})
 
/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => {
  const dev = phase === PHASE_DEVELOPMENT_SERVER
  return {
    // The site is a static export. The dev server alone also serves
    // `*.dev.js` pages: the paper dev tools' save endpoint
    // (pages/api/paper-preferences.dev.js), which writes into this repo.
    output: dev ? undefined : 'export',
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx', ...(dev ? ['dev.js'] : [])],
    transpilePackages: ["react-syntax-highlighter"],
    // Paper renderer shaders are imported as strings (lib/paper/paper-scene.js).
    webpack(config) {
      config.module.rules.push({ test: /\.(frag|glsl)$/, type: 'asset/source' })
      return config
    },
  }
}

export default (phase) => withMDX(nextConfig(phase))

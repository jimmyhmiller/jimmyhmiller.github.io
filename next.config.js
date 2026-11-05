import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  transpilePackages: ["react-syntax-highlighter"],
  // Paper renderer shaders are imported as strings (lib/paper/paper-scene.js).
  webpack(config) {
    config.module.rules.push({ test: /\.(frag|glsl)$/, type: 'asset/source' })
    return config
  },
}
 
export default withMDX(nextConfig)
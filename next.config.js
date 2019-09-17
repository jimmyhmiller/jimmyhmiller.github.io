

const config = {
  webpack: (config, { dev, isServer }) => {

    if (isServer && !dev) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = { ...(await originalEntry()) };
        // This script imports components from the Next app, so it's transpiled to `.next/server/scripts/build-rss.js`
        entries['./tools/build-rss.js'] = './tools/build-rss.js';
        return entries;
      };
    }

    return config;
  },
  exportPathMap(defaultPathMap, { dev, dir, outDir }) {
    if (!dev) {
      const generateRSS = require('./.next/server/tools/build-rss.js').default;
      generateRSS();
    }

    return defaultPathMap;
  }
}

module.exports = config;
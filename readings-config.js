// Configuration for the readings/PDFs section

export const config = {
  // S3 bucket configuration
  bucket: 'jimmyhmiller-bucket',
  prefix: 'pdfs/',
  region: 'us-east-1',

  // Categories to completely exclude from the site
  excludeCategories: [
    'garbage',
    'not-article',
    'books',
    'ai',
    'interesting',
    'philosophy',
    'shared',
  ],

  // Individual PDF hashes to exclude (use the SHA-256 hash without .pdf extension)
  excludeHashes: [
    // Example: '7744a6100455ceb76e9eeb2567a229e316fa4203898a79ca7179b6d28992d44d',
  ],

  // S3 key for the PDF index file (for metadata mapping)
  pdfIndexKey: 'pdf-index.json',

  // Display name overrides (for when title-case doesn't look right)
  displayNames: {
    'db': 'Databases',
    'foc-covered': 'Feeling of Computing (Covered)',
    'foc-potential': 'Feeling of Computing (Potential)',
  },
};

export default config;

// Configuration for the readings/PDFs section

export const config = {
  // S3 bucket configuration
  bucket: 'jimmyhmiller-bucket',
  prefix: 'pdfs/',
  region: 'us-east-1',

  // Whitelist: only categories in this list appear on /readings.
  // Anything else in S3 (audiobook, unsorted, garbage, etc.) stays hidden.
  // The loader logs any S3 categories that aren't on this list at build
  // time, so new categories don't get silently added or dropped.
  includeCategories: [
    'computer-philosophy',
    'db',
    'foc-covered',
    'foc-potential',
    'historical',
    'programming-languages',
    'security',
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

import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import config from '../readings-config.js';

// Build a hash-to-metadata lookup from the PDF index
async function loadPdfIndex(s3Client) {
  try {
    const command = new GetObjectCommand({
      Bucket: config.bucket,
      Key: config.pdfIndexKey,
    });
    const response = await s3Client.send(command);
    const body = await response.Body.transformToString();
    const data = JSON.parse(body);

    const lookup = {};
    for (const entry of data) {
      if (entry.hash) {
        const existing = lookup[entry.hash];
        const isDupe = entry.is_duplicate || false;

        // If we already have an entry for this hash, prefer the non-duplicate one
        if (existing && !existing.isDuplicate && isDupe) {
          continue; // Keep the existing non-duplicate entry
        }

        lookup[entry.hash] = {
          title: entry.preferred_title || entry.ocr_title || entry.title || null,
          author: entry.preferred_author || entry.ocr_author || entry.author || null,
          pageCount: entry.totalPages || null,
          creationDate: entry.creationDate || null,
          isDuplicate: isDupe,
        };
      }
    }
    return lookup;
  } catch (error) {
    console.error('Error loading PDF index from S3:', error);
    return {};
  }
}

// Extract category and hash from S3 key
function parseS3Key(key, prefix) {
  // Keys are like: pdfs/category/hash.pdf
  const withoutPrefix = key.startsWith(prefix) ? key.slice(prefix.length) : key;
  const parts = withoutPrefix.split('/');
  if (parts.length >= 2 && parts[1].endsWith('.pdf')) {
    return {
      category: parts[0],
      hash: parts[1].replace('.pdf', ''),
      key,
    };
  }
  return null;
}

// List all PDFs from S3
async function listS3PDFs(s3Client) {
  const pdfs = [];
  let continuationToken = undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: config.prefix,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);

    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key && obj.Key.endsWith('.pdf')) {
          const parsed = parseS3Key(obj.Key, config.prefix);
          if (parsed) {
            pdfs.push(parsed);
          }
        }
      }
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return pdfs;
}

// Get display name for a category (check config first, then title-case)
function getDisplayName(category) {
  if (config.displayNames && config.displayNames[category]) {
    return config.displayNames[category];
  }
  // Fall back to title case
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Main function to get all readings data
export async function getReadingsData() {
  const s3Client = new S3Client({ region: config.region });
  const pdfIndex = await loadPdfIndex(s3Client);
  const s3PDFs = await listS3PDFs(s3Client);

  // Group by category and filter
  const categoryMap = {};

  for (const pdf of s3PDFs) {
    // Skip excluded categories
    if (config.excludeCategories.includes(pdf.category)) {
      continue;
    }

    // Skip excluded hashes
    if (config.excludeHashes.includes(pdf.hash)) {
      continue;
    }

    // Skip duplicates
    const metadata = pdfIndex[pdf.hash] || {};
    if (metadata.isDuplicate) {
      continue;
    }

    if (!categoryMap[pdf.category]) {
      categoryMap[pdf.category] = [];
    }

    const s3Url = `https://${config.bucket}.s3.amazonaws.com/${pdf.key}`;

    categoryMap[pdf.category].push({
      hash: pdf.hash,
      title: metadata.title || 'Untitled',
      author: metadata.author || null,
      pageCount: metadata.pageCount,
      creationDate: metadata.creationDate,
      downloadUrl: s3Url,
    });
  }

  // Sort PDFs within each category by title
  for (const category of Object.keys(categoryMap)) {
    categoryMap[category].sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return titleA.localeCompare(titleB);
    });
  }

  // Sort categories alphabetically
  const sortedCategories = Object.keys(categoryMap).sort((a, b) => a.localeCompare(b));

  const categories = sortedCategories.map(category => ({
    slug: category,
    name: getDisplayName(category),
    count: categoryMap[category].length,
    pdfs: categoryMap[category],
  }));

  return {
    categories,
    totalCount: categories.reduce((sum, c) => sum + c.count, 0),
  };
}

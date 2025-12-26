import Head from 'next/head';
import { GlobalLayout, Heading, LargeText, MediumText } from '../utils.mjs';
import { getReadingsData } from '../lib/readings.js';

const PdfLink = ({ title, author, downloadUrl }) => {
  const displayTitle = title === 'Untitled' ? 'Untitled Document' : title;
  const displayText = author ? `${displayTitle} — ${author}` : displayTitle;

  return (
    <li>
      <LargeText>
        <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
          {displayText}
        </a>
      </LargeText>
    </li>
  );
};

const Readings = ({ categories, totalCount }) => {
  return (
    <GlobalLayout>
      <Head>
        <title>Readings — Jimmy Miller</title>
      </Head>
      <Heading text="Readings" />
      <MediumText>
        A collection of {totalCount} papers and articles I've saved over the years. I haven't read all of them. But I've read a good amount. I will eventually update this with that kind of information and maybe some description of the best ones. This is definitely not an exhaustive list of papers, just ones I could easily find. I will continue to add more and organize better as time goes on. I also wrote about <a href="/ai-own-your-tools">the making of this archive</a>.
      </MediumText>

      {categories.map(category => (
        <div key={category.slug}>
          <Heading size={2} text={`${category.name} (${category.count})`} />
          <ul>
            {category.pdfs.map(pdf => (
              <PdfLink
                key={pdf.hash}
                title={pdf.title}
                author={pdf.author}
                downloadUrl={pdf.downloadUrl}
              />
            ))}
          </ul>
        </div>
      ))}
    </GlobalLayout>
  );
};

export async function getStaticProps() {
  const data = await getReadingsData();

  return {
    props: {
      categories: data.categories,
      totalCount: data.categories.reduce((sum, c) => sum + c.count, 0),
    },
  };
}

export default Readings;

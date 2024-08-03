import RSS from 'rss'
import ReactDOMServer from 'react-dom/server';
import { postsForBeginners, posts } from "../pages/index.js"
const fs = require("fs");

const getMarkupUp = (post) => {
  if (post.mdx) {
    const postEntry = require(`../pages${post.href}`);
    return ReactDOMServer.renderToStaticMarkup(postEntry.default());
  } else {
    const postEntry = require(`../pages${post.href}`)
    return ReactDOMServer.renderToStaticMarkup(postEntry.default())
  }
}

const generateRSS = () => {
  console.log("Generating RSS")
  const siteUrl = "https://jimmyhmiller.github.io"
  const feed = new RSS({
    title: "jimmyhmiller.github.io",
    site_url: siteUrl,
  })

  console.log("HERE!!!!");
  
  for (const post of postsForBeginners.concat(posts)) {
     const description = getMarkupUp(post);
     feed.item({
      title: post.text,
      guid: post.href,
      url: siteUrl + post.href,
      description,
    })
  }

   const output = feed.xml({ indent: true })
   const dir = "public"
   if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/feed.xml`, output)
    console.log("Generated RSS")
}

export default generateRSS;
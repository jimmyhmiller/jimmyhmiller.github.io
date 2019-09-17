import RSS from 'rss'
import ReactDOMServer from 'react-dom/server';
import { posts } from "../pages/index.js"
const fs = require("fs");

const generateRSS = () => {
  console.log("Generating RSS")
  const siteUrl = "https://jimmyhmiller.github.io"
  const feed = new RSS({
    title: "jimmyhmiller.github.io",
    site_url: siteUrl,
  })
  posts.map(post => {
    const postEntry = require(`../pages${post.href}`)
    feed.item({
      title: post.text,
      guid: post.href,
      url: siteUrl + post.href,
      description: ReactDOMServer.renderToStaticMarkup(postEntry.default())
    })
  })
   const output = feed.xml({ indent: true })
   const dir = "./static"
   if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/feed.xml`, output)
    console.log("Generated RSS")
}

export default generateRSS;
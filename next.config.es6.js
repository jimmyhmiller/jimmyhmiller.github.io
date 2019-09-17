const { posts } = require("./pages/index.js")
const { generateRSS } = require("./tools/build_rss.js")
const fs = require("fs");

const dir = "./static"
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

console.log("Generating RSS")
fs.writeFileSync(`${dir}/feed.xml`, generateRSS(posts))
console.log("Generated RSS")
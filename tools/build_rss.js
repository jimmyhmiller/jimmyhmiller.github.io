const RSS = require('rss');

const generateRSS =  (posts) => {
  const siteUrl = "https://jimmyhmiller.github.io"
  const feed = new RSS({
    title: "jimmyhmiller.github.io",
    site_url: siteUrl,
  })
  posts.map(post => {
    feed.item({
      title: post.text,
      guid: post.href,
      url: siteUrl + post.href
    })
  })
  return feed.xml({ indent: true })
}

module.exports = {
  generateRSS
}
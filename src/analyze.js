const cheerio = require('cheerio');

function findContent(dom, callback) {
  const contentList = []
  const $ = cheerio.load(dom);
  $('.xyzx_list a').each((i, ele) => {
        contentList.push({
          id: new Date().getTime(),
          title: ele.attribs.title,
          href: ele.attribs.href,
        })
  })
  callback(contentList);
}

module.exports.findContent = findContent;

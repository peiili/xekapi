const cheerio = require('cheerio');

// 获取列表title
function findTitle(dom, callback) {
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

// 获取文章正文
  function findContent(dom, callback) {

    let contentData = {}
    const $ = cheerio.load(dom);
    contentData = {
      title: $('form[name=_newscontent_fromname] .tit').text(),
      date: $('form[name=_newscontent_fromname] .titx').text().match(/\d{4}-\d{2}-\d{2}/),
      content: [],
    }
    $('form[name=_newscontent_fromname] #vsb_content_3 p font').each((i, ele) => {
      const text = $(ele).eq(0).text() || false;
      const img = $(ele).children('img').length ? $(ele).children('img')[0].attribs.src : false;
      if (text) {
        contentData.content.push(
          {
            text,
            type: 'text',
          },
        )
      } else if (img) {
          contentData.content.push(
            {
              img: img.replace('../../', '/attachment/'),
              type: 'img',
            },
          )
      }

    })
    callback(contentData);
  }

module.exports.findTitle = findTitle;
module.exports.findContent = findContent;

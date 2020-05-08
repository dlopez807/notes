import request from 'request'
import cheerio from 'cheerio'

export default (req, res) => {
  const {
    query: { scripture },
  } = req
  const url = `https://wol.jw.org/en/wol/l/r1/lp-e?q=${scripture}`

  // tagalog url
  // var url = 'https://wol.jw.org/tl/wol/l/r27/lp-tg?q=' + scripture;
  const options = {
    url,
    method: 'GET',
  }

  request(options, (error, response, html) => {
    if (!error) {
      console.log('scripture', scripture)
      const $ = cheerio.load(html)
      const referenceSelector = 'ul.results .cardTitleBlock .cardLine1'
      const textSelector = '.bibleCitation article p span'
      const reference = $(referenceSelector).text()
      if (reference !== '') {
        let text = ''
        $(textSelector).each(function() {
          text += `\n${$(this)
            .clone() // clone the element
            .children() // select all the children
            .remove() // remove all the children
            .end() // again go back to selected element
            .text()}`
        })
        // res.contentType('json');
        // res.send({
        //   success: true,
        //   text: text.trim(),
        //   reference: reference.trim(),
        // });
        res.json({
          success: true,
          scripture,
          text: text.trim(),
          reference: reference.trim(),
        })
      } else {
        // res.contentType('json');
        // res.send({
        //   success: false,
        // });
        res.json({
          success: false,
        })
      }
    } else console.log('error')
  })
}

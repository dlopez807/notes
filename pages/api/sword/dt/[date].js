import request from '../../../../lib/requestDailyText'

export default (req, res) => {
  const {
    query: { date },
  } = req
  const dt = date.replace(/-/g, '/')
  request(dt, res)
}

/*
const year = req.params.year || moment().format('YYYY');
  const month = req.params.month || moment().format('M');
  const day = req.params.day || moment().format('D');
  const url = `https://wol.jw.org/en/wol/dt/r1/lp-e/${year}/${month}/${day}`;
  const options = {
    url,
    method: 'GET',
  };

  request(options, (error, response, html) => {
    if (!error) {
      console.log('daily text');
      const $ = cheerio.load(html);
      const dailyTextSelector = `.todayItems .todayItem.pub-es${moment().format('YY')}`;
      const dailyTextElement = $(dailyTextSelector).text();
      if (dailyTextElement !== '') {
        const date = $(`${dailyTextSelector} header h2`).text();
        const text = $(`${dailyTextSelector} p.themeScrp`).text();
        const comment = $(`${dailyTextSelector} .sb`).text();
        const dailyText = `${date}\n${text}\n${comment}`;
        res.contentType('json');
        res.send({
          success: true,
          date,
          text,
          comment,
          dailyText,
        });
      } else {
        res.contentType('json');
        res.send({
          success: false,
        });
      }
    } else console.log('error');
  });
*/

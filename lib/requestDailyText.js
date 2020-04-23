import request from 'request';
import cheerio from 'cheerio';
import moment from 'moment';

export default (date, res) => {
  const url = `https://wol.jw.org/en/wol/dt/r1/lp-e/${date}`;
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
        const dt = $(`${dailyTextSelector} header h2`).text();
        const text = $(`${dailyTextSelector} p.themeScrp`).text();
        const comment = $(`${dailyTextSelector} .sb`).text();
        const dailyText = `${dt}\n${text}\n${comment}`;
        // res.contentType('json');
        // res.send({
        //   success: true,
        //   date,
        //   text,
        //   comment,
        //   dailyText,
        // });
        res.send({
          success: true,
          date: dt,
          text,
          comment,
          dailyText,
        });
      } else {
        // res.contentType('json');
        res.send({
          success: false,
        });
      }
    } else console.log('error');
  });
};

import axios from 'axios';

export default async (req, res) => {
  const data = {
    text: req.body.text,
  };

  const md = await axios.post('https://marked.now.sh', data);
  /*
const request = require('request')

request.post(
  'https://whatever.com/todos',
  {
    json: {
      todo: 'Buy the milk'
    }
  },
  (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(`statusCode: ${res.statusCode}`)
    console.log(body)
  }
)
  */

  res.json({
    success: true,
    method: req.method,
    message: '/api/md',
    text: req.body.text,
    md: md.data,
  });
};

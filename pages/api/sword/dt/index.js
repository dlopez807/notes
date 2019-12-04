import moment from 'moment';

import request from '../../../../lib/requestDailyText';

export default (req, res) => {
  const date = moment().format('YYYY/M/D');
  request(date, res);
};

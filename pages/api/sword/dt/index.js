import format from 'date-fns/format'

import request from '../../../../lib/requestDailyText'

export default (req, res) => {
  const date = format(new Date(), 'yyyy/M/d')
  request(date, res)
}

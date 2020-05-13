import request from '../../../../lib/requestDailyText'

export default (req, res) => {
  const {
    query: { date },
  } = req
  const dt = date.replace(/-/g, '/')
  request(dt, res)
}

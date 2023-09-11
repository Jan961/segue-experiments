import axios from 'axios'
import moment from 'moment'

export const getSales = ({ SetSalesFiguresDate, SetBookingId }) => {
  return axios.post('/api/marketing/sales/read', { SetSalesFiguresDate: moment(SetSalesFiguresDate).toISOString().split('T')[0], SetBookingId })
    .then(data => data.data)
    .catch(error => console.log(error))
}

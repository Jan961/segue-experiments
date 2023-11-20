import axios from 'axios';
import moment from 'moment';

export const getSales = ({ SetSalesFiguresDate, SetBookingId, isFinalFigures = false }) => {
  return axios
    .post('/api/marketing/sales/read', {
      SetSalesFiguresDate: SetSalesFiguresDate ? SetSalesFiguresDate || moment(SetSalesFiguresDate).toISOString().split('T')[0] : null,
      SetBookingId,
      isFinalFigures,
    })
    .then((data) => data.data)
    .catch((error) => console.log(error));
};

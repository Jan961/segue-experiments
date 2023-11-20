import axios from 'axios';

export const getSales = ({ SetSalesFiguresDate, SetBookingId, isFinalFigures = false }) => {
  return axios
    .post('/api/marketing/sales/read', {
      SetSalesFiguresDate: SetSalesFiguresDate || null,
      SetBookingId,
      isFinalFigures,
    })
    .then((data) => data.data)
    .catch((error) => console.log(error));
};

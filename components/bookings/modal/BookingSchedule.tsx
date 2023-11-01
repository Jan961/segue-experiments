import axios from 'axios';
import { ToolbarButton } from '../ToolbarButton';

type props = {
  TourId: number;
};

const BookingSchedule = ({ TourId }: props) => {
  const onBookingSchedule = () => {
    fetch('/api/reports/bookingSchedule', { method: 'POST', body: JSON.stringify({ TourId }) })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          const tourName: string = `${TourId}`;
          let suggestedName: string | any[] = response.headers.get('Content-Disposition');
          if (suggestedName) {
            suggestedName = suggestedName?.match?.(/filename="(.+)"/);
            suggestedName = suggestedName.length > 0 ? suggestedName[1] : null;
          }
          if (!suggestedName) {
            suggestedName = `${tourName}.xlsx`;
          }
          const content = await response.blob();
          if (content) {
            const anchor: any = document.createElement('a');
            anchor.download = suggestedName;
            anchor.href = (window.webkitURL || window.URL).createObjectURL(content);
            anchor.dataset.downloadurl = [
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              anchor.download,
              anchor.href,
            ].join(':');
            anchor.click();
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return <ToolbarButton onClick={onBookingSchedule}>Travel Summary</ToolbarButton>;
};

export default BookingSchedule;

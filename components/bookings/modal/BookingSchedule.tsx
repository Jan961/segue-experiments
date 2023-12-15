import { ToolbarButton } from '../ToolbarButton';
import { Spinner } from 'components/global/Spinner';
import ExcelIcon from 'components/global/icons/excelIcon';
import { useState } from 'react';

type props = {
  TourId: number;
};

const BookingSchedule = ({ TourId }: props) => {
  const [isLoading, setIsLoading] = useState(false)
  const onBookingSchedule = () => {
    setIsLoading(true)
    fetch('/api/reports/bookingSchedule', { method: 'POST', body: JSON.stringify({ TourId }) })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          const tourName = `${TourId}`;
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
      })
      .finally(()=>{
        setIsLoading(false)
      });
  };
  return <ToolbarButton onClick={onBookingSchedule}  className='flex items-center gap-1'>
    <ExcelIcon height={18} width={18}  />
    {isLoading ? <Spinner className='mr-2' size="sm" />: "Travel Summary"}
    </ToolbarButton>;
};

export default BookingSchedule;

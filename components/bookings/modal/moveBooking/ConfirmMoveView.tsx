import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import { useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { BookingItem } from '../NewBooking/reducer';
import axios from 'axios';
import { formatDate } from 'services/dateService';

interface ConfirmMoveViewProps {
  onClose: (value?: string) => void;
  count: string;
  venue: string;
  productionName: string;
  date: string;
  bookings: BookingItem[];
}
const ConfirmMoveView = ({ bookings, count, venue, productionName, date, onClose }: ConfirmMoveViewProps) => {
  const [moveCompelte, setMoveComplete] = useState<boolean>(false);
  const { goToStep } = useWizard();

  const handleMoveBooking = async () => {
    try {
      await axios.post('/api/bookings/update-run-of-dates', {
        original: bookings,
        updated: bookings,
      });

      setMoveComplete(true);
    } catch (error) {}
  };

  return moveCompelte ? (
    <div className="w-[400px] flex flex-col">
      <Label
        className="my-2 leading-[1.125]"
        variant="md"
        text={`Your ${count} date booking at ${venue}  has been moved to start on ${
          date ? formatDate(date, 'dd/MM/yy') : ''
        } as part of ${productionName}.`}
      />
      <Label
        className="my-2 leading-[1.125]"
        variant="md"
        text="Booking Moved. Please review the booking data, activities, tasks, etc and adjust as needed to suit its new schedule."
      />
      <Button className="w-33 " text="Ok" onClick={() => onClose('success')} />
    </div>
  ) : (
    <div className="w-[400px] flex flex-col">
      <Label
        className="my-2 leading-[1.125]"
        variant="md"
        text={`This date is available. Your ${count} date booking at ${venue} would be moved to start on ${
          date ? formatDate(date, 'dd/MM/yy') : ''
        } as part of ${productionName}.`}
      />
      <Label className="my-2 leading-[1.125]" text={`Are you sure you want to move? `} variant="md" />
      <div className="pt-8 w-full flex justify-end  items-center gap-3">
        <Button className="w-33 " variant="secondary" text="No" onClick={() => goToStep(0)} />
        <Button className="w-33 " variant="primary" text="Yes" onClick={handleMoveBooking} />
      </div>
    </div>
  );
};

export default ConfirmMoveView;

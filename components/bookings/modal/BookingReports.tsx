import { useEffect, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Button from 'components/core-ui-lib/Button';

interface BookingReportProps {
  visible: boolean;
  onClose: () => void;
}

export const BookingReports = ({ visible = false, onClose }: BookingReportProps) => {
  const [open, setOpen] = useState<boolean>(visible);

  const handleModalClose = () => onClose?.();

  useEffect(() => {
    setOpen(visible);
  }, [visible]);

  return (
    <PopupModal
      show={open}
      title="Booking Reports"
      titleClass="text-lg text-primary-navy text-bold -mt-2"
      onClose={handleModalClose}
    >
      <div className="mb-7">
        <Button
          text="Tour Schedule"
          className="w-[230px] h-[30px] mb-3"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName={'excel'}
        ></Button>

        <Button
          text="Travel Summary"
          className="w-[230px] h-[30px] mb-3"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName={'excel'}
        ></Button>

        <Button
          text="All Productions Masterplan"
          className="w-[230px] h-[30px] mb-3"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName={'excel'}
        ></Button>

        <Button
          text="Multiple Pencil Report"
          className="w-[230px] h-[30px] mb-3"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName={'excel'}
        ></Button>
      </div>
    </PopupModal>
  );
};

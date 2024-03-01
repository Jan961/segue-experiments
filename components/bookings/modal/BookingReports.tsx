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
      titleClass="text-xl text-primary-navy text-bold mb-4 -mt-2"
      onClose={handleModalClose}
    >
      <div className="-mb-1">
        <Button
          text="Tour Schedule"
          className="w-[230px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName={'excel'}
        ></Button>

        <Button
          text="Travel Summary"
          className="w-[230px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName={'excel'}
        ></Button>

        <Button
          text="All Productions Masterplan"
          className="w-[230px] mb-3 pl-5"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName={'excel'}
        ></Button>

        <Button
          text="Multiple Pencil Report"
          className="w-[230px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName={'excel'}
        ></Button>
      </div>
    </PopupModal>
  );
};

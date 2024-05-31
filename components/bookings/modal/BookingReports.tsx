import { useEffect, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Button from 'components/core-ui-lib/Button';
import { exportBookingSchedule, exportMasterplanReport, onScheduleReport } from './request';
import { useRecoilValue } from 'recoil';
import { dateBlockSelector } from 'state/booking/selectors/dateBlockSelector';
import { notify } from 'components/core-ui-lib/Notifications';

interface BookingReportProps {
  visible: boolean;
  productionId: number;
  onClose: () => void;
  onExportClick: (key: string) => void;
}

export const BookingReports = ({ visible = false, onClose, productionId }: BookingReportProps) => {
  const [open, setOpen] = useState<boolean>(visible);
  const { scheduleStart, scheduleEnd } = useRecoilValue(dateBlockSelector);

  useEffect(() => {
    setOpen(visible);
  }, [visible]);

  const onExport = async (key: string): Promise<void> => {
    switch (key) {
      case 'tourSchedule':
        notify.promise(onScheduleReport(productionId), {
          loading: 'Generating tour schedule report',
          success: 'Tour schedule report downloaded successfully',
          error: 'Error generating tour schedule report',
        });
        break;
      case 'tourSummary':
        notify.promise(exportBookingSchedule(productionId), {
          loading: 'Generating tour summary report',
          success: 'Tour summary report downloaded successfully',
          error: 'Error generating tour summary report',
        });
        break;
      case 'masterPlan':
        notify.promise(exportMasterplanReport(scheduleStart, scheduleEnd), {
          loading: 'Generating master plan report',
          success: 'Master plan report downloaded successfully',
          error: 'Error generating master plan report',
        });
    }
  };

  return (
    <PopupModal
      show={open}
      title="Booking Reports"
      titleClass="text-xl text-primary-navy text-bold mb-4 -mt-2"
      onClose={onClose}
    >
      <div className="-mb-1">
        <Button
          text="Tour Schedule"
          className="w-[230px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExport('tourSchedule')}
        />

        <Button
          text="Travel Summary"
          className="w-[230px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExport('tourSummary')}
        />

        <Button
          text="All Productions Masterplan"
          className="w-[230px] mb-3 pl-5"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExport('masterPlan')}
        />

        <Button
          text="Multiple Pencil Report"
          className="w-[230px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
        />
        <Button
          text="Export to MyTrBk"
          className="w-[230px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
        />
      </div>
    </PopupModal>
  );
};

import React, { useCallback, useState } from 'react';
import { Button, DateRange, PopupModal, notify } from 'components/core-ui-lib';
import { useRecoilValue } from 'recoil';
import { dateBlockSelector } from 'state/booking/selectors/dateBlockSelector';
import { exportMasterplanReport } from './request';

interface MasterPlanReportModalProps {
  visible: boolean;
  onClose: () => void;
}
const MasterPlanReportModal: React.FC<MasterPlanReportModalProps> = ({ visible, onClose }) => {
  const { scheduleStart, scheduleEnd } = useRecoilValue(dateBlockSelector);
  const [formData, setFormData] = useState(() => ({ fromDate: scheduleStart, toDate: scheduleEnd }));
  const { fromDate, toDate } = formData;

  const onChange = useCallback(
    (key: string, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [setFormData],
  );

  const onExport = useCallback(() => {
    notify.promise(exportMasterplanReport(fromDate, toDate).then(onClose), {
      loading: 'Generating master plan report',
      success: 'Master plan report downloaded successfully',
      error: 'Error generating master plan report',
    });
  }, [fromDate, toDate, onClose]);
  return (
    <PopupModal
      show={visible}
      title="Booking Reports"
      titleClass="text-xl text-primary-navy text-bold mb-4 -mt-2"
      onClose={onClose}
    >
      <DateRange
        label="Date"
        className=" bg-white my-2 w-fit"
        onChange={({ from, to }) => {
          onChange('fromDate', from?.toISOString() || '');
          onChange('toDate', !to ? from?.toISOString() : to?.toISOString() || '');
        }}
        value={{ from: fromDate ? new Date(fromDate) : null, to: toDate ? new Date(toDate) : null }}
      />
      <div className="pt-3 w-full flex items-center justify-end gap-2">
        <Button onClick={onClose} className="float-right px-4 w-33 font-normal" variant="secondary" text="Cancel" />
        <Button
          className="float-right px-4 font-normal w-33 text-center"
          variant="primary"
          sufixIconName="excel"
          iconProps={{ className: 'h-4 w-3' }}
          text="Create Report"
          onClick={onExport}
        />
      </div>
    </PopupModal>
  );
};

export default MasterPlanReportModal;

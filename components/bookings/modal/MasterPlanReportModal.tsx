import React, { useCallback, useState } from 'react';
import { Button, DateRange, PopupModal, notify } from 'components/core-ui-lib';
import { exportMasterplanReport } from './request';
import { newDate } from 'services/dateService';

interface MasterPlanReportModalProps {
  visible: boolean;
  endDate: string;
  onClose: () => void;
}
const MasterPlanReportModal: React.FC<MasterPlanReportModalProps> = ({ visible, onClose, endDate }) => {
  const [formData, setFormData] = useState(() => ({ fromDate: newDate()?.toISOString(), toDate: endDate }));
  const { fromDate, toDate } = formData;

  const onChange = useCallback(
    (key: string, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [setFormData],
  );

  const onExport = useCallback(() => {
    notify.promise(exportMasterplanReport(fromDate, toDate).then(onClose), {
      loading: 'Generating All Productions Masterplan',
      success: 'All Productions Masterplan successfully downloaded',
      error: 'Error generating All Productions Master Plan',
    });
  }, [fromDate, toDate, onClose]);
  return (
    <PopupModal
      hasOverlay={false}
      show={visible}
      title="All Productions Masterplan"
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
        value={{ from: fromDate ? newDate(fromDate) : null, to: toDate ? newDate(toDate) : null }}
      />
      <div className="pt-3 w-full flex items-center justify-end gap-2">
        <Button
          testId="booking-master-plan-report-modal-cancel"
          onClick={onClose}
          className="float-right px-4 w-33 font-normal"
          variant="secondary"
          text="Cancel"
        />
        <Button
          testId="booking-master-plan-report-modal-export"
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

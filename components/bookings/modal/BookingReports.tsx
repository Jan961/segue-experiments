import { useEffect, useMemo, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Button from 'components/core-ui-lib/Button';
import { exportBookingSchedule, onScheduleReport } from './request';
import { notify } from 'components/core-ui-lib/Notifications';
import MasterPlanReportModal from './MasterPlanReportModal';
import { useRecoilValue } from 'recoil';
import BookingHelper from 'utils/booking';
import { productionJumpState } from 'state/booking/productionJumpState';
import { filterState } from 'state/booking/filterState';
import { pick } from 'radash';
import { accessBookingsHome } from 'state/account/selectors/permissionSelector';

interface BookingReportProps {
  visible: boolean;
  productionId: number;
  onClose: () => void;
  onExportClick: (key: string) => void;
}

export const BookingReports = ({ visible = false, onClose, productionId }: BookingReportProps) => {
  const permissions = useRecoilValue(accessBookingsHome);
  const { productions, selected } = useRecoilValue(productionJumpState);
  const filters = useRecoilValue(filterState);
  const lastShowDate = useMemo(() => {
    const helper = new BookingHelper({});
    const { end } = helper.getRangeFromDateBlocks(productions);
    return end;
  }, [productions]);

  const [open, setOpen] = useState<boolean>(visible);
  const [showMasterPlanReportModal, setShowMasterPlanReportModal] = useState(false);

  useEffect(() => {
    setOpen(visible);
  }, [visible]);

  const onExport = async (key: string): Promise<void> => {
    switch (key) {
      case 'tourSchedule':
        notify.promise(onScheduleReport(productionId, pick(filters, ['startDate', 'endDate', 'status', 'venueText'])), {
          loading: 'Generating tour schedule report',
          success: 'Tour schedule report downloaded successfully',
          error: 'Error generating tour schedule report',
        });
        break;
      case 'tourSummary':
        notify.promise(
          exportBookingSchedule(productionId, pick(filters, ['startDate', 'endDate', 'status', 'venueText'])),
          {
            loading: 'Generating Travel Summary Report...',
            success: 'Travel Summary Report downloaded successfully',
            error: 'Error generating Travel Summary Report',
          },
        );
        break;
      case 'masterPlan':
        setShowMasterPlanReportModal(true);
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
          testId="booking-reports-tour-schedule"
          text="Tour Schedule"
          className="w-[230px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExport('tourSchedule')}
          disabled={selected === -1 || !permissions.includes('EXPORT_TOUR_SCHEDULE')}
        />

        <Button
          testId="booking-reports-travel-summary"
          text="Travel Summary"
          className="w-[230px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExport('tourSummary')}
          disabled={selected === -1 || !permissions.includes('EXPORT_TRAVEL_SUMMARY')}
        />

        <Button
          testId="booking-reports-masterplan"
          text="All Productions Masterplan"
          className="w-[230px] mb-3 pl-5"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExport('masterPlan')}
          disabled={!permissions.includes('EXPORT_ALL_PRODUCTIONS_MASTERPLAN')}
        />

        <Button
          testId="booking-reports-multiple-pencil"
          text="Multiple Pencil Report"
          className="w-[230px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          disabled={!permissions.includes('EXPORT_MULTIPLE_PENCIL_REPORT')}
        />
        <Button
          testId="booking-reports-export-mytrbk"
          text="Export to MyTrBk"
          className="w-[230px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          disabled={!permissions.includes('EXPORT_TO_MYTRBK')}
        />
      </div>
      {showMasterPlanReportModal && (
        <MasterPlanReportModal
          endDate={lastShowDate}
          visible={showMasterPlanReportModal}
          onClose={() => setShowMasterPlanReportModal(false)}
        />
      )}
    </PopupModal>
  );
};

import { useCallback, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Button from 'components/core-ui-lib/Button';
import SalesSummaryReportModal from './SalesSummaryReportModal';

interface MarketingReportsProps {
  visible: boolean;
  onClose: () => void;
}

export const MarketingReports = ({ visible = false, onClose }: MarketingReportsProps) => {
  const [activeModal, setActiveModal] = useState<string>(null);

  const onExportClick = useCallback((key: string) => {
    setActiveModal(key);
  }, []);

  const closeActiveModal = useCallback(() => setActiveModal(null), [setActiveModal]);

  return (
    <PopupModal
      show={visible}
      title="Marketing Reports"
      titleClass="text-xl text-primary-navy text-bold mb-4 -mt-2"
      onClose={onClose}
    >
      <div className="-mb-1">
        <Button
          text="Sales Summary"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExportClick('salesSummary')}
        />

        <Button
          text="Sales Summary + Weekly Totals"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
        />

        <Button
          text="Sales vs Capacity %"
          className="w-[262px] mb-3 pl-5"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
        />

        <Button
          text="Total Gross Sales"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
        />

        <Button
          text="Sales Graphs"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
        />

        <Button
          text="Selected Venues"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
        />

        <Button
          text="Promoter Holds"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
        />

        <Button
          text="Holds + Comps"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
        />
      </div>
      {activeModal === 'salesSummary' && (
        <SalesSummaryReportModal visible={activeModal === 'salesSummary'} onClose={closeActiveModal} />
      )}
    </PopupModal>
  );
};

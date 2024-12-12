import { useCallback, useState, useMemo } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Button from 'components/core-ui-lib/Button';
import SalesSummaryAndWeeklyTotalsModal from './SalesSummaryAndWeeklyTotalsModal';
import GrossVenuesPromotorHoldsAndCompsModal from './GrossVenuesPromotorHoldsAndCompsModal';
import SalesGraphModal from './SalesGraphModal';
import { useRecoilValue } from 'recoil';
import { accessMarketingHome } from 'state/account/selectors/permissionSelector';

interface MarketingReportsProps {
  visible: boolean;
  onClose: () => void;
}

export const MarketingReports = ({ visible = false, onClose }: MarketingReportsProps) => {
  const [activeModal, setActiveModal] = useState<string>(null);
  const permissions = useRecoilValue(accessMarketingHome);
  const canAccessSalesSummary = permissions.includes('EXPORT_SALES_SUMMARY');
  const canAccessSalesSummaryAndWeekly = permissions.includes('EXPORT_SALES_SUMARY_+_WEEKLY_TOTALS');
  const canAccessSalesVsCapacity = permissions.includes('EXPORT_SALES_VS_CAPACITY_%');
  const canAccessTotalGrossSales = permissions.includes('EXPORT_TOTAL_GROSS_SALES');
  const canAccessSalesGraph = permissions.includes('EXPORT_SALES_GRAPHS');
  const canAccessSelectedVenues = permissions.includes('EXPORT_SELECTED_VENUES');
  const canAccessPromoterHolds = permissions.includes('EXPORT_PROMOTER_HOLDS');
  const canAccessHoldsAndComps = permissions.includes('EXPORT_HOLDS_+_COMPS');

  const isSummaryWeeklyTotalsOrCapacity = useMemo(
    () => ['salesSummary', 'salesSummaryAndWeeklyTotals', 'salesVsCapacity'].includes(activeModal),
    [activeModal],
  );

  const isGrossVenuesPromotorHoldsAndComps = useMemo(
    () => ['totalGrossSales', 'selectedVenues', 'promotorHolds', 'holdsAndComps'].includes(activeModal),
    [activeModal],
  );

  const onExportClick = useCallback((key: string) => {
    setActiveModal(key);
  }, []);

  const closeActiveModal = useCallback(() => setActiveModal(null), [setActiveModal]);

  return (
    <PopupModal
      hasOverlay={!!activeModal}
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
          disabled={!canAccessSalesSummary}
        />

        <Button
          text="Sales Summary + Weekly Totals"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExportClick('salesSummaryAndWeeklyTotals')}
          disabled={!canAccessSalesSummaryAndWeekly}
        />

        <Button
          text="Sales vs Capacity %"
          className="w-[262px] mb-3 pl-5"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExportClick('salesVsCapacity')}
          disabled={!canAccessSalesVsCapacity}
        />

        <Button
          text="Total Gross Sales"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExportClick('totalGrossSales')}
          disabled={!canAccessTotalGrossSales}
        />

        <Button
          text="Sales Graphs"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExportClick('salesGraphs')}
          disabled={!canAccessSalesGraph}
        />

        <Button
          text="Selected Venues"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExportClick('selectedVenues')}
          disabled={!canAccessSelectedVenues}
        />

        <Button
          text="Promoter Holds"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExportClick('promotorHolds')}
          disabled={!canAccessPromoterHolds}
        />

        <Button
          text="Holds + Comps"
          className="w-[262px] mb-3 pl-6"
          iconProps={{ className: 'h-4 w-3 ml-5' }}
          sufixIconName="excel"
          onClick={() => onExportClick('holdsAndComps')}
          disabled={!canAccessHoldsAndComps}
        />
      </div>
      {isSummaryWeeklyTotalsOrCapacity && (
        <SalesSummaryAndWeeklyTotalsModal
          activeModal={activeModal}
          visible={isSummaryWeeklyTotalsOrCapacity}
          onClose={closeActiveModal}
        />
      )}
      {isGrossVenuesPromotorHoldsAndComps && (
        <GrossVenuesPromotorHoldsAndCompsModal
          visible={isGrossVenuesPromotorHoldsAndComps}
          activeModal={activeModal}
          onClose={closeActiveModal}
        />
      )}
      {activeModal === 'salesGraphs' && (
        <SalesGraphModal visible={activeModal === 'salesGraphs'} onClose={closeActiveModal} />
      )}
    </PopupModal>
  );
};

import { useQuery } from '@tanstack/react-query';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { exportSalesSummaryReport, fetchProductionWeek } from './request';
import { transformToOptions } from 'utils';
import { dateToSimple } from 'services/dateService';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { MAX_WEEK, MIN_WEEK, getWeekOptions, salesSummarySortOptions } from 'config/Reports';
import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import { getCurrentMondayDate } from 'services/reportsService';
import { notify } from 'components/core-ui-lib/Notifications';

interface SalesSummaryReportModalProps {
  visible: boolean;
  onClose: () => void;
  activeModal: string;
}

const defaultFormData = {
  production: null,
  productionWeek: null,
  numberOfWeeks: 2,
  order: 'date',
  productionStartDate: null,
  productionEndDate: null,
};

const getModalTitle = (activeModal: string): string => {
  switch (activeModal) {
    case 'salesSummary':
      return 'Sales Summary';
    case 'salesSummaryAndWeeklyTotals':
      return 'Sales Summary and Weekly Totals';
    case 'salesVsCapacity':
      return 'Sales vs Capacity %';
  }
};

const SalesSummaryReportModal = ({ visible, onClose, activeModal }: SalesSummaryReportModalProps) => {
  const { selected, productions } = useRecoilValue(productionJumpState);
  const [formData, setFormData] = useState({ ...defaultFormData, production: selected });
  const title = useMemo(() => getModalTitle(activeModal), [activeModal]);
  const { production, productionWeek, numberOfWeeks, order } = formData;
  const updateProductionWeek = useCallback(() => {
    const currentWeekMonday = getCurrentMondayDate();
    setFormData((data) => ({ ...data, productionWeek: currentWeekMonday }));
  }, []);
  const { data: weeks = [] } = useQuery({
    queryKey: ['productionWeeks' + production],
    queryFn: async () => {
      if (!production) return;
      const productionWeekPromise = fetchProductionWeek(production);
      notify.promise(productionWeekPromise, {
        loading: 'fetching production weeks',
        success: 'Production weeks fetched successfully',
        error: 'Error fetching production weeks',
      });
      const result = await productionWeekPromise;
      updateProductionWeek();
      return result;
    },
  });

  const prodweekOptions: SelectOption[] = useMemo(
    () =>
      transformToOptions(
        weeks,
        'productionWeekNum',
        'mondayDate',
        (week) => ` Wk ${week.productionWeekNum} | ${dateToSimple(week?.mondayDate)}`,
      ),
    [weeks],
  );

  const weekOptions = useMemo(() => getWeekOptions(MIN_WEEK, MAX_WEEK), []);

  const productionsOptions = useMemo(
    () =>
      productions.map((production) => ({
        text: `${production.ShowCode}${production.Code} ${production.ShowName} ${production.IsArchived ? ' (A)' : ''}`,
        value: production.Id,
      })),
    [productions],
  );

  const onChange = useCallback(
    (key: string, value: string | number) => {
      setFormData((data) => ({ ...data, [key]: value }));
    },
    [setFormData],
  );

  const onExport = useCallback(() => {
    notify.promise(
      exportSalesSummaryReport({
        ...formData,
        ...(activeModal === 'salesSummaryAndWeeklyTotals' && { isWeeklyReport: true }),
        ...(activeModal === 'salesVsCapacity' && { isSeatsDataRequired: true }),
      }).then(() => onClose()),
      {
        loading: `'Generating ${title}...`,
        success: `${title} downloaded successfully`,
        error: `Error generating ${title}`,
      },
    );
  }, [formData, activeModal, title, onClose]);

  return (
    <PopupModal
      titleClass="text-xl text-primary-navy text-bold"
      title={title}
      show={visible}
      onClose={onClose}
      hasOverlay={false}
    >
      <form className="flex flex-col gap-4 w-[383px] mt-4">
        <Select
          label="Production"
          onChange={(value) => onChange('production', value as number)}
          options={productionsOptions}
          value={production}
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Label text="Tour Week" />
            <Select
              className=""
              onChange={(value) => onChange('productionWeek', value as number)}
              options={prodweekOptions}
              value={productionWeek}
              isSearchable
            />
          </div>
          <div className="flex items-center gap-2">
            <Label text="No. Weeks" />
            <Select
              onChange={(value) => onChange('numberOfWeeks', value as number)}
              options={weekOptions}
              value={numberOfWeeks}
              isSearchable
            />
          </div>
        </div>
        {activeModal === 'salesSummary' && (
          <div className="flex items-center gap-2">
            <Label text="Order" />
            <Select
              className="w-full"
              onChange={(value) => onChange('order', value as string)}
              options={salesSummarySortOptions}
              value={order}
            />
          </div>
        )}
        <div className="pt-3 w-full flex items-center justify-end gap-2">
          <Button onClick={onClose} className="float-right px-4 w-33 font-normal" variant="secondary" text="Cancel" />
          <Button
            onClick={onExport}
            className="float-right px-4 font-normal w-33 text-center"
            variant="primary"
            sufixIconName="excel"
            iconProps={{ className: 'h-4 w-3' }}
            text="Create Report"
          />
        </div>
      </form>
    </PopupModal>
  );
};

export default SalesSummaryReportModal;

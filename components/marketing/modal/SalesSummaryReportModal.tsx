import { useQuery } from '@tanstack/react-query';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

interface SalesSummaryReportModalProps {
  visible: boolean;
  onClose: () => void;
}

const defaultFormData = {
  production: null,
  productionWeek: null,
  numberOfWeeks: 2,
  order: null,
  productionStartDate: null,
  productionEndDate: null,
};
const SalesSummaryReportModal = ({ visible, onClose }: SalesSummaryReportModalProps) => {
  const productionJump = useRecoilValue(productionJumpState);
  const [formData, setFormData] = useState(defaultFormData);
  const { production, productionWeek, numberOfWeeks, order } = formData;
  const { data: weeks = [] } = useQuery({
    queryKey: ['productionWeeks' + production],
    queryFn: () => fetchProductionWeek(production),
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

  useEffect(() => {
    const currentWeekMonday = getCurrentMondayDate();
    setFormData((data) => ({ ...data, productionWeek: currentWeekMonday }));
  }, [weeks]);
  const weekOptions = useMemo(() => getWeekOptions(MIN_WEEK, MAX_WEEK), []);

  const productionsOptions = useMemo(
    () =>
      productionJump.productions.map((production) => ({
        text: `${production.ShowCode}${production.Code} ${production.ShowName} ${production.IsArchived ? ' (A)' : ''}`,
        value: production.Id,
      })),
    [productionJump],
  );

  const onChange = useCallback((key: string, value: string | number) => {
    setFormData((data) => ({ ...data, [key]: value }));
  }, []);

  const onExport = useCallback(() => {
    exportSalesSummaryReport(formData)
      .then(() => onClose())
      .catch(() => console.log('Error exporting report'));
  }, [formData, onClose]);

  return (
    <PopupModal titleClass="text-xl text-primary-navy text-bold" title="Sales Summary" show={visible} onClose={onClose}>
      <form className="flex flex-col gap-4 w-[383px] mt-4">
        <Select
          label="Production"
          onChange={(value) => onChange('production', value)}
          options={productionsOptions}
          value={production}
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Label text="Tour Week" />
            <Select
              className=""
              onChange={(value) => onChange('productionWeek', value)}
              options={prodweekOptions}
              value={productionWeek}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label text="No. Weeks" />
            <Select
              onChange={(value) => onChange('numberOfWeeks', value)}
              options={weekOptions}
              value={numberOfWeeks}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label text="Order" />
          <Select
            className="w-full"
            onChange={(value) => onChange('order', value)}
            options={salesSummarySortOptions}
            value={order}
          />
        </div>
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

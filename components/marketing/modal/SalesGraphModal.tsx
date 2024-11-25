import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import Checkbox from 'components/core-ui-lib/Checkbox';
import DateInput from 'components/core-ui-lib/DateInput';
import { marketingGraphOptions } from 'config/Reports';
import ProductionSelector from 'components/productions/ProductionSelector';
import { newDate } from 'services/dateService';

interface SalesSummaryReportModalProps {
  visible: boolean;
  onClose: () => void;
}

const defaultFormData = {
  production: null,
  graph: null,
  finalFigures: false,
  production1: null,
  production2: null,
  salesFigureDate: newDate(),
};
const SalesSummaryReportModal = ({ visible, onClose }: SalesSummaryReportModalProps) => {
  const { productions } = useRecoilValue(productionJumpState);
  const [formData, setFormData] = useState(defaultFormData);
  const { graph, finalFigures, salesFigureDate } = formData;

  const onChange = useCallback((key: string, value: string | number) => {
    setFormData((data) => ({ ...data, [key]: value }));
  }, []);

  return (
    <PopupModal titleClass="text-xl text-primary-navy text-bold" title="Sales Graphs" show={visible} onClose={onClose}>
      <form className="flex flex-col gap-4 w-[600px] mt-4">
        <div className="flex items-center gap-2">
          <Label text="Graph" />
          <Select
            className="w-[312px]"
            onChange={(value) => onChange('graph', value as string)}
            options={marketingGraphOptions}
            value={graph}
          />
        </div>
        <div className="flex flex-row mb-4">
          <DateInput
            onChange={(value) => onChange('salesFigureDate', value.toISOString())}
            value={salesFigureDate}
            label="Sales Figures Date"
            inputClass="!border-0 !shadow-none"
            labelClassName="text-primary-input-text"
          />

          <div className="flex flex-col ml-[50px]">
            <Checkbox
              className="ml-5 mt-2"
              labelClassName="!text-base text-primary-input-text"
              label="Final Figures"
              id="finalFigures"
              name="finalFigures"
              checked={finalFigures}
              onChange={(e) => onChange('finalFigures', e.target.checked)}
            />
          </div>
        </div>
        <p className="text-primary-input-text font-bold ">Compare with</p>
        <ProductionSelector productions={productions} onChange={(value) => onChange('production1', value)} />
        <ProductionSelector productions={productions} onChange={(value) => onChange('production2', value)} />
        <div className="pt-3 w-full flex items-center justify-end gap-2">
          <Button onClick={onClose} className="float-right px-4 w-33 font-normal" variant="secondary" text="Cancel" />
          <Button
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

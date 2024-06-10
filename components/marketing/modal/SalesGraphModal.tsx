import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import Checkbox from 'components/core-ui-lib/Checkbox';
import DateInput from 'components/core-ui-lib/DateInput';

interface SalesSummaryReportModalProps {
  visible: boolean;
  onClose: () => void;
}

const defaultFormData = {
  production: null,
  graph: null,
  finalFigures: false,
  includeArchived: false,
  includeArchivedTour1: false,
  includeArchivedTour2: false,
  tour1production: null,
  tour2production: null,
  salesFigureDate: new Date(),
};
const SalesSummaryReportModal = ({ visible, onClose }: SalesSummaryReportModalProps) => {
  const productionJump = useRecoilValue(productionJumpState);
  const [formData, setFormData] = useState(defaultFormData);
  const {
    production,
    graph,
    finalFigures,
    includeArchived,
    includeArchivedTour1,
    includeArchivedTour2,
    tour1production,
    tour2production,
    salesFigureDate,
  } = formData;
  const graphOptions = [];

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

  return (
    <PopupModal titleClass="text-xl text-primary-navy text-bold" title="Sales Graphs" show={visible} onClose={onClose}>
      <form className="flex flex-col gap-4 w-[600px] mt-4">
        <div className="flex items-center gap-2">
          <Label text="Graph" />
          <Select
            className="w-[312px]"
            onChange={(value) => onChange('graph', value)}
            options={graphOptions}
            value={graph}
          />
        </div>
        <div className="bg-white border-primary-border rounded-md border shadow-md max-w-[550px]">
          <div className="rounded-l-md">
            <div className="flex items-center">
              <Select
                className="border-0 !shadow-none w-[410px]"
                label="Production"
                onChange={(value) => onChange('production', value)}
                options={productionsOptions}
                value={production}
              />
              <div className="flex items-center ml-1 float-end">
                <Checkbox
                  id="IncludeArchived"
                  label="Include archived"
                  checked={includeArchived}
                  onChange={(e) => onChange('includeArchived', e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row mb-4">
          <div className="flex flex-col w-[262px]">
            <DateInput
              onChange={(value) => onChange('salesFigureDate', value.toISOString())}
              value={salesFigureDate}
              label="Sales Figures Date"
              inputClass="!border-0 !shadow-none"
              labelClassName="text-primary-input-text"
            />
          </div>

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
        <div className="flex items-center gap-2">
          <Label text="Tour 1" />
          <div className="bg-white border-primary-border rounded-md border shadow-md max-w-[550px]">
            <div className="rounded-l-md">
              <div className="flex items-center">
                <Select
                  className="border-0 !shadow-none w-[390px]"
                  label="Production"
                  onChange={(value) => onChange('tour1production', value)}
                  options={productionsOptions}
                  value={tour1production}
                />
                <div className="flex items-center ml-1 mr-3">
                  <Checkbox
                    id="IncludeArchived"
                    label="Include archived"
                    checked={includeArchivedTour1}
                    onChange={(e) => onChange('includeArchivedTour1', e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label text="Tour 2" />
          <div className="bg-white border-primary-border rounded-md border shadow-md max-w-[550px]">
            <div className="rounded-l-md">
              <div className="flex items-center">
                <Select
                  className="border-0 !shadow-none w-[390px]"
                  label="Production"
                  onChange={(value) => onChange('tour2production', value)}
                  options={productionsOptions}
                  value={tour2production}
                />
                <div className="flex items-center ml-1 mr-3">
                  <Checkbox
                    id="IncludeArchived"
                    label="Include archived"
                    checked={includeArchivedTour2}
                    onChange={(e) => onChange('includeArchivedTour2', e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

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

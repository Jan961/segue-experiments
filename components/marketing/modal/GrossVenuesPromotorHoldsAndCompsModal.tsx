import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';

import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import DateRange from 'components/core-ui-lib/DateRange';

interface GrossVenuesPromotorHoldsAndCompsModalProps {
  visible: boolean;
  onClose: () => void;
  activeModal: string;
}

const defaultFormData = {
  production: null,
  selection: null,
  fromDate: null,
  toDate: null,
  venue: null,
};
const GrossVenuesPromotorHoldsAndCompsModal = ({
  visible,
  onClose,
  activeModal,
}: GrossVenuesPromotorHoldsAndCompsModalProps) => {
  const productionJump = useRecoilValue(productionJumpState);
  const [formData, setFormData] = useState(defaultFormData);
  const { production, selection, fromDate, toDate, venue } = formData;
  const selectionOptions = [];
  const venueOptions = [];
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

  const returnModalTitle = (): string => {
    switch (activeModal) {
      case 'totalGrossSales':
        return 'Tour Gross Sales';
      case 'selectedVenues':
        return 'Selected Venues';
      case 'promotorHolds':
        return 'Promoter Holds';
      case 'holdsAndComps':
        return 'Holds and Comps';
    }
  };

  return (
    <PopupModal
      titleClass="text-xl text-primary-navy text-bold"
      title={returnModalTitle()}
      show={visible}
      onClose={onClose}
    >
      <form className="flex flex-col gap-2 w-[383px] mt-4">
        <Select
          label="Production"
          onChange={(value) => onChange('production', value)}
          options={productionsOptions}
          value={production}
        />

        {['holdsAndComps', 'promotorHolds'].includes(activeModal) && (
          <DateRange
            label="Date"
            className=" bg-white my-2 w-fit"
            onChange={({ from, to }) => {
              onChange('fromDate', from?.toISOString() || '');
              onChange('toDate', !to ? from?.toISOString() : to?.toISOString() || '');
            }}
            value={{ from: fromDate ? new Date(fromDate) : null, to: toDate ? new Date(toDate) : null }}
          />
        )}

        {['holdsAndComps', 'promotorHolds'].includes(activeModal) && (
          <Select
            label="Venue"
            onChange={(value) => onChange('venue', value)}
            options={venueOptions}
            value={venue}
            placeholder="Please select a venue"
          />
        )}

        {['holdsAndComps', 'selectedVenues'].includes(activeModal) && (
          <div className="flex items-center gap-2">
            <Label text="Selection" />
            <Select
              className="w-full"
              onChange={(value) => onChange('selection', value)}
              options={selectionOptions}
              value={selection}
            />
          </div>
        )}

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

export default GrossVenuesPromotorHoldsAndCompsModal;

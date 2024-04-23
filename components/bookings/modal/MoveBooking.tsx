import Label from 'components/core-ui-lib/Label';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { productionOptionsSelector } from 'state/booking/selectors/productionOptionsSelector';
import { BookingItem } from './NewBooking/reducer';
import DateInput from 'components/core-ui-lib/DateInput';

interface MoveBookingProps {
  visible: boolean;
  onClose: (bookings?: any) => void;
  productionCode: string;
  productionId: number;
  startDate?: string;
  endDate?: string;
  bookings: BookingItem[];
}

const MoveBooking = ({
  visible,
  onClose,
  productionCode,
  productionId,
  startDate,
  endDate,
  bookings = [],
}: MoveBookingProps) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [hasOverlay, setHasOverlay] = useState<boolean>(false);

  const [selectedProduction, setSelectedProduction] = useState<SelectOption>(undefined);
  const productionOptions = useRecoilValue(productionOptionsSelector(true));

  const fomrattedProductions = useMemo(() => {
    if (productionId && productionOptions) {
      return productionOptions.map((po) => (po.value === productionId ? { ...po, text: `${po.text} *` } : po));
    }
    return [];
  }, [productionId, productionOptions]);

  useEffect(() => {
    if (productionId && fomrattedProductions) {
      setSelectedProduction(fomrattedProductions.find(({ value }) => value === productionId));
    }
  }, [fomrattedProductions, productionId]);

  const handleProductionChange = (value) => {};

  return (
    <PopupModal
      show={visible}
      onClose={() => onClose()}
      titleClass="text-xl text-primary-navy text-bold"
      title="Move Booking"
      panelClass="relative"
      hasOverlay={hasOverlay}
    >
      <div className="w-[485px]">
        <div className="text-primary-navy text-xl my-2 font-bold">{productionCode}</div>
        <Label className="text-md my-2" text={`Move <xx> date booking at <VENUE NAME>`} />
        <div className="w-[400px] flex flex-col items-end">
          <Select
            className="w-full"
            label="Production"
            name="production"
            placeholder="Please select a Production"
            value={selectedProduction?.value}
            options={fomrattedProductions}
            isClearable={false}
            onChange={(production) => handleProductionChange({ productionId: production })}
          />
          <Label className="text-md" text="*Current Production" />
        </div>
        <div>
          <Label text="New start date" />
          <DateInput />
        </div>
      </div>
    </PopupModal>
  );
};

export default MoveBooking;

import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';

import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import DateRange from 'components/core-ui-lib/DateRange';
import {
  exportHoldsComps,
  exportProductionGrossSales,
  exportPromoterHoldsReport,
  exportSelectedVenues,
  fetchProductionVenues,
} from './request';
import { notify } from 'components/core-ui-lib';
import { useQuery } from '@tanstack/react-query';
import { transformToOptions } from 'utils';
import { SelectOption } from 'components/core-ui-lib/Select/Select';

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

const getModalTitle = (activeModal: string): string => {
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

const GrossVenuesPromotorHoldsAndCompsModal = ({
  visible,
  onClose,
  activeModal,
}: GrossVenuesPromotorHoldsAndCompsModalProps) => {
  const productionJump = useRecoilValue(productionJumpState);
  const [formData, setFormData] = useState(defaultFormData);
  const title = useMemo(() => getModalTitle(activeModal), [activeModal]);
  const { production, selection, fromDate, toDate, venue } = formData;
  const selectionOptions = [];
  const productionsOptions = useMemo(
    () =>
      productionJump.productions.map((production) => ({
        text: `${production.ShowCode}${production.Code} ${production.ShowName} ${production.IsArchived ? ' (A)' : ''}`,
        value: production.Id,
      })),
    [productionJump],
  );
  const { data: venues = [] } = useQuery({
    queryKey: ['productionWeeks' + production],
    queryFn: () => {
      if (!production || !['promoterHolds', 'holdsAndComps'].includes(activeModal)) return;
      const productionVenuesPromise = fetchProductionVenues(production);
      notify.promise(productionVenuesPromise, {
        loading: 'fetching production venues',
        success: 'Production venues fetched successfully',
        error: 'Error fetching production venues',
      });
      return productionVenuesPromise;
    },
  });

  const prodVenuesOptions: SelectOption[] = useMemo(
    () =>
      transformToOptions(
        venues,
        'Name',
        'Id',
        // (week) => ` Wk ${week.productionWeekNum} | ${dateToSimple(week?.mondayDate)}`,
      ),
    [venues],
  );

  const onChange = useCallback((key: string, value: string | number) => {
    setFormData((data) => ({ ...data, [key]: value }));
  }, []);

  const onExport = useCallback(() => {
    const selectedProduction = productionJump.productions?.find((prod) => prod.Id === parseInt(production));
    const productionCode = selectedProduction ? `${selectedProduction?.ShowCode}${selectedProduction?.Code}` : null;
    let promise;
    switch (activeModal) {
      case 'promoterHolds': {
        promise = exportPromoterHoldsReport({ ...formData, productionCode }).then(() => onClose());
        break;
      }
      case 'totalGrossSales':
        promise = exportProductionGrossSales({ ...formData }).then(() => onClose());
        break;
      case 'holdsAndComps':
        promise = exportHoldsComps({ ...formData, productionCode }).then(() => onClose());
        break;
      case 'selectedVenues':
        promise = exportSelectedVenues({ ...formData, productionCode, showId: selectedProduction.ShowId }).then(() =>
          onClose(),
        );
        break;
    }
    notify.promise(promise, {
      loading: `Generating ${title}`,
      success: `${title} downloaded successfully`,
      error: `Error generating ${title}`,
    });
  }, [activeModal, formData, onClose, production, productionJump.productions, title]);

  return (
    <PopupModal
      titleClass="text-xl text-primary-navy text-bold"
      title={title}
      show={visible}
      onClose={onClose}
      hasOverlay={true}
    >
      <form className="flex flex-col gap-2 w-[383px] mt-4">
        <Select
          label="Production"
          onChange={(value) => onChange('production', value as number)}
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
            onChange={(value) => onChange('venue', value as number)}
            options={prodVenuesOptions}
            value={venue}
            placeholder="Please select a venue"
          />
        )}

        {['holdsAndComps', 'selectedVenues'].includes(activeModal) && (
          <div className="flex items-center gap-2">
            <Label text="Selection" />
            <Select
              className="w-full"
              onChange={(value) => onChange('selection', value as string)}
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
            onClick={onExport}
          />
        </div>
      </form>
    </PopupModal>
  );
};

export default GrossVenuesPromotorHoldsAndCompsModal;

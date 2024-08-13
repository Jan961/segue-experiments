import { useCallback, useMemo, useState } from 'react';
import { DateInput, Label, Select, TextInput } from 'components/core-ui-lib';
import { booleanOptions, paymentTypes } from 'config/contracts';
import { noop, transformToOptions } from 'utils';
import WeeklyPayDetails from '../contractDetails/WeeklyPayDetails';
import TotalPayDetails from '../contractDetails/TotalPayDetails';
import PaymentBreakdown, { TPaymentBreakdown, defaultPaymentBreakdown } from '../contractDetails/PaymentBreakdown';
import { replace } from 'radash';
import { useRecoilValue } from 'recoil';
import { currencyListState } from 'state/productions/currencyState';

const defaultContractDetails = {
  currency: null,
  firstDayOfWork: null,
  lastDayOfWork: null,
  specificAvailabilityNotes: '',
  publicityEventNotes: '',
  publicityEventDate: null,
  requiredAtSpecificPublicityEvents: null,
  rehearsalVenue: {
    townCity: '',
    venue: null,
    notes: '',
  },
  isAccomodationProvided: false,
  accomodationNotes: '',
  isTransportProvided: false,
  transportNotes: '',
  isNominatedDriver: false,
  nominatedDriverNotes: '',
  paymentType: null,
  weeklyPayDetails: null,
  totalPayDetails: null,
  paymentBreakdownList: [defaultPaymentBreakdown],
  cancellationFee: 0,
  cancellationFeeNotes: '',
  includeAdditionalClauses: false,
  additionalClause: null,
  customClause: '',
};

interface ContractDetailsProps {
  onChange?: (data: any) => void;
}

const ContractDetails = ({ onChange = noop }: ContractDetailsProps) => {
  const [contractDetails, setContractDetails] = useState(defaultContractDetails);
  const {
    currency,
    firstDayOfWork,
    lastDayOfWork,
    specificAvailabilityNotes,
    publicityEventNotes,
    publicityEventDate,
    requiredAtSpecificPublicityEvents,
    rehearsalVenue,
    isAccomodationProvided,
    accomodationNotes,
    isTransportProvided,
    transportNotes,
    isNominatedDriver,
    nominatedDriverNotes,
    paymentType,
    paymentBreakdownList,
    cancellationFee,
    cancellationFeeNotes,
    includeAdditionalClauses,
    additionalClause,
    customClause,
  } = contractDetails;
  const { townCity, notes, venue } = rehearsalVenue;
  const currencyList = useRecoilValue(currencyListState);
  const currencyOptions = useMemo(() => transformToOptions(currencyList, 'name', 'code'), [currencyList]);
  const currencySymbol = useMemo(() => '£', [currency]);
  const handleChange = useCallback(
    (key: string, value: number | string | boolean | TPaymentBreakdown[]) => {
      const updatedData = { ...contractDetails, [key]: value };
      setContractDetails(updatedData);
      onChange(updatedData);
    },
    [onChange, contractDetails],
  );
  const onRehearsalVenueChange = useCallback(
    (key: string, value: number | string | boolean | null) => {
      const updatedRehearsalVenue = {
        ...rehearsalVenue,
        [key]: value,
      };
      const updatedData = { ...contractDetails, rehearsalVenue: updatedRehearsalVenue };
      setContractDetails(updatedData);
    },
    [rehearsalVenue, contractDetails, setContractDetails],
  );
  return (
    <form className="flex flex-col gap-4 mb-7">
      <div className="flex items-center gap-2">
        <Label className="w-36 !font-bold text-sm" text="Currency for contract" />
        <Select
          testId="contract-details-currency"
          placeholder="Select Currency"
          value={currency}
          onChange={(value) => handleChange('currency', value as string)}
          options={currencyOptions}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-36 !font-bold text-sm" text="First Day of Work" />
        <DateInput
          testId="contract-details-first-day-work"
          placeholder="DD/MM/YY"
          value={firstDayOfWork}
          onChange={(value) => handleChange('firstDayOfWork', value?.toISOString?.() || '')}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-36 !font-bold text-sm" text="Last Day of Work" />
        <DateInput
          testId="contract-details-last-day-work"
          placeholder="DD/MM/YY"
          value={lastDayOfWork}
          onChange={(value) => handleChange('lastDayOfWork', value?.toISOString?.() || '')}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-36 !font-bold text-sm" text="Specific Availability" />
        <TextInput
          testId="contract-details-first-day-work"
          placeholder="Specific availability notes"
          value={specificAvailabilityNotes}
          onChange={(event) => handleChange('specificAvailabilityNotes', event.target.value)}
        />
      </div>
      <div className="flex items-start gap-4">
        <div className="flex items-start gap-2">
          <Label className="!font-bold text-sm w-36" text="Required at Specific Publicity Events" />
          <Select
            testId="contract-details-currency"
            placeholder="Yes | No"
            value={requiredAtSpecificPublicityEvents}
            onChange={(value) => handleChange('requiredAtSpecificPublicityEvents', value as boolean)}
            options={booleanOptions}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="!font-bold text-sm" text="If YES, " />
          <DateInput
            disabled={!requiredAtSpecificPublicityEvents}
            testId="contract-details-publicity-event-date"
            placeholder="DD/MM/YY"
            value={publicityEventDate}
            onChange={(value) => handleChange('publicityEventDate', value?.toISOString?.() || '')}
          />
        </div>
        <TextInput
          disabled={!requiredAtSpecificPublicityEvents}
          testId="contract-details-publicity-event-notes"
          placeholder="Publicity Event Notes"
          className="flex-1"
          value={publicityEventNotes}
          onChange={(event) => handleChange('publicityEventNotes', event.target.value)}
        />
      </div>
      <div className="flex items-start gap-2">
        <Label className="!font-bold text-sm w-36" text="Rehearsal Venue" />
        <div className="flex flex-col gap-2">
          <TextInput
            testId="contract-details-rehearsal-venue-town-city"
            placeholder="Enter Town/City"
            value={townCity}
            onChange={(event) => onRehearsalVenueChange('townCity', event.target.value)}
          />
          <Select
            testId="contract-details-rehearsal-venue-id"
            placeholder="Select Venue"
            value={venue}
            onChange={(value) => onRehearsalVenueChange('venue', value as number)}
            options={[]}
          />
          <TextInput
            testId="contract-details-rehearsal-venue-notes"
            placeholder="Rehearsal Venue Notes"
            value={notes}
            onChange={(event) => onRehearsalVenueChange('notes', event.target.value)}
          />
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex items-start gap-2">
          <Label className="!font-bold text-sm w-36" text="Accommodation Provided?" />
          <Select
            testId="contract-details-is-accomodation-provided"
            placeholder="Yes | No"
            value={isAccomodationProvided}
            onChange={(value) => handleChange('isAccomodationProvided', value as boolean)}
            options={booleanOptions}
          />
        </div>
        <Label className="!font-bold text-sm" text="If YES, Notes" />
        <TextInput
          disabled={!isAccomodationProvided}
          testId="contract-details-accomodation-notes"
          placeholder="Accomodation Notes"
          value={accomodationNotes}
          onChange={(event) => handleChange('accomodationNotes', event.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="!font-bold text-sm w-36" text="Transport Provided?" />
          <Select
            testId="contract-details-is-accomodation-provided"
            placeholder="Yes | No"
            value={isTransportProvided}
            onChange={(value) => handleChange('isTransportProvided', value as boolean)}
            options={booleanOptions}
          />
        </div>
        <Label className="!font-bold text-sm" text="If YES, Notes" />
        <TextInput
          disabled={!isTransportProvided}
          testId="contract-details-transport-notes"
          placeholder="Transport Notes"
          value={transportNotes}
          onChange={(event) => handleChange('transportNotes', event.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="!font-bold text-sm w-36" text="Nomnated Driver?" />
          <Select
            testId="contract-details-is-nominated-driver"
            placeholder="Yes | No"
            value={isNominatedDriver}
            onChange={(value) => handleChange('isNominatedDriver', value as boolean)}
            options={booleanOptions}
          />
        </div>
        <Label className="!font-bold text-sm" text="If YES, Notes" />
        <TextInput
          disabled={!isTransportProvided}
          testId="contract-details-nominated-driver-notes"
          placeholder="Driver Notes"
          value={nominatedDriverNotes}
          onChange={(event) => handleChange('nominatedDriverNotes', event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-xl text-primary-navy font-bold mb-3 uppercase">Payment Details</div>
        <div className="flex items-center gap-2">
          <Label className="!font-bold text-sm w-52" text="Type of Payment" />
          <Select
            testId="contract-details-is-nominated-driver"
            placeholder="Please Select Payment Type"
            value={paymentType}
            onChange={(value) => handleChange('paymentType', value as boolean)}
            options={paymentTypes}
          />
        </div>
        <div className="flex gap-14">
          <div className="flex flex-col gap-4">
            <Label className="!font-bold text-sm w-52" text="If Weekly payment:" />
            <WeeklyPayDetails onChange={(value) => handleChange('weeklyPayDetails', value as boolean)} />
          </div>
          <div className="flex flex-col gap-4">
            <Label className="!font-bold text-sm w-52" text="If Total Pay:" />
            <TotalPayDetails onChange={(value) => handleChange('totalPayDetails', value as boolean)} />
          </div>
        </div>
        <div className="flex items-start gap-4 w-full">
          <Label className="!font-bold w-36" text="Payment Breakdown" />
          {paymentBreakdownList.map((paymentBreakdown, i) => (
            <PaymentBreakdown
              key={i}
              breakdown={paymentBreakdown}
              currencySymbol={currencySymbol}
              onChange={(change) =>
                handleChange(
                  'paymentBreakdownList',
                  replace(paymentBreakdownList, change, (_, idx) => idx === i) as TPaymentBreakdown[],
                )
              }
            />
          ))}
        </div>
        <div className="flex items-start gap-4 w-full">
          <Label className="!font-bold w-36" text="Cancellation Fee" />
          <div className="flex items-center gap-2 w-full">
            <div className="flex items-center">
              <Label className="text-sm" text={currencySymbol} />
              <TextInput
                placeholder="00.00"
                value={cancellationFee}
                onChange={(event) => handleChange('cancellationFee', event.target.value)}
              />
            </div>
            <TextInput
              className="grow"
              inputClassName="grow"
              placeholder="Cancellation Payment Notes"
              value={cancellationFeeNotes}
              onChange={(event) => handleChange('cancellationFeeNotes', event.target.value)}
            />
          </div>
        </div>
        <div className="flex -items-center gap-2">
          <Label className="w-60 !font-bold" text="Include Additional Clauses in Contract?" />
          <Select
            testId="contract-details-is-nominated-driver"
            placeholder="Yes | No"
            value={includeAdditionalClauses}
            onChange={(value) => handleChange('includeClauses', value as boolean)}
            options={booleanOptions}
          />
        </div>
        <div className="flex -items-center gap-8 w-full">
          <Label className="w-60 text-right !font-bold" text="If YES," />
          <div className="flex flex-col gap-2 w-full">
            <Select
              className="w-60"
              testId="contract-details-is-nominated-driver"
              placeholder="Please Select a Clause"
              value={additionalClause}
              onChange={(value) => handleChange('additionalClause', value as number)}
              options={[]}
            />
            <TextInput
              className="grow"
              inputClassName="grow"
              placeholder="Custom Clause"
              value={customClause}
              onChange={(event) => handleChange('customClause', event.target.value)}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContractDetails;

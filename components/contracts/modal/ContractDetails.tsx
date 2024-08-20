import { useCallback, useMemo, useState } from 'react';
import { DateInput, Icon, Label, Select, TextInput } from 'components/core-ui-lib';
import { booleanOptions, paymentTypes } from 'config/contracts';
import { insertAtPos, noop, removeAtPos, replaceAtPos, transformToOptions } from 'utils';
import WeeklyPayDetails from '../contractDetails/WeeklyPayDetails';
import TotalPayDetails from '../contractDetails/TotalPayDetails';
import PaymentBreakdown, { TPaymentBreakdown, defaultPaymentBreakdown } from '../contractDetails/PaymentBreakdown';
import { replace } from 'radash';
import { useRecoilValue } from 'recoil';
import { currencyListState } from 'state/productions/currencyState';
import PublicityEventDetails, { IPublicityEventDetails, defaultPublicityEventDetails } from './PublicityEventDetails';
import { contractsVenueState } from 'state/contracts/contractsVenueState';
import { standardClauseState } from 'state/contracts/standardClauseState';
import { IContractDetails } from '../types';

const defaultContractDetails = {
  currency: null,
  firstDayOfWork: null,
  lastDayOfWork: null,
  specificAvailabilityNotes: '',
  publicityEventList: [defaultPublicityEventDetails],
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
  customClauseList: [''],
};

interface ContractDetailsProps {
  contract: any;
  onChange?: (data: any) => void;
}

const ContractDetails = ({ contract = {}, onChange = noop }: ContractDetailsProps) => {
  const [contractDetails, setContractDetails] = useState<IContractDetails>({ ...defaultContractDetails, ...contract });
  const venueMap = useRecoilValue(contractsVenueState);
  const stdClauseMap = useRecoilValue(standardClauseState);
  const venueOptions = useMemo(
    () => transformToOptions(Object.values(venueMap), null, 'Id', (v) => `${v.Code} ${v.Name}`),
    [venueMap],
  );
  const clauseOptions = useMemo(() => transformToOptions(Object.values(stdClauseMap), 'title', 'id'), [stdClauseMap]);
  const {
    currency,
    firstDayOfWork,
    lastDayOfWork,
    specificAvailabilityNotes,
    publicityEventList = [],
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
    customClauseList,
    weeklyPayDetails,
    totalPayDetails,
  } = contractDetails;
  const { townCity, notes, venue } = rehearsalVenue;
  const currencyList = useRecoilValue(currencyListState);
  const currencyOptions = useMemo(() => transformToOptions(currencyList, 'name', 'code'), [currencyList]);
  const currencySymbol = useMemo(() => '£', [currency]);

  const handleChange = useCallback(
    (key: string, value: number | string | boolean | string[] | TPaymentBreakdown[] | IPublicityEventDetails[]) => {
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
      onChange(updatedData);
    },
    [rehearsalVenue, contractDetails, setContractDetails],
  );

  return (
    <form className="flex flex-col gap-4 mb-7">
      <div className="flex items-center gap-2">
        <Label className="w-36 !font-bold text-sm" text="Currency for contract" />
        <Select
          testId="contract-details-currency"
          className="w-96"
          placeholder="Select Currency"
          value={currency}
          onChange={(value) => handleChange('currency', value as string)}
          options={currencyOptions}
          isSearchable
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
          testId="contract-details-specific-availability-notes"
          placeholder="Specific availability notes"
          value={specificAvailabilityNotes}
          onChange={(event) => handleChange('specificAvailabilityNotes', event.target.value)}
        />
      </div>
      <div className="flex flex-row gap-2">
        <Label className="!font-bold text-sm w-36" text="Required at Specific Publicity Events" />
        <div className="flex flex-col gap-2">
          {publicityEventList.map((publicityEvent, i) => (
            <div key={i} className="flex gap-2 items-center">
              <PublicityEventDetails
                testId={`contract-details-publicity-event-${i}`}
                details={publicityEvent}
                onChange={(details) => handleChange('publicityEventList', replaceAtPos(publicityEventList, details, i))}
              />
              <div
                className="cursor-pointer"
                onClick={() =>
                  handleChange(
                    'publicityEventList',
                    insertAtPos(publicityEventList, defaultPublicityEventDetails, i + 1),
                  )
                }
              >
                <Icon iconName="plus-circle-solid" />
              </div>
              {i > 0 && (
                <div
                  className="cursor-pointer"
                  onClick={() => handleChange('publicityEventList', removeAtPos(publicityEventList, i))}
                >
                  <Icon iconName="minus-circle-solid" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Label className="!font-bold text-sm w-36" text="Rehearsal Venue" />
        <div className="flex flex-col gap-2">
          <TextInput
            className="w-96"
            testId="contract-details-rehearsal-venue-town-city"
            placeholder="Enter Town/City"
            value={townCity}
            onChange={(event) => onRehearsalVenueChange('townCity', event.target.value)}
          />
          <Select
            testId="contract-details-rehearsal-venue-id"
            className="w-96"
            placeholder="Select Venue"
            value={venue}
            onChange={(value) => onRehearsalVenueChange('venue', value as number)}
            options={venueOptions}
            isSearchable
            isClearable
          />
          <TextInput
            className="w-96"
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
          disabled={!isNominatedDriver}
          testId="contract-details-nominated-driver-notes"
          placeholder="Driver Notes"
          value={nominatedDriverNotes}
          onChange={(event) => handleChange('nominatedDriverNotes', event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-xl text-primary-navy font-bold mb-3 uppercase">Payment Details</div>
        <div className="flex items-center gap-2">
          <Label className="!font-bold text-sm w-52" text="Type of Payment" />
          <Select
            testId="contract-details-payment-type"
            placeholder="Please Select Payment Type"
            value={paymentType}
            onChange={(value) => handleChange('paymentType', value as string)}
            options={paymentTypes}
          />
        </div>
        <div className="flex gap-14">
          <div className="flex flex-col gap-4">
            <Label className="!font-bold text-sm w-52" text="If Weekly payment:" />
            <WeeklyPayDetails
              testId="contract-details-weekly-payment"
              details={weeklyPayDetails}
              onChange={(value) => handleChange('weeklyPayDetails', value as boolean)}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label className="!font-bold text-sm w-52" text="If Total Pay:" />
            <TotalPayDetails
              testId="contract-details-total-payment"
              details={totalPayDetails}
              onChange={(value) => handleChange('totalPayDetails', value as boolean)}
            />
          </div>
        </div>
        <div className="flex items-start grow gap-4 w-full">
          <Label className="!font-bold w-36" text="Payment Breakdown" />
          <div className="flex flex-col gap-2">
            {paymentBreakdownList.map((paymentBreakdown, i) => (
              <div key={i} className="flex w-full items-center gap-2">
                <PaymentBreakdown
                  testId={`payment-breakdown-${i}`}
                  breakdown={paymentBreakdown}
                  currencySymbol={currencySymbol}
                  onChange={(change) =>
                    handleChange(
                      'paymentBreakdownList',
                      replace(paymentBreakdownList, change, (_, idx) => idx === i) as TPaymentBreakdown[],
                    )
                  }
                />
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    handleChange(
                      'paymentBreakdownList',
                      insertAtPos(paymentBreakdownList, defaultPaymentBreakdown, i + 1),
                    )
                  }
                >
                  <Icon iconName="plus-circle-solid" />
                </div>
                {i > 0 && (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleChange('paymentBreakdownList', removeAtPos(paymentBreakdownList, i))}
                  >
                    <Icon iconName="minus-circle-solid" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-4 w-full">
          <Label className="!font-bold w-36" text="Cancellation Fee" />
          <div className="flex items-center gap-2 w-full">
            <div className="flex items-center">
              <Label className="text-sm" text={currencySymbol} />
              <TextInput
                testId="contract-details-cancellation-fee"
                placeholder="00.00"
                type="number"
                value={cancellationFee}
                onChange={(event) => handleChange('cancellationFee', parseInt(event.target.value, 10))}
              />
            </div>
            <TextInput
              testId="contract-details-cancellation-fee-notes"
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
            testId="contract-details-include-additional-Clauses"
            placeholder="Yes | No"
            value={includeAdditionalClauses}
            onChange={(value) => handleChange('includeAdditionalClauses', value as boolean)}
            options={booleanOptions}
          />
        </div>
        <div className="flex -items-center gap-8 w-full">
          <Label className="w-60 text-right !font-bold" text="If YES," />
          <div className="flex flex-col gap-2 w-full">
            <Select
              className="w-60"
              testId="contract-details-additional-clause"
              placeholder="Please Select a Clause"
              value={additionalClause}
              onChange={(value) => handleChange('additionalClause', value as number)}
              options={clauseOptions}
            />
            <div className="flex flex-col gap-2">
              {customClauseList.map((customClause, i) => (
                <div key={i} className="flex items-center gap-2">
                  <TextInput
                    testId={`contrat-details-custom-clause-${i}`}
                    className="grow"
                    inputClassName="grow"
                    placeholder="Custom Clause"
                    value={customClause}
                    onChange={(event) =>
                      handleChange('customClauseList', replaceAtPos(customClauseList, event.target.value as string, i))
                    }
                  />
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      handleChange(
                        'customClauseList',
                        i === 0 ? insertAtPos(customClauseList, '', i + 1) : removeAtPos(customClauseList, i),
                      )
                    }
                  >
                    <Icon iconName={i === 0 ? 'plus-circle-solid' : 'minus-circle-solid'} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContractDetails;

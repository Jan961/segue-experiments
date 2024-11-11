import PopupModal from 'components/core-ui-lib/PopupModal';
import classNames from 'classnames';
import Select from 'components/core-ui-lib/Select';
import TextInput from 'components/core-ui-lib/TextInput';
import DateInput from 'components/core-ui-lib/DateInput';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Button from 'components/core-ui-lib/Button';
import {
  ContactDemoFormData,
  DealMemoContractFormData,
  DealMemoHoldType,
  DealMemoPriceType,
  DealMemoTechProvision,
  ProductionDTO,
} from 'interfaces';
import { AddEditContractsState } from 'state/contracts/contractsState';
import { createRef, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import {
  booleanOptions,
  callOptions,
  callValueOptions,
  calls,
  saleFrequencyDay,
  sellerOptions,
  transactionOptions,
} from 'config/contracts';
import { ConfirmationDialog, Icon, TimeInput } from 'components/core-ui-lib';
import axios from 'axios';
import {
  defaultDemoCall,
  filterPrice,
  parseAndSortDates,
  formatDecimalOnBlur,
  timeToDateTime,
  dtToTime,
  formatDecimalFields,
  formatSeatKillValues,
  defaultCustomPrice,
  formatAddress,
  defaultTechProvision,
} from '../utils';
import { dealMemoInitialState } from 'state/contracts/contractsFilterState';
import { dateToTimeString, getDateWithOffset } from 'services/dateService';
import StandardSeatKillsTable, { SeatKillRow } from '../table/StandardSeatKillsTable';
import LoadingOverlay from 'components/core-ui-lib/LoadingOverlay';
import { CustomOption } from 'components/core-ui-lib/Table/renderers/SelectCellRenderer';
import { trasformVenueAddress } from 'utils/venue';
import { accountContactState } from 'state/contracts/accountContactState';
import {
  formatDecimalValue,
  formatPercentageValue,
  isNull,
  isNullOrEmpty,
  isNullOrUndefined,
  isUndefined,
} from 'utils';
import { currencyState } from 'state/global/currencyState';
import { decimalRegex, stringRegex } from 'utils/regexUtils';
import { dealMemoExport } from 'pages/api/deal-memo/export';
import { UserAcc } from './EditVenueContractModal';
import { accessVenueContracts } from 'state/account/selectors/permissionSelector';

export interface PriceState {
  default: Array<DealMemoPriceType>;
  custom: Array<DealMemoPriceType>;
}

export const EditDealMemoContractModal = ({
  visible,
  onCloseDemoForm,
  currentProduction,
  selectedTableCell,
  demoModalData,
  venueData,
  dealHoldType,
  userAccList,
}: {
  visible: boolean;
  onCloseDemoForm: () => void;
  currentProduction: Partial<ProductionDTO>;
  selectedTableCell: AddEditContractsState;
  demoModalData: Partial<DealMemoContractFormData>;
  venueData;
  dealHoldType: Array<DealMemoHoldType>;
  userAccList: Array<UserAcc>;
}) => {
  const [formData, setFormData] = useRecoilState(dealMemoInitialState);
  const [dealMemoPriceData, setDealMemoPriceData] = useState<PriceState>({ default: [], custom: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dealCall, setDealCall] = useState([]);
  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const [dealMemoTechProvision, setDealMemoTechProvision] = useState<DealMemoTechProvision[]>([]);
  const [formEdited, setFormEdited] = useState<boolean>(false);
  const [disableDate, setDisableDate] = useState<boolean>(true);
  const [seatKillsData, setSeatKillsData] = useState(null);
  const [holdTypeData, setHoldTypeData] = useState<Array<DealMemoHoldType>>();
  const currency = useRecoilValue(currencyState);
  const accountContacts = useRecoilValue(accountContactState);
  const [showSubmitError, setShowSubmitError] = useState<boolean>(false);

  const permissions = useRecoilValue(accessVenueContracts);
  const canEdit = permissions.includes('EDIT_DEAL_MEMO');
  const canExport = permissions.includes('EXPORT_DEAL_MEMO');

  const [errors, setErrors] = useState({
    ROTTPercentage: false,
    PRSPercentage: false,
    PromoterSplitPercentage: false,
    VenueSplitPercentage: false,
    dealSplitCombVal: false,
    CCCommissionPercent: false,
    SellProgCommPercent: false,
    SellMerchCommPercent: false,
    sellCapacity: false,
    callData: {},
  });

  // a place to temporary store time fields as string before converting to datetime and pushing to form
  const [times, setTimes] = useState({
    VenueCurfewTime: { hrs: '', min: '' },
    TechArrivalTime: { hrs: '', min: '' },
  });

  const sellCapacityRef = createRef<HTMLInputElement>();

  const companyContactList = useMemo(
    () =>
      accountContacts.map((contact) => {
        return {
          value: contact.AccContId,
          text: contact.AccContFirstName + ' ' + contact.AccContLastName + ' | ' + contact.AccContMainEmail,
        };
      }),
    [accountContacts],
  );

  const venueUserList = useMemo(
    () =>
      venueData && venueData.VenueContact
        ? venueData.VenueContact.map(({ Id, FirstName = '', LastName = '', VenueRole }) => ({
            value: Id,
            text:
              isNullOrEmpty(FirstName) && isNullOrEmpty(LastName)
                ? VenueRole.Name
                : `${FirstName || ''} ${LastName || ''} | ${VenueRole.Name}`,
          }))
        : [],
    [venueData],
  );

  const vcSelectPlaceholder = () => {
    return venueUserList.length === 0
      ? 'No venue contacts held within system - these can be added through venue database'
      : 'Please select...';
  };

  const venueUserData = useMemo(() => {
    const venueContactData = {};
    if (venueData && venueData.VenueContact) {
      venueData.VenueContact.forEach((venue) => {
        venueContactData[venue.Id] = venue;
      });
      return venueContactData;
    }
    return {};
  }, [venueData]);

  useEffect(() => {
    const priceData = filterPrice(demoModalData.DealMemoPrice);
    setDealMemoPriceData(priceData);

    setHoldTypeData(dealHoldType);

    const demoCall =
      demoModalData.DealMemoCall && demoModalData.DealMemoCall.length > 0
        ? demoModalData.DealMemoCall
        : [defaultDemoCall];

    const dmcProcessed = demoCall.map((dmc) => {
      if (dmc.DMCType === 'v') {
        return {
          ...dmc,
          DMCValue: formatDecimalValue(dmc.DMCValue),
        };
      } else {
        return { ...dmc };
      }
    });
    setDealCall([...dmcProcessed]);

    // format the seat kill data
    // supply the hold types so an empty array of objects can be formed
    const processedHoldData = formatSeatKillValues(demoModalData.DealMemoHold, dealHoldType);
    setSeatKillsData(processedHoldData);

    const customOrder = defaultTechProvision.map((item) => item.DMTechName);
    const processedTechProvision = isNullOrEmpty(demoModalData.DealMemoTechProvision)
      ? defaultTechProvision
      : [...demoModalData.DealMemoTechProvision].sort((a, b) => {
          return customOrder.indexOf(a.DMTechName) - customOrder.indexOf(b.DMTechName);
        });

    setDealMemoTechProvision(processedTechProvision);

    // get techArrivalTime with time offset
    const techArrivalTime = getDateWithOffset(new Date());
    if (isNullOrUndefined(demoModalData.TechArrivalTime)) {
      techArrivalTime.setHours(9);
    } else {
      const timeArrive = new Date(demoModalData.TechArrivalTime);
      techArrivalTime.setHours(timeArrive.getHours());
      techArrivalTime.setMinutes(timeArrive.getMinutes());
    }

    setFormData({
      ...demoModalData,
      DateIssued: isUndefined(demoModalData.DateIssued) ? new Date() : demoModalData.DateIssued,
      TechArrivalTime: techArrivalTime,
      TechArrivalDate: isUndefined(demoModalData.TechArrivalDate)
        ? new Date(selectedTableCell.contract.dateTime)
        : demoModalData.TechArrivalDate,
      RunningTime: timeToDateTime(currentProduction.RunningTime),
      PrintDelUseVenueAddress: isUndefined(demoModalData.PrintDelUseVenueAddress)
        ? true
        : demoModalData.PrintDelUseVenueAddress,
      PrintDelVenueAddressLine: isNullOrEmpty(demoModalData.PrintDelVenueAddressLine)
        ? getDefaultPrintDelAddress()
        : demoModalData.PrintDelVenueAddressLine,
      DealMemoHold: processedHoldData,
      DealMemoTechProvision: processedTechProvision,
      ...formatDecimalFields(demoModalData, 'string'),
    });

    setDisableDate(false);
  }, []);

  const [contactsData, setContactsData] = useState<ContactDemoFormData>({ phone: '', email: '', id: null });
  const { users } = useRecoilValue(userState);
  const userList = useMemo(
    () =>
      Object.values(users).map(({ AccUserId, FirstName = '', LastName = '', Email = '' }) => ({
        value: AccUserId,
        text: `${FirstName || ''} ${LastName || ''} | ${Email || ''}`,
      })),
    [users],
  );

  useEffect(() => {
    const data = [...dealMemoTechProvision];
    setFormData((prevDealMemo) => ({
      ...prevDealMemo,
      DealMemoTechProvision: data,
    }));
  }, [dealMemoTechProvision]);

  useEffect(() => {
    const data = [...dealCall];
    setFormData((prevDealMemo) => ({
      ...prevDealMemo,
      DealMemoCall: data,
    }));
  }, [dealCall]);

  useEffect(() => {
    if (!isNullOrUndefined(formData.CompAccContId)) {
      const selectedContact = accountContacts.find((contact) => contact.AccContId === formData.CompAccContId);
      setContactsData({
        email: selectedContact.AccContMainEmail,
        id: formData.CompAccContId,
        phone: selectedContact.AccContPhone,
      });
    }
  }, [formData.CompAccContId]);

  const editDemoModalData = async (key: string, value, type: string) => {
    const updatedFormData = {
      ...formData,
      [key]: value,
    };

    if (type === 'dealMemo') {
      setFormData({ ...updatedFormData });
    }
    setFormEdited(true);
  };

  const editTechProvisionModalData = (key, value, name) => {
    const techProvisionData = dealMemoTechProvision.map((data) => {
      if (data.DMTechName === name) {
        return {
          ...data,
          [key]: value,
        };
      }
      return data;
    });
    setDealMemoTechProvision(techProvisionData);
  };

  const submitForm = async (exportForm: boolean) => {
    // if errors array has any error set to true - show submission error and return
    // create a single array if error statuses
    const { callData, ...errorList } = errors;
    const errorArray = [...Object.values(errorList), ...Object.values(callData)];

    // if any error is unresolved - prevent submission
    if (errorArray.some((value) => value)) {
      setShowSubmitError(true);
      return;
    }

    setIsLoading(true);

    const dealMemoData = {
      ...formData,
      ...formatDecimalFields(formData, 'float'),
      DealMemoPrice: dealMemoPriceData,
    };

    // run the export process if the exportForm is true
    exportForm &&
      dealMemoExport({
        bookingId: selectedTableCell.contract.Id.toString(),
        dealMemoData,
        production: currentProduction,
        contract: selectedTableCell.contract,
        venue: venueData,
        accContacts: accountContacts,
        users: userAccList,
        fileType: 'docx',
      });

    try {
      await axios.post(`/api/deal-memo/update/${selectedTableCell.contract.Id}`, {
        formData: dealMemoData,
      });

      setIsLoading(false);
      onCloseDemoForm();
    } catch (e) {
      console.log('error', e);
      setIsLoading(false);
    }
  };

  const handleContactsSection = async (value) => {
    setIsLoading(true);

    if (value) {
      const selectedContact = accountContacts.find((contact) => contact.AccContId === value);

      const contactInfo = {
        email: selectedContact?.AccContMainEmail,
        phone: selectedContact?.AccContPhone,
        id: value,
      };

      setContactsData(contactInfo);

      editDemoModalData('CompAccContId', value, 'dealMemo');
    }

    setIsLoading(false);
  };

  const editDealMemoPrice = async (
    priceName: string,
    value: string | number,
    fieldKey: string,
    priceKey: string,
    index?: number,
  ) => {
    // take a copy of the state value object
    const priceData = [...dealMemoPriceData[priceKey]];

    if (priceKey === 'custom') {
      const updatedPrice = { ...priceData[index], [fieldKey]: value };
      priceData[index] = updatedPrice;
    } else {
      // find index of record to change
      const arrIndex = priceData.findIndex((price) => price.DMPTicketName === priceName);
      if (arrIndex !== -1) {
        const updatedPrice = { ...priceData[arrIndex], [fieldKey]: value };
        priceData[arrIndex] = updatedPrice;
      }
    }

    // Write the change to the state by setting a new array in state
    setDealMemoPriceData({
      ...dealMemoPriceData,
      [priceKey]: priceData, // new array with the updated object
    });
  };

  const addRemoveCustomPrice = (action: 'add' | 'delete', index?: number) => {
    let newCustom = dealMemoPriceData.custom;

    switch (action) {
      case 'add': {
        newCustom.push(defaultCustomPrice);
        break;
      }

      case 'delete': {
        newCustom = newCustom.filter((_, i) => i !== index);
        break;
      }
    }

    setDealMemoPriceData({ ...dealMemoPriceData, custom: newCustom });
  };

  const handleCall = (key: boolean, index: number) => {
    const demoCallData = {
      DMCDeMoId: null,
      DMCCallNum: index + 1,
      DMCPromoterOrVenue: '',
      DMCType: '',
      DMCValue: null,
    };
    if (key) {
      const callData = [...dealCall, demoCallData];
      setDealCall([...callData]);
    } else {
      const callData = [...dealCall];
      callData.pop();
      setDealCall([...callData]);
    }
  };

  const editDemoCallModalData = (dataKey, value, index) => {
    const callData = [...dealCall];
    const updateCallData = { ...callData[index], [dataKey]: value };
    callData[index] = updateCallData;
    // eslint-disable-next-line dot-notation
    callData[index]['DMCDeMoId'] = demoModalData.Id;
    setDealCall([...callData]);
  };

  const handleCancelForm = (cancel: boolean) => {
    if (cancel) {
      onCloseDemoForm();
    }
    if (formEdited) {
      setCancelModal(true);
    } else {
      onCloseDemoForm();
    }
  };

  const handleStandardSeatsTableData = (row: SeatKillRow, field: string, rows: Array<SeatKillRow>) => {
    // Initialize dealMemoRecs as a deep copy to ensure no references to the original formData
    let dealMemoRecs = [];

    // If formData.DealMemoHold is undefined, use the rows array; otherwise, deep copy formData.DealMemoHold
    if (isUndefined(formData.DealMemoHold)) {
      dealMemoRecs = rows.map((item) => ({ ...item }));
    } else {
      dealMemoRecs = formData.DealMemoHold.map((item) => ({ ...item }));
    }

    // Find the index of the row to update
    const rowIndex = dealMemoRecs.findIndex((holdObj) => holdObj.DMHoldHoldTypeId === row.typeId);

    // Ensure row exists before trying to update it
    if (rowIndex > -1) {
      // Determine the field to update based on the field argument
      const dbField = field === 'seats' ? 'DMHoldSeats' : 'DMHoldValue';

      // Create a new object for the updated row to avoid direct mutation of the object
      dealMemoRecs[rowIndex] = {
        ...dealMemoRecs[rowIndex],
        [dbField]: row[field], // Assign the new value to the appropriate field
      };
    }

    // Push the updated dealMemoRecs back to the form
    setFormData((prevDealMemo) => ({
      ...prevDealMemo,
      DealMemoHold: dealMemoRecs,
    }));
  };

  const validateDealSplit = () => {
    // if either value is null return
    if (isNull(formData.PromoterSplitPercentage) || isNull(formData.VenueSplitPercentage)) {
      return;
    }

    // if both values are not NaN
    if (!isNaN(formData.PromoterSplitPercentage) && !isNaN(formData.VenueSplitPercentage)) {
      const combinedTotal =
        parseFloat(formData.PromoterSplitPercentage.toString()) + parseFloat(formData.VenueSplitPercentage.toString());

      // if greater than 100, enable error
      if (combinedTotal > 100) {
        setErrors({ ...errors, dealSplitCombVal: true });
      } else {
        setErrors({ ...errors, dealSplitCombVal: false });
      }

      // if one of the values are NaN, we cannot validate - unset error in case value is cleared before entering
    } else {
      setErrors({ ...errors, dealSplitCombVal: false });
    }
  };

  const handleTimeInput = (e, key) => {
    const { name, value } = e.target;

    try {
      const filteredValue = value.replace(/^\D/, '');
      const valLen = filteredValue.length;

      const newTime = times[key];
      if (valLen < 3) {
        if (
          (name === 'hrs' && (parseInt(filteredValue) < 24 || valLen === 0)) ||
          (name === 'min' && (parseInt(filteredValue) < 60 || valLen === 0))
        ) {
          newTime[name] = filteredValue;
          setTimes({ ...times, [key]: newTime });
        }
      }

      return { name, value: filteredValue };
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleTimeBlur = (key) => {
    const { hrs, min } = times[key];

    if (hrs && min) {
      const datetime = getDateWithOffset(new Date());
      datetime.setHours(hrs);
      datetime.setMinutes(min);

      editDemoModalData(key, datetime, 'dealMemo');
    }
  };

  const handlePercentChange = (key: string, value: string, index?: number) => {
    if (stringRegex.test(value)) {
      return;
    }

    const isError = value !== '' && (parseFloat(value) < 0 || parseFloat(value) > 100);

    // if index is provided - set error status inside the callData array
    // otherwise, store error status against the key as normal.
    setErrors({
      ...errors,
      ...(isUndefined(index) ? { [key]: isError } : { callData: { ...errors.callData, [index!]: isError } }),
    });

    if (decimalRegex.test(value) || value === '') {
      // if index is provided - run editDemoCallModalData instead of editDemoModalData
      if (!isUndefined(index)) {
        editDemoCallModalData(key, value, index);
      } else {
        editDemoModalData(key, value, 'dealMemo');
      }
    }
  };

  // this will change when the delivery address is split out into Address 1, Address 2 and so on in the deal memo
  // for now, the print address, on the deal memo will be the a comma separated value line
  const getDefaultPrintDelAddress = () => {
    const mainAddress = venueData.VenueAddress.find((address) => address.TypeName === 'Main');
    return formatAddress(
      mainAddress.Line1,
      mainAddress.Line2,
      mainAddress.Line3,
      mainAddress.Town,
      mainAddress.Postcode,
    );
  };

  return (
    <div id="deal-memo-modal">
      <PopupModal
        show={visible}
        title="Deal Memo"
        titleClass={classNames('text-xl text-primary-navy font-bold -mt-2.5')}
        onClose={() => handleCancelForm(false)}
        hasOverlay={true}
        hasOverflow={false}
        panelClass="overflow-y-hidden"
      >
        <div className="h-[80vh] w-[82vw] overflow-y-scroll pr-2">
          <p className="text-primary-red ">PLEASE NOTE:</p>{' '}
          <p className="text-primary-input-text">
            Some information is pre-populated from other areas of Segue. <br /> For venue details including addresses
            and venue contacts, please see <b>VENUE DATABASE.</b>
            <br /> For performance details including dates and times, please see <b>BOOKINGS.</b> <br /> For production
            company details including Promoter contacts and VAT number, please see <b>SYSTEM ADMIN.</b> <br />
            For sales reports emails and frequency, please see <b>MANAGE SHOWS / PRODUCTIONS.</b>
          </p>
          <hr className="bg-primary h-[3px] mt-4 mb-4" />
          <div className="flex items-center">
            <div className="w-1/5 text-primary-input-text font-bold">Show</div>
            <div className="w-4/5">
              <div className="w-full">
                <TextInput
                  className="w-full text-primary-input-text font-bold"
                  disabled
                  value={currentProduction.ShowName}
                  testId="show-name-in-deal-memo"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Venue</div>
            <div className="w-4/5">
              <div className="w-full">
                <TextInput
                  className="w-full text-primary-input-text font-bold"
                  disabled
                  value={selectedTableCell.contract.venue}
                  testId="venue-name-in-deal-memo"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Date Deal Memo Issued</div>
            <div className="w-4/5 flex">
              <DateInput
                testId="deal-memo-issue-date"
                onChange={(value) => {
                  editDemoModalData('DateIssued', value, 'dealMemo');
                }}
                value={formData.DateIssued}
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="text-primary-input-text mt-4">
            Please read this carefully to ensure it reflects the terms as agreed between{' '}
            {`${currentProduction.ProductionCompany ? currentProduction.ProductionCompany.ProdCoName : ''}`} and{' '}
            {`${selectedTableCell.contract.venue}`}.
            <br />
            Please note that any terms not specifically mentioned here are still to be negotiated. If you have any
            standard conditions that you consider to be non-negotiable, or if you{' '}
            <span className="flex">
              have any queries about the Deal Memo, please contact{' '}
              <Select
                testId="please-select-contact-for-queries"
                onChange={(value) => {
                  editDemoModalData('AccContId', value, 'dealMemo');
                }}
                className="bg-primary-white w-3/12 ml-2 mr-2"
                placeholder="Please select..."
                options={[...companyContactList]}
                isClearable
                isSearchable
                value={formData.AccContId}
                disabled={!canEdit}
              />
              ASAP
            </span>
          </div>
          <div className="text-primary-input-text mt-4">
            If we have requested anything that incurs a cost, it must be agreed with
            {` ${currentProduction.ProductionCompany ? currentProduction.ProductionCompany.ProdCoName : ''} `}
            prior to our arrival. No extras will be paid without a pre-authorisation
            {` (this includes internet access).`} Unless otherwise agreed, all staff calls will be scheduled within the
            contractual allowance - if you foresee any overtime, please advise immediately.
          </div>
          <hr className="bg-primary h-[3px] mt-4 mb-4" />
          <div className="text-xl text-primary-navy font-bold -mt-2.5">Contacts</div>
          <div className="flex items-center">
            <div className="w-1/5 text-primary-input-text font-bold">Company Contact</div>
            <div className="w-4/5">
              <Select
                testId="select-company-contact"
                onChange={(value) => {
                  handleContactsSection(value);
                }}
                className="bg-primary-white wfull"
                placeholder="Please select..."
                options={[...companyContactList]}
                isClearable
                isSearchable
                value={formData.CompAccContId}
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
            <div className="w-4/5 flex items-center">
              <div className="w-3/4">
                <TextInput
                  testId="contacts-phno"
                  className="w-3/4 text-primary-input-text font-bold"
                  disabled
                  value={contactsData.phone}
                  placeholder={
                    contactsData.phone ? 'Add details to the Contact Database' : 'Please select from the dropdown above'
                  }
                />
              </div>

              <div className="text-primary-input-text font-bold ml-8 mr-4">Email</div>
              <div className="w-3/4">
                <TextInput
                  testId="contacts-emailId"
                  className="w-3/4 text-primary-input-text font-bold"
                  disabled
                  value={contactsData.email}
                  placeholder={
                    contactsData.email ? 'Add details to the Contact Database' : 'Please select from the dropdown above'
                  }
                />
              </div>
            </div>
          </div>
          <hr className="bg-primary h-[3px] mt-4 mb-4" />
          <div className="text-xl text-primary-navy font-bold -mt-2.5">Performance</div>
          <div className="flex items-center">
            <div className="w-1/5 text-primary-input-text font-bold">Show Title</div>

            <div className="w-4/5 flex items-center">
              <TextInput
                testId="performance-show-title"
                className="w-[400px] text-primary-input-text font-bold"
                disabled
                value={currentProduction.ShowName}
              />
              <div className="text-primary-input-text font-bold ml-8 mr-4"> No. of Performances</div>
              <TextInput
                testId="no-of-performances"
                className="w-[350px] text-primary-input-text font-bold"
                disabled
                value={selectedTableCell.contract.performanceCount}
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Performance Date(s) and Time(s)</div>
            <div className="w-4/5">
              <TextArea
                testId="performance times"
                className="h-auto w-full overflow-y-hidden"
                value={parseAndSortDates(selectedTableCell.contract.PerformanceTimes).join('\n')}
                disabled
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Running Time (inc. Intervals)</div>
            <div className="w-4/5 flex items-center" data-testid="perf-running-time">
              <TimeInput
                className="w-fit h-[31px] [&>input]:!h-[25px] [&>input]:!w-11 !justify-center shadow-input-shadow"
                value={dtToTime(formData.RunningTime)}
                onChange={() => null}
                disabled
                tabIndexShow={true}
              />
              <div className=" text-primary-input-text font-bold ml-8 mr-4">Notes</div>

              <TextInput testId="runningNote" className="w-[55vw]" disabled value={currentProduction.RunningTimeNote} />
            </div>
          </div>
          <div className="flex mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Pre / Post Show Events</div>
            <div className="w-4/5 flex">
              <div className="w-full shadow-input-shadow">
                <TextArea
                  testId="prePostShow"
                  className="w-full h-auto"
                  value={formData.PrePostShowEvents}
                  onChange={(value) => editDemoModalData('PrePostShowEvents', value.target.value, 'dealMemo')}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Off-Stage Venue Curfew Time </div>
            <div className="w-4/5 flex items-center" data-testid="perf-curfew-time">
              <TimeInput
                className="w-fit h-[31px] [&>input]:!h-[25px] [&>input]:!w-11 !justify-center shadow-input-shadow"
                value={formData && formData.VenueCurfewTime ? dateToTimeString(formData.VenueCurfewTime) : null}
                disabled={disableDate || !canEdit}
                onInput={(event) => handleTimeInput(event, 'VenueCurfewTime')}
                onBlur={() => handleTimeBlur('VenueCurfewTime')}
                onChange={() => null}
                tabIndexShow={true}
              />
              <div className=" text-primary-input-text font-bold ml-8 mr-4">Notes</div>

              <TextInput
                testId="perf-curfew-time-notes"
                className="w-[55vw]"
                value={formData.PerformanceNotes}
                onChange={(value) => editDemoModalData('PerformanceNotes', value.target.value, 'dealMemo')}
                disabled={!canEdit}
              />
            </div>
          </div>
          <hr className="bg-primary h-[3px] mt-4 mb-4" />
          <div className="text-xl text-primary-navy font-bold -mt-2.5">Venue</div>
          {[
            { label: 'Venue Name', value: 'Name' },
            { label: 'Phone', value: 'primaryPhoneNumber', type: 'venueAddress' },
            { label: 'Email', value: 'primaryEMail', type: 'venueAddress' },
            { label: 'Address', value: 'primaryAddress1', type: 'venueAddress' },
          ].map((input) => {
            return (
              <div key={input.label} className="flex items-center mb-2">
                <div className="w-1/5 text-primary-input-text font-bold">{input.label}</div>
                <div className="w-4/5">
                  <TextInput
                    testId={`venue-${input.value}`}
                    className="w-full text-primary-input-text font-bold"
                    value={
                      input.type === 'venueAddress'
                        ? trasformVenueAddress(venueData.VenueAddress[0])[input.value]
                        : venueData
                        ? venueData[input.value]
                        : ''
                    }
                    disabled={true}
                    placeholder="Add details to Venue Database"
                  />
                </div>
              </div>
            );
          })}
          <div className="flex items-center mb-2">
            <div className="w-1/5 text-primary-input-text font-bold">Programmer</div>
            <div className="w-4/5">
              <Select
                onChange={(value) => editDemoModalData('ProgrammerVenueContactId', value, 'dealMemo')}
                options={[...venueUserList]}
                className={classNames('bg-primary-white w-full', venueUserList.length === 0 && 'font-normal')}
                placeholder={vcSelectPlaceholder()}
                isClearable
                isSearchable
                disabled={venueUserList.length === 0 || !canEdit}
                value={formData.ProgrammerVenueContactId}
                testId="select-venue-programmer"
              />
            </div>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
            <div className="w-4/5">
              <TextInput
                testId="venue-programmer-phone-no"
                className="w-full text-primary-input-text font-bold"
                disabled
                placeholder={
                  venueUserData[formData.ProgrammerVenueContactId]
                    ? 'Add details to Venue Database'
                    : 'Please select from the dropdown above'
                }
                value={
                  venueUserData[formData.ProgrammerVenueContactId]
                    ? venueUserData[formData.ProgrammerVenueContactId].Phone
                    : ''
                }
              />
            </div>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-1/5 text-primary-input-text font-bold">Email</div>
            <div className="w-4/5">
              <TextInput
                testId="venue-programmer-email"
                className="w-full text-primary-input-text font-bold"
                disabled
                placeholder={
                  venueUserData[formData.ProgrammerVenueContactId]
                    ? 'Add details to Venue Database'
                    : 'Please select from the dropdown above'
                }
                value={
                  venueUserData[formData.ProgrammerVenueContactId]
                    ? venueUserData[formData.ProgrammerVenueContactId].Email
                    : ''
                }
              />
            </div>
          </div>
          <hr className="bg-primary h-[3px] mt-4 mb-4" />
          <div className="text-xl text-primary-navy font-bold -mt-2.5">Deal</div>
          <div className="flex items-center">
            <div className="w-1/5 text-primary-input-text font-bold">Royalty Off The Top</div>
            <div className="flex flex-row">
              <div className="w-4/5 flex items-center">
                <TextInput
                  testId="deal-royalty-percentage"
                  className={classNames('w-[100px]', errors.ROTTPercentage ? 'text-primary-red' : '')}
                  value={formData.ROTTPercentage === 0 ? '0' : formData.ROTTPercentage}
                  onChange={(value) => handlePercentChange('ROTTPercentage', value.target.value)}
                  onBlur={(value) => {
                    editDemoModalData('ROTTPercentage', formatPercentageValue(value.target.value), 'dealMemo');
                  }}
                  disabled={!canEdit}
                />
                <div className=" text-primary-input-text font-bold ml-2">%</div>
                <div className=" text-primary-input-text font-bold ml-12 mr-4">PRS</div>
                <TextInput
                  testId="deal-prs-percentage"
                  className={classNames('w-[100px]', errors.PRSPercentage ? 'text-primary-red' : '')}
                  value={formData.PRSPercentage === 0 ? '0' : formData.PRSPercentage}
                  onChange={(value) => handlePercentChange('PRSPercentage', value.target.value)}
                  onBlur={(value) => {
                    editDemoModalData('PRSPercentage', formatPercentageValue(value.target.value), 'dealMemo');
                  }}
                  disabled={!canEdit}
                />
                <div className=" text-primary-input-text font-bold ml-2">%</div>
              </div>
            </div>
          </div>
          {(errors.ROTTPercentage || errors.PRSPercentage) && (
            <div className="ml-[20%] flex flex-row">
              <div className="w-4/5 flex items-center mt-2 text-primary-red">
                Pecentage value must be between 0 and 100
              </div>
            </div>
          )}
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Guarantee</div>
            <div className="w-4/5 flex items-center">
              <Select
                onChange={(value) => {
                  if (value) {
                    editDemoModalData('Guarantee', value, 'dealMemo');
                  } else {
                    setFormData({ ...formData, Guarantee: false, GuaranteeAmount: null });
                  }
                }}
                className="bg-primary-white w-26 mr-3"
                placeholder="Please select.."
                options={booleanOptions}
                isClearable
                value={formData.Guarantee}
                testId="select-deal-guarantee"
                disabled={!canEdit}
              />
              <div className="text-primary-input-text font-bold ml-[5.8%] mr-3">{currency.symbol}</div>

              <TextInput
                testId="deal-guarntee-amount"
                className="w-[140px] ml-1"
                type="number"
                value={formData.GuaranteeAmount}
                onChange={(value) => editDemoModalData('GuaranteeAmount', parseFloat(value.target.value), 'dealMemo')}
                onBlur={(value) => {
                  editDemoModalData('GuaranteeAmount', formatDecimalOnBlur(value), 'dealMemo');
                }}
                placeholder="00.00"
                disabled={!formData.Guarantee || !canEdit}
              />
            </div>
          </div>
          <div className="flex  mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Calls</div>
            <div className="w-4/5 flex ">
              <Select
                onChange={(value) => {
                  editDemoModalData('HasCalls', value, 'dealMemo');
                }}
                className="bg-primary-white w-26 mr-1 h-8"
                placeholder="Please select..."
                options={booleanOptions}
                isClearable
                isSearchable
                value={formData.HasCalls}
                testId="select-deal-call"
                disabled={!canEdit}
              />
              <div>
                {dealCall.map((call, index) => {
                  return (
                    <div className="flex mb-6 items-center" key={index}>
                      <div className="text-primary-input-text font-bold ml-6 mr-2 w-[90px] mt-2">
                        {calls[index]} Call
                      </div>

                      <Select
                        onChange={(value) => {
                          editDemoCallModalData('DMCPromoterOrVenue', value, index);
                        }}
                        value={dealCall[index].DMCPromoterOrVenue}
                        className="bg-primary-white w-[170px] mr-1 "
                        placeholder={formData.HasCalls && 'Please select...'}
                        options={callOptions}
                        isClearable
                        isSearchable
                        disabled={!formData.HasCalls || !canEdit}
                        testId="select-deal-first-call"
                      />

                      <Select
                        onChange={(value) => {
                          editDemoCallModalData('DMCType', value, index);
                        }}
                        value={dealCall[index].DMCType}
                        className="bg-primary-white w-[170px] mr-1 ml-6"
                        placeholder={formData.HasCalls && 'Please select...'}
                        options={callValueOptions}
                        isClearable
                        isSearchable
                        disabled={!formData.HasCalls || !canEdit}
                        testId="select-deal-first-call-type"
                      />

                      {dealCall[index].DMCType && (
                        <div
                          className={`text-primary-input-text font-bold ml-8 ${
                            dealCall[index].DMCType === 'p' ? 'mr-4' : 'mr-2'
                          }`}
                        >{`${dealCall[index].DMCType === 'p' ? ' ' : currency.symbol}`}</div>
                      )}

                      <TextInput
                        testId="deal-call-percentage-or-value"
                        className={classNames(
                          'w-[140px] ml-2',
                          errors.callData[index.toString()] ? 'text-primary-red' : '',
                        )}
                        value={dealCall[index].DMCValue === 0 ? '0' : dealCall[index].DMCValue}
                        placeholder={dealCall[index].DMCType === 'v' ? '00.00' : ''}
                        disabled={
                          !formData.HasCalls ||
                          !dealCall[index].DMCType ||
                          !dealCall[index].DMCPromoterOrVenue ||
                          canEdit
                        }
                        onBlur={(value) => {
                          if (dealCall[index].DMCType === 'v') {
                            editDemoCallModalData('DMCValue', formatDecimalOnBlur(value), index);
                          } else {
                            editDemoCallModalData('DMCValue', formatPercentageValue(value.target.value), index);
                          }
                        }}
                        onChange={(value) => {
                          if (dealCall[index].DMCType === 'v') {
                            editDemoCallModalData('DMCValue', value.target.value, index);
                          } else {
                            handlePercentChange('DMCValue', value.target.value, index);
                          }
                        }}
                      />

                      {dealCall[index].DMCType && (
                        <div className=" text-primary-input-text font-bold ml-2 w-2">{`${
                          dealCall[index].DMCType === 'v' ? '' : '%'
                        }`}</div>
                      )}

                      <div className="flex">
                        {index === dealCall.length - 1 && (
                          <Icon
                            className="ml-2"
                            iconName="plus-circle-solid"
                            onClick={() => formData.HasCalls && handleCall(true, index)}
                            variant="lg"
                            testId="deal-increase-calls"
                          />
                        )}

                        {index === dealCall.length - 1 && index > 0 && (
                          <Icon
                            className="ml-2"
                            iconName="minus-circle-solid"
                            onClick={() => formData.HasCalls && handleCall(false, index)}
                            variant="lg"
                            testId="deal-decrease-calls"
                          />
                        )}

                        <div className="ml-3">
                          {errors.callData[index.toString()] && (
                            <div className="flex text-primary-red">Pecentage value must be between 0 and 100</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center mt-3">
            <div className="w-[20%] text-primary-input-text font-bold">Deal Split</div>
            <div className="flex items-center">
              <div className="text-primary-input-text font-bold mr-2">Promoter</div>
              <TextInput
                testId="promoter-split-percentage"
                className={classNames(
                  'w-[100px]',
                  errors.PromoterSplitPercentage || errors.dealSplitCombVal ? 'text-primary-red' : '',
                )}
                value={formData.PromoterSplitPercentage === 0 ? '0' : formData.PromoterSplitPercentage}
                onChange={(value) => handlePercentChange('PromoterSplitPercentage', value.target.value)}
                onBlur={(value) => {
                  editDemoModalData('PromoterSplitPercentage', formatPercentageValue(value.target.value), 'dealMemo');
                  validateDealSplit();
                }}
                disabled={!canEdit}
              />

              <div className="text-primary-input-text font-bold ml-2 mr-2">%</div>
              <div className="text-primary-input-text font-bold ml-20 mr-2">Venue</div>

              <TextInput
                testId="venue-split-percentage"
                className={classNames(
                  'w-[100px]',
                  errors.VenueSplitPercentage || errors.dealSplitCombVal ? 'text-primary-red' : '',
                )}
                value={formData.VenueSplitPercentage === 0 ? '0' : formData.VenueSplitPercentage}
                onChange={(value) => handlePercentChange('VenueSplitPercentage', value.target.value)}
                onBlur={(value) => {
                  editDemoModalData('VenueSplitPercentage', formatPercentageValue(value.target.value), 'dealMemo');
                  validateDealSplit();
                }}
                disabled={!canEdit}
              />
              <div className="text-primary-input-text font-bold ml-2 mr-2">%</div>
            </div>
          </div>
          {(errors.PromoterSplitPercentage || errors.VenueSplitPercentage) && (
            <div className="ml-[20%] flex flex-row">
              <div className="w-4/5 flex items-center mt-2 text-primary-red">
                Pecentage value must be between 0 and 100
              </div>
            </div>
          )}
          {errors.dealSplitCombVal && (
            <div className="ml-[20%] flex flex-row">
              <div className="w-4/5 flex items-center mt-2 text-primary-red">
                Combined deal split cannot exceed 100%
              </div>
            </div>
          )}
          {[
            ['Venue Rental', 'VenueRental', 'VenueRentalNotes'],
            ['Staffing Contra', 'StaffingContra', 'StaffingContraNotes'],
            ['Agreed Contra Items', 'AgreedContraItems', 'AgreedContraItemsNotes'],
          ].map((inputData) => {
            return (
              <div key={inputData[0]} className="flex items-center mt-4">
                <div className="w-[19%] text-primary-input-text font-bold">{inputData[0]}</div>
                <div className="flex items-center">
                  <div className="text-primary-input-text font-bold  mr-2">{currency.symbol}</div>

                  <TextInput
                    testId={`${inputData[1]}-amount`}
                    className="w-[100px] mr-6"
                    value={formData[inputData[1]]}
                    onBlur={(value) => {
                      editDemoModalData(inputData[1], formatDecimalOnBlur(value), 'dealMemo');
                    }}
                    onChange={(value) => editDemoModalData(inputData[1], value.target.value, 'dealMemo')}
                    pattern={/^\d*(\.\d*)?$/}
                    disabled={!canEdit}
                  />
                  <TextInput
                    testId={`${inputData[2]}-text`}
                    className="w-[54vw]"
                    value={formData[inputData[2]]}
                    onChange={(value) => editDemoModalData(inputData[2], value.target.value, 'dealMemo')}
                    disabled={!canEdit}
                  />
                </div>
              </div>
            );
          })}
          <hr className="bg-primary h-[3px] mt-4 mb-4" />
          <div className="text-xl text-primary-navy font-bold -mt-2.5">Box Office</div>
          <div className="flex items-center">
            <div className="w-1/5 text-primary-input-text font-bold">Box Office Manager</div>
            <div className="w-4/5 flex">
              <Select
                onChange={(value) => editDemoModalData('BOMVenueContactId', value, 'dealMemo')}
                className={classNames('bg-primary-white w-full', venueUserList.length === 0 && 'font-normal')}
                placeholder={vcSelectPlaceholder()}
                options={venueUserList}
                disabled={venueUserList.length === 0 || !canEdit}
                isClearable
                isSearchable
                value={formData.BOMVenueContactId}
                testId="select-box-office-manager"
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
            <div className="w-4/5">
              <TextInput
                testId="box-office-manager-phone-no"
                className="w-full text-primary-input-text font-bold"
                placeholder={
                  venueUserData[formData.BOMVenueContactId]
                    ? 'Add details to Venue Database'
                    : 'Please select from the dropdown above'
                }
                disabled
                value={venueUserData[formData.BOMVenueContactId] ? venueUserData[formData.BOMVenueContactId].Phone : ''}
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Email</div>
            <div className="w-4/5">
              <TextInput
                testId="box-office-manager-email"
                className="w-full text-primary-input-text font-bold"
                placeholder={
                  venueUserData[formData.BOMVenueContactId]
                    ? 'Add details to Venue Database'
                    : 'Please select from the dropdown above'
                }
                disabled
                value={venueUserData[formData.BOMVenueContactId] ? venueUserData[formData.BOMVenueContactId].Email : ''}
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Onsale Date</div>
            <div className="w-4/5 flex">
              <DateInput
                testId="box-office-sale-date"
                onChange={(value) => {
                  editDemoModalData('OnSaleDate', value, 'dealMemo');
                }}
                value={formData.OnSaleDate}
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Accounts Contact for Settlement</div>
            <div className="w-4/5 flex">
              <Select
                onChange={(value) => editDemoModalData('SettlementVenueContactId', value, 'dealMemo')}
                className={classNames('bg-primary-white w-full', venueUserList.length === 0 && 'font-normal')}
                placeholder={vcSelectPlaceholder()}
                options={venueUserList}
                disabled={venueUserList.length === 0 || !canEdit}
                isClearable
                isSearchable
                value={formData.SettlementVenueContactId}
                testId="box-office-act-contact-for-settlement"
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
            <div className="w-4/5">
              <TextInput
                testId="box-office-settle-contact-phone"
                className="w-full text-primary-input-text font-bold"
                disabled
                placeholder={
                  venueUserData[formData.SettlementVenueContactId]
                    ? 'Add details to Venue Database'
                    : 'Please select from the dropdown above'
                }
                value={
                  venueUserData[formData.SettlementVenueContactId]
                    ? venueUserData[formData.SettlementVenueContactId].Phone
                    : ''
                }
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Email</div>
            <div className="w-4/5">
              <TextInput
                testId="box-office-settle-contact-email"
                className="w-full text-primary-input-text font-bold"
                disabled
                placeholder={
                  venueUserData[formData.SettlementVenueContactId]
                    ? 'Add details to Venue Database'
                    : 'Please select from the dropdown above'
                }
                value={
                  venueUserData[formData.SettlementVenueContactId]
                    ? venueUserData[formData.SettlementVenueContactId].Email
                    : ''
                }
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Capacity</div>
            <div className="w-4/5 flex items-center">
              <div className="text-primary-input-text font-bold mr-2">Venue</div>
              <TextInput
                testId="box-office-venueCapacity"
                className="w-auto text-primary-input-text font-bold"
                value={venueData ? venueData.Seats : null}
                disabled
              />
              <div className="text-primary-input-text font-bold ml-8 mr-2">Sellable</div>

              <TextInput
                testId="box-office-sellable-capacity"
                className="w-auto"
                value={formData.SellableSeats}
                ref={sellCapacityRef}
                onChange={(value) => {
                  if (parseFloat(value.target.value) > parseFloat(venueData.Seats)) {
                    setErrors({ ...errors, sellCapacity: true });
                  } else {
                    setErrors({ ...errors, sellCapacity: false });
                  }
                  editDemoModalData('SellableSeats', parseFloat(value.target.value), 'dealMemo');
                }}
                disabled={!canEdit}
              />

              {errors.sellCapacity && (
                <div className="flex flex-row space-x-4" data-testid="seat-capacity-confirmation-warning">
                  <div className="flex flex-col">
                    <div className="flex items-center ml-3 text-primary-red">Are you sure?</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-row space-x-2">
                      <Button
                        onClick={() => setErrors({ ...errors, sellCapacity: false })}
                        className="w-20"
                        variant="secondary"
                        text="Yes"
                      />
                      <Button
                        onClick={() => {
                          sellCapacityRef.current && sellCapacityRef?.current?.select();
                          setErrors({ ...errors, sellCapacity: false });
                        }}
                        className="w-20"
                        variant="secondary"
                        text="No"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Standard Seat kills</div>
            <div className="w-4/5 flex">
              <div className="w-[394px]">
                <div>
                  <StandardSeatKillsTable
                    rowData={seatKillsData}
                    handleFormUpdate={(rowToUpd, field, initRows) =>
                      handleStandardSeatsTableData(rowToUpd, field, initRows)
                    }
                    currency={currency.symbol}
                    holdTypeList={holdTypeData}
                    disabled={!canEdit}
                  />
                </div>
              </div>
              <div className="ml-16 w-[394px]">
                <div className="text-primary-input-text font-bold">Hold Notes</div>
                <TextArea
                  testId="box-office-hold-notes"
                  className="mt-2 mb-2 w-full h-[583px]"
                  value={formData.SeatKillNotes}
                  placeholder="Notes Field"
                  onChange={(value) => editDemoModalData('SeatKillNotes', value.target.value, 'dealMemo')}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
          <hr className="bg-primary h-[3px] mt-4 mb-4" />
          <div className="flex items-end">
            <div className="text-xl text-primary-navy font-bold ">Prices</div>
            <div className="ml-2 mb-1 text-sm text-primary-navy"> {`(net of levies, commissions etc)`}</div>
          </div>
          <div className="flex items-center">
            <div className="w-1/5"> </div>
            <div className="w-4/5 flex">
              <div className="w-1/5">
                <span className="text-primary-input-text font-bold">No. of Tickets</span>
              </div>
              <div className="w-1/6">
                <span className=" text-primary-input-text font-bold ml-4">Price</span>
              </div>
              <span className=" text-primary-input-text font-bold ml-1">Notes</span>
            </div>
          </div>
          {dealMemoPriceData.default.map((inputData) => {
            const defaultPriceObj = dealMemoPriceData.default.find(
              (price) => price.DMPTicketName === inputData.DMPTicketName,
            );

            return (
              <div key={inputData.DMPTicketName} className="flex items-center mt-2">
                <div className="w-1/5 text-primary-input-text font-bold">{inputData.DMPTicketName} </div>
                <div className="w-4/5 flex">
                  <div className="w-1/5">
                    <TextInput
                      testId={`${inputData.DMPTicketName}-num-of-tickets`}
                      className="w-auto"
                      pattern={/^\d*$/}
                      onChange={(value) =>
                        editDealMemoPrice(
                          inputData.DMPTicketName,
                          parseFloat(value.target.value),
                          'DMPNumTickets',
                          'default',
                        )
                      }
                      value={defaultPriceObj ? defaultPriceObj.DMPNumTickets : ''}
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="text-primary-input-text font-bold mr-2 mt-1">{currency.symbol}</div>

                  <TextInput
                    testId={`${inputData.DMPTicketName}-ticketPrice`}
                    className="w-auto"
                    pattern={/^\d*(\.\d*)?$/}
                    onChange={(value) =>
                      editDealMemoPrice(inputData.DMPTicketName, value.target.value, 'DMPTicketPrice', 'default')
                    }
                    onBlur={(value) =>
                      editDealMemoPrice(
                        inputData.DMPTicketName,
                        formatDecimalOnBlur(value),
                        'DMPTicketPrice',
                        'default',
                      )
                    }
                    value={
                      defaultPriceObj
                        ? defaultPriceObj.DMPTicketPrice === 0
                          ? ''
                          : defaultPriceObj.DMPTicketPrice
                        : ''
                    }
                    disabled={!canEdit}
                  />

                  <TextInput
                    testId={`${inputData.DMPTicketName}-notes`}
                    className="w-[38vw] ml-8"
                    onChange={(value) =>
                      editDealMemoPrice(inputData.DMPTicketName, value.target.value, 'DMPNotes', 'default')
                    }
                    value={defaultPriceObj && defaultPriceObj.DMPNotes}
                    disabled={!canEdit}
                  />
                </div>
              </div>
            );
          })}
          {dealMemoPriceData.custom.map((inputData, index) => {
            const customPriceObj = dealMemoPriceData.custom.find(
              (price, i) => i === index, // Fallback to index if no unique identifier
            );

            return (
              <div key={index} className="flex items-center mt-2">
                <div className="w-1/5 text-primary-input-text font-bold">
                  <TextInput
                    testId="custom-ticket-name"
                    className="w-auto"
                    value={customPriceObj ? customPriceObj.DMPTicketName : ''}
                    onChange={(value) => editDealMemoPrice('', value.target.value, 'DMPTicketName', 'custom', index)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="w-4/5 flex">
                  <div className="w-1/5">
                    <TextInput
                      testId="no-of-custom-tickets"
                      className="w-auto"
                      pattern={/^\d*$/}
                      onChange={(value) =>
                        editDealMemoPrice('', parseFloat(value.target.value), 'DMPNumTickets', 'custom', index)
                      }
                      value={customPriceObj ? customPriceObj.DMPNumTickets : ''}
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="text-primary-input-text font-bold mr-2 mt-1">{currency.symbol}</div>

                  <TextInput
                    testId="custom-ticket-price"
                    className="w-auto"
                    pattern={/^\d*(\.\d*)?$/}
                    onChange={(value) => editDealMemoPrice('', value.target.value, 'DMPTicketPrice', 'custom', index)}
                    onBlur={(value) =>
                      editDealMemoPrice('', formatDecimalOnBlur(value), 'DMPTicketPrice', 'custom', index)
                    }
                    value={
                      customPriceObj ? (customPriceObj.DMPTicketPrice === 0 ? '' : customPriceObj.DMPTicketPrice) : ''
                    }
                    disabled={!canEdit}
                  />
                  <TextInput
                    testId="custom-ticket-notes"
                    className={classNames(
                      'ml-8',
                      dealMemoPriceData.custom.length === index + 1 && dealMemoPriceData.custom.length > 1
                        ? 'w-[35vw]' // Two icons present
                        : canEdit
                        ? 'w-[698px]' // Only one icon present
                        : 'w-[38vw]', // Unable to edit
                    )}
                    onChange={(value) => editDealMemoPrice('', value.target.value, 'DMPNotes', 'custom', index)}
                    value={customPriceObj && customPriceObj.DMPNotes}
                    disabled={!canEdit}
                  />

                  {canEdit && (
                    <div className="items-center flex-col">
                      <div className="flex flex-row ml-2 justify-between w-12">
                        {dealMemoPriceData.custom.length === index + 1 && (
                          <Icon iconName="plus-circle-solid" onClick={() => addRemoveCustomPrice('add')} variant="lg" />
                        )}

                        {dealMemoPriceData.custom.length > 1 && (
                          <Icon
                            iconName="minus-circle-solid"
                            onClick={() => addRemoveCustomPrice('delete', index)}
                            variant="lg"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Restoration Levy (per ticket)</div>
            <div className="w-4/5 flex items-center">
              <div className="w-3/6 flex">
                <div className="text-primary-input-text font-bold mr-2 -ml-4">{currency.symbol}</div>
                <TextInput
                  testId="restoration-levy"
                  className="w-auto"
                  pattern={/^\d*(\.\d*)?$/}
                  value={formData.RestorationLevy}
                  onChange={(value) => editDemoModalData('RestorationLevy', value.target.value, 'dealMemo')}
                  onBlur={(value) => editDemoModalData('RestorationLevy', formatDecimalOnBlur(value), 'dealMemo')}
                  disabled={!canEdit}
                />
              </div>

              <div className="w-5/6 flex">
                <div className="text-primary-input-text font-bold flex -ml-2">
                  Booking fees
                  <div className="ml-4 mr-2">{currency.symbol}</div>
                </div>
                <TextInput
                  testId="booking-fees"
                  className="w-auto"
                  pattern={/^\d*(\.\d*)?$/}
                  value={formData.BookingFees}
                  onChange={(value) => editDemoModalData('BookingFees', value.target.value, 'dealMemo')}
                  onBlur={(value) => editDemoModalData('BookingFees', formatDecimalOnBlur(value), 'dealMemo')}
                  disabled={!canEdit}
                />
                <div className="text-primary-input-text font-bold ml-[100px] mr-2">Credit Card Commission</div>
                <TextInput
                  testId="credit-card-commission-percentage"
                  className={classNames('w-auto', errors.CCCommissionPercent ? 'text-primary-red' : '')}
                  value={formData.CCCommissionPercent === 0 ? '0' : formData.CCCommissionPercent}
                  onChange={(value) => handlePercentChange('CCCommissionPercent', value.target.value)}
                  onBlur={(value) =>
                    editDemoModalData('CCCommissionPercent', formatPercentageValue(value.target.value), 'dealMemo')
                  }
                  disabled={!canEdit}
                />
                <div className="text-primary-input-text font-bold ml-2">%</div>
              </div>
            </div>
          </div>
          {errors.CCCommissionPercent && (
            <div className="ml-[67.8%] flex flex-row">
              <div className="w-4/5 flex items-center text-primary-red">Pecentage value must be between 0 and 100</div>
            </div>
          )}
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Transaction Charges</div>
            <div className="w-4/5 flex items-center">
              <Select
                onChange={(value) => {
                  editDemoModalData('TxnChargeOption', value, 'dealMemo');
                }}
                className="bg-primary-white w-2/5"
                placeholder="Please select..."
                options={transactionOptions}
                isClearable
                isSearchable
                value={formData.TxnChargeOption}
                testId="select-transaction-charges-type"
                disabled={!canEdit}
              />
              <div className="text-primary-input-text font-bold ml-16 mr-2">{currency.symbol}</div>
              <TextInput
                testId="transaction-charges-price"
                className="w-auto"
                pattern={/^\d*(\.\d*)?$/}
                value={formData.TxnChargeAmount}
                onChange={(value) => editDemoModalData('TxnChargeAmount', value.target.value, 'dealMemo')}
                onBlur={(value) => editDemoModalData('TxnChargeAmount', formatDecimalOnBlur(value), 'dealMemo')}
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Agreed Discounts</div>
            <div className="w-4/5 flex">
              <div className="w-full">
                <TextInput
                  testId="agreed-disocunts"
                  className="w-full"
                  value={formData.AgreedDiscounts}
                  onChange={(value) => editDemoModalData('AgreedDiscounts', value.target.value, 'dealMemo')}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/5"> </div>
            <div className="w-4/5 flex text-primary-input-text mb-2">
              No other discounts without written agreement from{' '}
              {`${currentProduction.ProductionCompany ? currentProduction.ProductionCompany.ProdCoName : ''}`}
            </div>
          </div>
          {[
            ['Maximum Ticket Agency Allocations', 'MaxTAAlloc'],
            ['Ticket Agency Allocations', 'TAAlloc'],
            ['Ticket Copy', 'TicketCopy'],
            ['Producer Complimentary  Tickets  Per  Performance', 'ProducerCompCount'],
            ['Other Tickets to be held off sale?', 'OtherHolds'],
          ].map((inputData) => {
            return (
              <div key={inputData[1]} className="flex items-center mt-2">
                <div className="w-1/5 text-primary-input-text font-bold">
                  {inputData[1] !== 'ProducerCompCount' ? (
                    inputData[0]
                  ) : (
                    <>
                      Producer Complimentary
                      <br />
                      Tickets Per Performance
                    </>
                  )}
                </div>
                <div className="w-4/5">
                  <TextInput
                    testId={`${inputData[0]}-text`}
                    className="w-full"
                    value={formData[inputData[1]]}
                    onChange={(value) =>
                      editDemoModalData(
                        inputData[1],
                        inputData[1] === 'ProducerCompCount' ? parseFloat(value.target.value) : value.target.value,
                        'dealMemo',
                      )
                    }
                    disabled={!canEdit}
                  />
                </div>
              </div>
            );
          })}
          <div className="flex items-center mb-4">
            <div className="w-1/5"> </div>
            <div className="w-4/5 flex text-primary-input-text">
              e.g. Wheelchair / Restricted View / House Seats / Press
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/5 text-primary-input-text font-bold">Age Limit / Guidance</div>
            <div className="w-4/5">
              <TextInput
                testId="age-limit-or-guidance"
                className="w-full"
                value={formData.AgeNotes}
                onChange={(value) => editDemoModalData('AgeNotes', value.target.value, 'dealMemo')}
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Sales Report Frequency</div>
            <div className="w-4/5 flex items-center">
              <TextInput
                testId="sales-report-frequency"
                className="w-[20vw]"
                value={currentProduction.SalesFrequency === 'W' ? 'Weekly' : 'Daily'}
                disabled={true}
              />
              <div className=" text-primary-input-text font-bold ml-20 mr-4">If Weekly, on</div>
              <Select
                onChange={(value) => editDemoModalData('SalesDayNum', value, 'dealMemo')}
                className="bg-primary-white w-[32vw]"
                placeholder="Sales Reporting Frequency"
                options={saleFrequencyDay}
                isClearable
                isSearchable
                value={formData.SalesDayNum}
                disabled={currentProduction.SalesFrequency !== 'W' || !canEdit}
                testId="select-day-for-sales-frequency"
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">to be sent to</div>
            <div className="w-4/5">
              <TextInput
                testId="sales-frequency-report-sent-to"
                className="w-full"
                value={currentProduction.SalesEmail || ''}
                placeholder="Add to Production Details"
                disabled
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5"> </div>
            <div className="w-4/5 flex">
              <Select
                onChange={(value) => editDemoModalData('SendTo', value, 'dealMemo')}
                isMulti
                className="bg-primary-white w-full"
                placeholder="Please select..."
                options={[{ text: 'Select All', value: 'select_all' }, ...userList]}
                isClearable
                isSearchable
                renderOption={(option) => <CustomOption option={option} isMulti={true} />}
                value={formData.SendTo}
                testId="please-select-asignee"
                disabled={!canEdit}
              />
            </div>
          </div>
          <hr className="bg-primary h-[3px] mt-4 mb-4" />
          <div className="text-xl text-primary-navy font-bold -mt-2.5">Marketing</div>
          <div className="flex items-center">
            <div className="w-1/5 text-primary-input-text font-bold">Marketing Manager</div>
            <div className="w-4/5 flex">
              <Select
                onChange={(value) => editDemoModalData('MMVenueContactId', value, 'dealMemo')}
                options={[...venueUserList]}
                disabled={venueUserList.length === 0 || !canEdit}
                className={classNames('bg-primary-white w-full', venueUserList.length === 0 && 'font-normal')}
                placeholder={vcSelectPlaceholder()}
                isClearable
                isSearchable
                value={formData.MMVenueContactId}
                testId="select-marketing-manager"
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
            <div className="w-4/5">
              <TextInput
                testId="marketing-manager-phone"
                className="w-full text-primary-input-text font-bold"
                placeholder={
                  venueUserData[formData.MMVenueContactId]
                    ? 'Add details to Venue Database'
                    : 'Please select from the dropdown above'
                }
                value={venueUserData[formData.MMVenueContactId] ? venueUserData[formData.MMVenueContactId].Phone : ''}
                disabled
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Email</div>
            <div className="w-4/5">
              <TextInput
                testId="marketing-manager-email"
                className="w-full text-primary-input-text font-bold"
                placeholder={
                  venueUserData[formData.MMVenueContactId]
                    ? 'Add details to Venue Database'
                    : 'Please select from the dropdown above'
                }
                value={venueUserData[formData.MMVenueContactId] ? venueUserData[formData.MMVenueContactId].Email : ''}
                disabled
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Brochure Deadline</div>
            <div className="w-4/5 flex items-center">
              <DateInput
                onChange={(value) => {
                  editDemoModalData('BrochureDeadline', value, 'dealMemo');
                }}
                value={formData.BrochureDeadline}
                testId="marketing-broucher-deadline"
                disabled={!canEdit}
              />
              <div className="text-primary-input-text font-bold ml-20 mr-4">Final Proof by</div>

              <DateInput
                onChange={(value) => {
                  editDemoModalData('FinalProofBy', value, 'dealMemo');
                }}
                value={formData.FinalProofBy}
                testId="marketing-final-proof-date"
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="flex mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Print Requirements</div>
            <div className="w-4/5">
              <TextArea
                className=" w-full h-auto"
                value={formData.PrintReqs}
                onChange={(value) => editDemoModalData('PrintReqs', value.target.value, 'dealMemo')}
                testId="print-requirements-notes"
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Print Delivery Address</div>
            <div className="w-4/5 flex">
              <div className="w-1/4">
                <Checkbox
                  className="pr-10"
                  labelClassName="!text-base"
                  id="includeExcludedVenues"
                  onChange={(value) => {
                    editDemoModalData('PrintDelUseVenueAddress', value.target.checked, 'dealMemo');
                  }}
                  checked={formData.PrintDelUseVenueAddress}
                  label="Same as Venue Address"
                  testId="same-as-venue-adress-checkbox"
                  disabled={!canEdit}
                />
              </div>

              <div className="w-3/4">
                <TextInput
                  testId="marketing-delivery-address"
                  className="w-3/4"
                  disabled={formData.PrintDelUseVenueAddress || !canEdit}
                  value={formData.PrintDelVenueAddressLine}
                  onChange={(value) => editDemoModalData('PrintDelVenueAddressLine', value.target.value, 'dealMemo')}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Local Marketing Budget</div>
            <div className="w-4/5 flex">
              <div className="text-primary-input-text font-bold mr-2">{currency.symbol}</div>

              <TextInput
                testId="local-marketing-budget"
                className="w-auto"
                pattern={/^\d*(\.\d*)?$/}
                value={formData.LocalMarketingBudget}
                onChange={(value) => editDemoModalData('LocalMarketingBudget', value.target.value, 'dealMemo')}
                onBlur={(value) => editDemoModalData('LocalMarketingBudget', formatDecimalOnBlur(value), 'dealMemo')}
                disabled={!canEdit}
              />
              <div className="text-primary-input-text font-bold ml-[132px]">Local Marketing Contra</div>
              <div className="text-primary-input-text font-bold mr-2 ml-4">{currency.symbol}</div>

              <TextInput
                testId="local-marketing-contract-price"
                className="w-auto"
                pattern={/^\d*(\.\d*)?$/}
                value={formData.LocalMarketingContra}
                onChange={(value) => editDemoModalData('LocalMarketingContra', value.target.value, 'dealMemo')}
                onBlur={(value) => editDemoModalData('LocalMarketingContra', formatDecimalOnBlur(value), 'dealMemo')}
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <div className="w-1/5"> </div>
            <div className="w-4/5 flex text-primary-input-text text-sm">
              Any expenditure needs pre-approval from{' '}
              {`${currentProduction.ProductionCompany ? currentProduction.ProductionCompany.ProdCoName : ''}`}
            </div>
          </div>
          <hr className="bg-primary h-[3px] mt-2 mb-4" />
          <div className="text-xl text-primary-navy font-bold -mt-2.5">Programmes and Merchandise</div>
          <div className="flex items-center mt-2">
            <div className="w-1/5 text-primary-input-text font-bold">Seller</div>
            <div className="w-4/5 flex">
              <Select
                onChange={(value) => editDemoModalData('SellWho', value, 'dealMemo')}
                className="bg-primary-white w-full"
                placeholder="Please select..."
                options={sellerOptions}
                value={formData.SellWho}
                isClearable
                isSearchable
                testId="select-seller-production-or-venue"
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="flex mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Items to be Sold</div>
            <div className="w-4/5 flex items-baseline">
              <Checkbox
                className="mr-2"
                labelClassName="!text-base"
                id="includeExcludedVenues"
                onChange={(value) => {
                  if (value.target.checked) {
                    editDemoModalData('SellProgrammes', value.target.checked, 'dealMemo');
                  } else {
                    setFormData({ ...formData, SellProgrammes: false, SellProgCommPercent: null });
                  }
                }}
                checked={formData.SellProgrammes}
                label="Programmes"
                testId="programmes-checkbox"
                disabled={!canEdit}
              />

              <Checkbox
                className="ml-2"
                labelClassName="!text-base"
                id="includeExcludedVenues"
                onChange={(value) => {
                  if (value.target.checked) {
                    editDemoModalData('SellMerch', value.target.checked, 'dealMemo');
                  } else {
                    setFormData({ ...formData, SellMerch: false, SellMerchCommPercent: null });
                  }
                }}
                checked={formData.SellMerch}
                label="Merchandise"
                testId="merchandise-checkbox"
                disabled={!canEdit}
              />

              <TextInput
                className="w-[48vw] ml-2"
                value={formData.MerchNotes}
                disabled={!formData.SellMerch || !canEdit}
                onChange={(value) => editDemoModalData('MerchNotes', value.target.value, 'dealMemo')}
                testId="items-to-be-sold-notes"
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Venue Commission</div>
            <div className="w-4/5 flex text-primary-input-text items-center">
              <div className="mr-4 font-bold">Programmes</div>
              <TextInput
                testId="venue-commission-for-programmes"
                className={classNames('w-[150px]', errors.SellProgCommPercent ? 'text-primary-red' : '')}
                value={formData.SellProgCommPercent === 0 ? '0' : formData.SellProgCommPercent}
                disabled={!formData.SellProgrammes || !canEdit}
                onChange={(value) => handlePercentChange('SellProgCommPercent', value.target.value)}
                onBlur={(value) =>
                  editDemoModalData('SellProgCommPercent', formatPercentageValue(value.target.value), 'dealMemo')
                }
              />
              <div className="ml-2 font-bold">%</div>
              <div className="mr-2 ml-16 font-bold">Merchandise</div>
              <TextInput
                testId="venue-commission-for-merchandise"
                className={classNames('w-[150px]', errors.SellMerchCommPercent ? 'text-primary-red' : '')}
                value={formData.SellMerchCommPercent === 0 ? '0' : formData.SellMerchCommPercent}
                disabled={!formData.SellMerch || !canEdit}
                onChange={(value) => handlePercentChange('SellMerchCommPercent', value.target.value)}
                onBlur={(value) =>
                  editDemoModalData('SellMerchCommPercent', formatPercentageValue(value.target.value), 'dealMemo')
                }
              />
              <div className="ml-2 font-bold">%</div>
              <div className="ml-14 font-bold">Fixed Pitch Fee Per Performance</div>
              <div className="ml-2 mr-2 font-bold">{currency.symbol}</div>

              <TextInput
                testId="fixed-pitch-fee"
                className="w-[150px]"
                pattern={/^\d*(\.\d*)?$/}
                value={formData.SellPitchFee}
                onChange={(value) => editDemoModalData('SellPitchFee', value.target.value, 'dealMemo')}
                onBlur={(value) => editDemoModalData('SellPitchFee', formatDecimalOnBlur(value), 'dealMemo')}
                disabled={!canEdit}
              />
            </div>
          </div>
          {(errors.SellProgCommPercent || errors.SellMerchCommPercent) && (
            <div className="ml-[20%] flex flex-row">
              <div className="w-4/5 flex items-center mt-2 text-primary-red">
                Pecentage value must be between 0 and 100
              </div>
            </div>
          )}
          <hr className="bg-primary h-[3px] mt-4 mb-4" />
          <div className="text-xl text-primary-navy font-bold -mt-2.5">Technical</div>
          <div className="flex items-center">
            <div className="w-1/5 text-primary-input-text font-bold">Technical Manager</div>
            <div className="w-4/5 flex">
              <Select
                onChange={(value) => editDemoModalData('TechVenueContactId', value, 'dealMemo')}
                options={[...venueUserList]}
                disabled={venueUserList.length === 0 || !canEdit}
                className={classNames('bg-primary-white w-full', venueUserList.length === 0 && 'font-normal')}
                placeholder={vcSelectPlaceholder()}
                isClearable
                isSearchable
                value={formData.TechVenueContactId}
                testId="select-tech-manager"
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
            <div className="w-4/5">
              <TextInput
                testId="tech-manager-phone-no"
                className="w-full text-primary-input-text font-bold"
                placeholder={
                  venueUserData[formData.TechVenueContactId]
                    ? 'Add details to Venue Database'
                    : 'Please select from the dropdown above'
                }
                value={
                  venueUserData[formData.TechVenueContactId] ? venueUserData[formData.TechVenueContactId].Phone : ''
                }
                disabled
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Email</div>
            <div className="w-4/5">
              <TextInput
                testId="tech-manager-email"
                className="w-full text-primary-input-text font-bold"
                placeholder={
                  venueUserData[formData.TechVenueContactId]
                    ? 'Add details to Venue Database'
                    : 'Please select from the dropdown above'
                }
                value={
                  venueUserData[formData.TechVenueContactId] ? venueUserData[formData.TechVenueContactId].Email : ''
                }
                disabled
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Company Arrival Date / Time</div>
            <div className="w-4/5 flex">
              <DateInput
                onChange={(value) => {
                  editDemoModalData('TechArrivalDate', value, 'dealMemo');
                }}
                value={formData.TechArrivalDate}
                testId="company-arrival-date"
                disabled={!canEdit}
              />
              <div className="ml-4 w-[100px]" data-testid="company-arrival-time">
                <TimeInput
                  className="w-fit h-[31px] [&>input]:!h-[25px] [&>input]:!w-11 !justify-center shadow-input-shadow ml-2"
                  value={formData && formData.TechArrivalTime ? dateToTimeString(formData.TechArrivalTime) : null}
                  disabled={disableDate || !canEdit}
                  onInput={(event) => handleTimeInput(event, 'TechArrivalTime')}
                  onBlur={() => handleTimeBlur('TechArrivalTime')}
                  onChange={() => null}
                  tabIndexShow={true}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">What3Words</div>
            <div className="w-4/5 flex items-center">
              <div className="w-3/6 flex flex-row">
                <div className="text-primary-input-text font-bold flex-col mr-3">Stage Door</div>
                <TextInput
                  testId="stage-door-text"
                  className="w-[25vw] text-primary-input-text font-bold flex-col"
                  disabled
                  placeholder={venueData.AddressStageDoorW3W ? '' : 'Add details to Venue Database'}
                  value={venueData ? venueData.AddressStageDoorW3W : null}
                />
              </div>

              <div className="w-3/6 flex flex-row">
                <div className="text-primary-input-text font-bold flex-col mr-3 ml-2">Loading Bay</div>
                <TextInput
                  testId="loading-bay-text"
                  className="w-[25vw] text-primary-input-text font-bold flex-col"
                  disabled
                  placeholder={venueData.AddressLoadingW3W ? '' : 'Add details to Venue Database'}
                  value={venueData ? venueData.AddressLoadingW3W : null}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4 -mb-2">
            <div className="w-1/5"> </div>
            <div className="w-4/5 flex">
              <div className="w-2/4 mr-2 text-primary-input-text font-bold">Venue to Provide</div>{' '}
              <div className="text-primary-input-text font-bold">Visiting Company to Provide</div>
            </div>
          </div>
          {dealMemoTechProvision.map((inputData) => {
            return (
              <div key={inputData.DMTechName} className="flex items-center mt-2">
                <div className="w-1/5 text-primary-input-text font-bold">{inputData.DMTechName} </div>
                <div className="w-4/5 flex">
                  <div className="w-2/4  mr-2">
                    <TextInput
                      testId={`venue-to-provide-${inputData.DMTechName}`}
                      className="w-full"
                      value={inputData.DMTechVenue}
                      onChange={(value) =>
                        editTechProvisionModalData('DMTechVenue', value.target.value, inputData.DMTechName)
                      }
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="w-2/4 ml-2">
                    <TextInput
                      testId={`visiting-to-provide-${inputData.DMTechName}`}
                      className="w-full"
                      value={inputData.DMTechCompany}
                      onChange={(value) =>
                        editTechProvisionModalData('DMTechCompany', value.target.value, inputData.DMTechName)
                      }
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <hr className="bg-primary h-[3px] mt-4 mb-4" />
          <div className="text-xl text-primary-navy font-bold -mt-2.5">Misc.</div>
          <div className="flex items-center">
            <div className="w-1/5 text-primary-input-text font-bold">No. of Dressing Rooms</div>
            <div className="w-4/5 flex">
              <div className="w-full">
                <TextInput
                  testId="no-of-dressing-rooms"
                  className="w-full"
                  value={formData.DressingRooms}
                  onChange={(value) => editDemoModalData('DressingRooms', value.target.value, 'dealMemo')}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Laundry Facilities</div>
            <div className="w-4/5 flex items-center">
              <div className="text-primary-input-text font-bold mr-2">Washer</div>
              <Checkbox
                className="flex flex-row-reverse mr-2"
                labelClassName="!text-base"
                id="includeExcludedVenues"
                onChange={(value) => editDemoModalData('NumFacilitiesLaundry', value.target.checked, 'dealMemo')}
                checked={formData.NumFacilitiesLaundry}
                testId="washer-checkbox"
                disabled={!canEdit}
              />
              <div className="text-primary-input-text font-bold mr-2 ml-6">Dryer</div>

              <Checkbox
                className="flex flex-row-reverse mr-2"
                labelClassName="!text-base"
                id="includeExcludedVenues"
                onChange={(value) => editDemoModalData('NumFacilitiesDrier', value.target.checked, 'dealMemo')}
                checked={formData.NumFacilitiesDrier}
                testId="dryer-checkbox"
                disabled={!canEdit}
              />
              <div className="text-primary-input-text font-bold mr-2 ml-6">Laundry Room</div>

              <Checkbox
                className="flex flex-row-reverse mr-2"
                labelClassName="!text-base"
                id="includeExcludedVenues"
                onChange={(value) => editDemoModalData('NumFacilitiesLaundryRoom', value.target.checked, 'dealMemo')}
                checked={formData.NumFacilitiesLaundryRoom}
                testId="laundry-room-checkbox"
                disabled={!canEdit}
              />
              <div className="w-3/5 ml-8">
                <TextInput
                  testId="laundry-notes"
                  className="w-full"
                  value={formData.NumFacilitiesNotes}
                  onChange={(value) => editDemoModalData('NumFacilitiesNotes', value.target.value, 'dealMemo')}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Catering</div>
            <div className="w-4/5 flex">
              <div className="w-full">
                <TextInput
                  testId="catering-notes"
                  className="w-full"
                  value={formData.NumCateringNotes}
                  onChange={(value) => editDemoModalData('NumCateringNotes', value.target.value, 'dealMemo')}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
          <hr className="bg-primary h-[3px] mt-4 mb-4" />
          <div className="text-xl text-primary-navy font-bold -mt-2.5">Contract / Settlement</div>
          <div className="flex items-center">
            <div className="w-1/5 text-primary-input-text font-bold">Barring Clause</div>
            <div className="w-4/5 flex">
              <div className="w-full">
                <TextInput
                  testId="barring-clause-notes"
                  className="w-full"
                  value={formData.BarringClause}
                  onChange={(value) => editDemoModalData('BarringClause', value.target.value, 'dealMemo')}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Advance Payment</div>
            <div className="w-4/5 flex items-center">
              <Select
                onChange={(value) => {
                  if (value) {
                    editDemoModalData('AdvancePaymentRequired', value, 'dealMemo');
                  } else {
                    setFormData({
                      ...formData,
                      AdvancePaymentAmount: null,
                      AdvancePaymentDueBy: null,
                      AdvancePaymentRequired: false,
                    });
                  }
                }}
                className="bg-primary-white w-40"
                placeholder="Please select..."
                options={booleanOptions}
                isClearable
                value={formData.AdvancePaymentRequired}
                testId="select-advance-payment-yes-or-no"
                disabled={!canEdit}
              />
              <div className=" text-primary-input-text font-bold ml-20">
                If Yes, Amount<span className="ml-2 mr-2">{currency.symbol}</span>
              </div>

              <TextInput
                testId="advance-payment-yes-amount"
                className="w-full"
                value={formData.AdvancePaymentAmount}
                pattern={/^\d*(\.\d*)?$/}
                onChange={(value) => editDemoModalData('AdvancePaymentAmount', value.target.value, 'dealMemo')}
                onBlur={(value) => editDemoModalData('AdvancePaymentAmount', formatDecimalOnBlur(value), 'dealMemo')}
                disabled={!formData.AdvancePaymentRequired || !canEdit}
              />
              <div className=" text-primary-input-text font-bold ml-20 mr-2"> Date Payment to be Made</div>

              <DateInput
                onChange={(value) => {
                  editDemoModalData('AdvancePaymentDueBy', value, 'dealMemo');
                }}
                value={formData.AdvancePaymentDueBy}
                disabled={!formData.AdvancePaymentRequired || !canEdit}
                testId="advance-payment-date-to-be-made"
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">Settlement Terms</div>
            <div className="w-4/5 flex items-center">
              <div className=" text-primary-input-text font-bold">Payment to be made </div>

              <div className=" text-primary-input-text font-bold ml-4 mr-2">Same Day</div>
              <Checkbox
                className="flex flex-row-reverse"
                labelClassName="!text-base"
                id="includeExcludedVenues"
                onChange={(value) => {
                  if (value.target.checked) {
                    setFormData({ ...formData, SettlementSameDay: value.target.checked, SettlementDays: null });
                  } else {
                    editDemoModalData('SettlementSameDay', value.target.checked, 'dealMemo');
                  }
                }}
                checked={formData.SettlementSameDay}
                testId="payment-same-day-checkbox"
                disabled={!canEdit}
              />
              <div className=" text-primary-input-text font-bold ml-4 mr-2">or within</div>

              <TextInput
                testId="payment-within-days"
                className="w-full"
                value={formData.SettlementDays}
                onChange={(value) => editDemoModalData('SettlementDays', parseFloat(value.target.value), 'dealMemo')}
                disabled={formData.SettlementSameDay || !canEdit}
              />

              <div className=" text-primary-input-text font-bold ml-2">days</div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-1/5 text-primary-input-text font-bold">
              {currentProduction.ProductionCompany ? currentProduction.ProductionCompany.ProdCoName : ''} VAT No.
            </div>
            <div className="w-4/5 flex">
              <div className="w-full">
                <TextInput
                  testId="vat-no"
                  className="w-full"
                  value={
                    currentProduction.ProductionCompany
                      ? currentProduction.ProductionCompany.ProdCoVATCode
                      : 'To add a VAT number, please contact your system administrator'
                  }
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="mt-4 mb-2">
            <div className="text-primary-input-text font-bold">
              Please include the following clause(s) in the contract:
            </div>
            <div className="w-full">
              <TextArea
                className="h-[113px] w-full"
                value={formData.ContractClause}
                onChange={(value) => editDemoModalData('ContractClause', value.target.value, 'dealMemo')}
                testId="clauses-notes"
                disabled={!canEdit}
              />
            </div>
          </div>
        </div>

        <div className="w-full mt-4 flex justify-between items-center">
          {/* Error message aligned to the left (if present) */}
          {showSubmitError ? (
            <div className="text-primary-red">Please review the highlighted fields in red for errors before saving</div>
          ) : (
            <div />
          )}

          <div className="flex justify-end items-center">
            <Button onClick={() => handleCancelForm(false)} className="w-33" variant="secondary" text="Cancel" />
            <Button
              onClick={() => submitForm(false)}
              className="ml-4 w-28"
              variant="primary"
              text="Save and Close"
              testId="deal-memo-save-and-close"
            />
            <Button
              onClick={() => submitForm(true)}
              className="ml-4 w-44"
              variant="primary"
              text="Save, Close and Export"
              testId="deal-memo-save-close-and-export"
              iconProps={{ className: 'h-4 w-3' }}
              sufixIconName="document-solid"
              disabled={!canExport}
            />
          </div>
        </div>

        {isLoading && <LoadingOverlay />}
        <ConfirmationDialog
          labelYes="Yes"
          labelNo="No"
          show={cancelModal}
          variant="cancel"
          onNoClick={() => setCancelModal(false)}
          onYesClick={() => handleCancelForm(true)}
        />
      </PopupModal>
    </div>
  );
};

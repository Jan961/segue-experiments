import PopupModal from 'components/core-ui-lib/PopupModal';
import classNames from 'classnames';
import Select from 'components/core-ui-lib/Select';
import TextInput from 'components/core-ui-lib/TextInput';
import DateInput from 'components/core-ui-lib/DateInput';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Button from 'components/core-ui-lib/Button';
import { ContactDemoFormData, DealMemoContractFormData, DealMemoHoldType, ProductionDTO } from 'interfaces';
import { AddEditContractsState } from 'state/contracts/contractsState';
import { useEffect, useMemo, useState } from 'react';
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
  filterCurrencyNum,
  filterHoldTypeData,
  filterPercentage,
  filterPrice,
  filterTechProvision,
  parseAndSortDates,
} from '../utils';
import { DealMemoHold, DealMemoTechProvision } from 'prisma/generated/prisma-client';
import { dealMemoInitialState } from 'state/contracts/contractsFilterState';
import {
  convertTimeToTodayDateFormat,
  dateToTimeString,
  formattedDateWithDay,
  getShortWeekFormat,
} from 'services/dateService';
import { VENUE_CURRENCY_SYMBOLS } from 'types/MarketingTypes';
import StandardSeatKillsTable from '../table/StandardSeatKillsTable';
import LoadingOverlay from 'components/shows/LoadingOverlay';
import { CustomOption } from 'components/core-ui-lib/Table/renderers/SelectCellRenderer';
import { trasformVenueAddress } from 'utils/venue';
import { accountContactState } from 'state/contracts/accountContactState';

export const EditDealMemoContractModal = ({
  visible,
  onCloseDemoForm,
  productionJumpState,
  selectedTableCell,
  demoModalData,
  venueData,
  dealHoldType,
}: {
  visible: boolean;
  onCloseDemoForm: () => void;
  productionJumpState: Partial<ProductionDTO>;
  selectedTableCell: AddEditContractsState;
  demoModalData: Partial<DealMemoContractFormData>;
  venueData;
  dealHoldType: DealMemoHoldType;
}) => {
  const [formData, setFormData] = useRecoilState(dealMemoInitialState);
  const [contractCheckBox, setContractCheckBox] = useState<boolean>(false);
  const [dealMemoPriceFormData, setdealMemoPriceFormData] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dealCall, setDealCall] = useState([]);
  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const [dealMemoCustomPriceFormData, setDealMemoCustomPriceFormData] = useState<any>([]);
  const [dealMemoTechProvision, setDealMemoTechProvision] = useState<DealMemoTechProvision[]>([]);
  const [formEdited, setFormEdited] = useState<boolean>(false);
  const [disableDate, setDisableDate] = useState<boolean>(true);
  const [seatKillsData, setSeatKillsData] = useState([]);
  const [sendTo, setSendTo] = useState([]);
  const [currency, setCurrency] = useState('');
  const accountContacts = useRecoilValue(accountContactState);

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
            text: `${FirstName || ''} ${LastName || ''} | ${VenueRole.Name}`,
          }))
        : [],
    [venueData],
  );

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
    setFormData({ ...demoModalData });

    const priceData = filterPrice(demoModalData.DealMemoPrice);
    const holdTypeData = filterHoldTypeData(dealHoldType, demoModalData.DealMemoHold);

    setSeatKillsData(holdTypeData);
    setdealMemoPriceFormData(priceData[0]);
    setDealMemoCustomPriceFormData(priceData[1]);
    const techProvisionData = demoModalData.DealMemoTechProvision ? demoModalData.DealMemoTechProvision : [];
    const techProvision = filterTechProvision(techProvisionData);
    setDealMemoTechProvision([...techProvision]);
    const demoCall =
      demoModalData.DealMemoCall && demoModalData.DealMemoCall.length > 0
        ? demoModalData.DealMemoCall
        : [defaultDemoCall];
    setDealCall([...demoCall]);
    setDisableDate(false);
  }, []);

  const [contactsData, setContactsData] = useState<ContactDemoFormData>({ phone: '', email: '', id: null });
  const { users } = useRecoilValue(userState);
  const userList = useMemo(
    () =>
      Object.values(users).map(({ AccUserId, UserFirstName = '', UserLastName = '', UserEmail = '' }) => ({
        value: AccUserId,
        text: `${UserFirstName || ''} ${UserLastName || ''} | ${UserEmail || ''}`,
      })),
    [users],
  );

  useEffect(() => {
    const data = [...Object.values(dealMemoPriceFormData), ...dealMemoCustomPriceFormData];
    setFormData((prevDealMemo) => ({
      ...prevDealMemo,
      DealMemoPrice: data,
    }));
  }, [dealMemoCustomPriceFormData, dealMemoPriceFormData]);

  useEffect(() => {
    setFormData((prevDealMemo) => ({
      ...prevDealMemo,
      DealMemoTechProvision: [],
    }));
  }, [dealMemoTechProvision]);

  useEffect(() => {
    const data = [...dealCall];
    setFormData((prevDealMemo) => ({
      ...prevDealMemo,
      DealMemoCall: data,
    }));
  }, [dealCall]);

  console.log(formData);

  const getCurrency = async (bookingId) => {
    try {
      const response = await axios.get(`/api/marketing/currency/booking/${bookingId}`);

      if (response.data && typeof response.data === 'object') {
        const currencyObject = response.data as { currency: string };
        setCurrency(currencyObject.currency);
      }
    } catch (error) {
      console.error('Error retrieving currency:', error);
    }
  };

  useEffect(() => {
    if (selectedTableCell.contract.Id) {
      getCurrency(selectedTableCell.contract.Id);
    }
  }, [selectedTableCell.contract.Id]);

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
        data[key] = value;
        return data;
      } else {
        return data;
      }
    });
    setDealMemoTechProvision([...techProvisionData]);
  };

  const saveDemoModalData = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/api/dealMemo/updateDealMemo/${selectedTableCell.contract.Id}`, {
        formData,
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

      editDemoModalData('CompContactId', value, 'dealMemo');
    }

    setIsLoading(false);
  };

  const editDealMemoPrice = async (
    key: string,
    data: string | number,
    dataKey: string,
    index?: number,
    price?: string,
  ) => {
    if (price === 'customPrice') {
      const dataDemo = [...dealMemoCustomPriceFormData];
      dataDemo[index] = {
        ...dataDemo[index],
        [dataKey]: data,
      };
      setDealMemoCustomPriceFormData([...dataDemo]);
    } else {
      const dataDemo = { ...dealMemoPriceFormData };
      dataDemo[key] = {
        ...dataDemo[key],
        [dataKey]: data,
        DMPDeMoId: formData.Id,
      };
      setdealMemoPriceFormData({ ...dataDemo });
    }
  };

  const handleCustomPrice = (key: boolean, index: number) => {
    const data = {
      DMPTicketName: '',
      DMPTicketPrice: 0,
      DMPNumTickets: 0,
      DMPId: 0,
      DMPDeMoId: 0,
      DMPNotes: '',
    };
    const priceData = [...dealMemoCustomPriceFormData];
    if (key) {
      priceData.push(data);
    } else {
      const deletedPrice = priceData.splice(index, 1);
      if (deletedPrice[0].DMPId > 0) {
        axios.delete(`/api/dealMemo/updateDealMemoPrice/${selectedTableCell.contract.Id}`, {
          data: deletedPrice[0],
        });
      }
    }
    setDealMemoCustomPriceFormData(priceData);
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

  const handleStandardSeatsTableData = (value) => {
    const data = [...(Object.values(value) as unknown as DealMemoHold[])];
    setFormData((prevDealMemo) => ({
      ...prevDealMemo,
      DealMemoHold: data,
    }));
  };

  const setSendToData = (value) => {
    setSendTo(value);
  };
  return (
    <PopupModal
      show={visible}
      title="Deal Memo"
      titleClass={classNames('text-xl text-primary-navy font-bold -mt-2.5')}
      onClose={() => handleCancelForm(false)}
      hasOverlay={true}
      hasOverflow={false}
    >
      <div className="h-[80vh] w-[82vw] overflow-y-scroll pr-2">
        <p className="text-primary-red ">PLEASE NOTE:</p>{' '}
        <p className="text-primary-input-text">
          Some information is pre-populated from other areas of Segue. <br /> For venue details including addresses and
          venue contacts, please see <b>VENUE DATABASE.</b>
          <br /> For performance details including dates and times, please see <b>BOOKINGS.</b> <br /> For production
          company details including Promotor contacts and VAT number, please see <b>SYSTEM ADMIN.</b> <br />
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
                value={productionJumpState.ShowName}
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
              />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Date Deal Memo Issued</div>
          <div className="w-4/5 flex">
            <DateInput
              onChange={(value) => {
                editDemoModalData('DateIssued', value, 'dealMemo');
              }}
              value={formData.DateIssued}
            />
          </div>
        </div>
        <div className="text-primary-input-text mt-4">
          Please read this carefully to ensure it reflects the terms as agreed between{' '}
          {`${productionJumpState.ProductionCompany ? productionJumpState.ProductionCompany.ProdCoName : ''}`} and{' '}
          {`${selectedTableCell.contract.venue}`}.
          <br />
          Please note that any terms not specifically mentioned here are still to be negotiated. If you have any
          standard conditions that you consider to be non-negotiable, or if you{' '}
          <span className="flex">
            have any queries about the Deal Memo, please contact{' '}
            <Select
              onChange={(value) => {
                editDemoModalData('AccContId', value, 'dealMemo');
              }}
              className="bg-primary-white w-3/12 ml-2 mr-2"
              placeholder="Please select..."
              options={[{ text: 'Select Assignee', value: null }, ...companyContactList]}
              isClearable
              isSearchable
              value={formData.AccContId}
            />
            ASAP
          </span>
        </div>
        <div className="text-primary-input-text mt-4">
          If we have requested anything that incurs a cost, it must be agreed with
          {`${productionJumpState.ProductionCompany ? productionJumpState.ProductionCompany.ProdCoName : ''}`}
          prior to our arrival. No extras will be paid without a pre-authorisation
          {`(this includes internet access).`} Unless otherwise agreed, all staff calls will be scheduled within the
          contractual allowance- if you foresee any overtime, please advise immediately.
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Contacts</div>
        <div className="flex items-center">
          <div className="w-1/5 text-primary-input-text font-bold">Company Contact</div>
          <div className="w-4/5">
            <Select
              onChange={(value) => {
                handleContactsSection(value);
              }}
              className="bg-primary-white wfull"
              placeholder="Please select..."
              options={[{ text: 'Select Assignee', value: null }, ...companyContactList]}
              isClearable
              isSearchable
              value={formData.CompContactId}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
          <div className="w-4/5 flex items-center">
            <div className="w-3/4">
              <TextInput
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
              className="w-[400px] text-primary-input-text font-bold"
              disabled
              value={productionJumpState.ShowName}
            />
            <div className="text-primary-input-text font-bold ml-8 mr-4"> No. of Performances</div>
            <TextInput
              className="w-[350px] text-primary-input-text font-bold"
              disabled
              value={selectedTableCell.contract.performanceCount}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Performance Date(s) and Time(s)</div>
          <div className="w-4/5 flex">
            <div>
              {selectedTableCell.contract.PerformanceTimes &&
                parseAndSortDates(selectedTableCell.contract.PerformanceTimes).map((dateTimeEntry) => (
                  <TextInput
                    key={dateTimeEntry.id}
                    testId="performanceDate"
                    className="w-[350px] mt-1 mb-1 text-primary-input-text font-bold"
                    disabled
                    value={
                      getShortWeekFormat(dateTimeEntry.formattedDate) +
                      ' ' +
                      formattedDateWithDay(dateTimeEntry.formattedDate)
                    }
                  />
                ))}
              {!selectedTableCell.contract.PerformanceTimes && (
                <TextInput
                  testId="performanceTime"
                  className="w-[350px] mt-1 mb-1 text-primary-input-text font-bold"
                  placeholder="—"
                  disabled
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Running Time (inc. Intervals)</div>
          <div className="w-4/5 flex items-center">
            <TimeInput
              className="w-fit h-[31px] [&>input]:!h-[25px] [&>input]:!w-11 !justify-center shadow-input-shadow"
              value={
                productionJumpState && productionJumpState.RunningTime
                  ? dateToTimeString(productionJumpState.RunningTime)
                  : null
              }
              disabled
              onChange={() => {
                return null;
              }}
              tabIndexShow={true}
            />
            <div className=" text-primary-input-text font-bold ml-8 mr-4">Notes</div>

            <TextInput testId="runningNote" className="w-[51vw]" disabled value={productionJumpState.RunningTimeNote} />
          </div>
        </div>
        <div className="flex mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Pre / Post Show Events</div>
          <div className="w-4/5 flex">
            <div className="w-[65vw]">
              <TextArea
                testId="prePostShow"
                className="w-full h-auto"
                value={formData.PrePostShowEvents}
                onChange={(value) => editDemoModalData('PrePostShowEvents', value.target.value, 'dealMemo')}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Off-Stage Venue Curfew Time</div>
          <div className="w-4/5 flex items-center">
            <TimeInput
              className="w-fit h-[31px] [&>input]:!h-[25px] [&>input]:!w-11 !justify-center shadow-input-shadow"
              value={formData && formData.VenueCurfewTime ? dateToTimeString(formData.VenueCurfewTime) : null}
              disabled={disableDate}
              onChange={(value) =>
                editDemoModalData('VenueCurfewTime', convertTimeToTodayDateFormat(value), 'dealMemo')
              }
              tabIndexShow={true}
            />
            <div className=" text-primary-input-text font-bold ml-8 mr-4">Notes</div>

            <TextInput
              testId="notes"
              className="w-[51vw]"
              value={formData.RunningTimeNotes}
              onChange={(value) => editDemoModalData('RunningTimeNotes', value.target.value, 'dealMemo')}
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
              options={[{ text: 'Select Assignee', value: null }, ...venueUserList]}
              className="bg-primary-white w-full"
              placeholder="Please select..."
              isClearable
              isSearchable
              value={formData.ProgrammerVenueContactId}
            />
          </div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
          <div className="w-4/5">
            <TextInput
              testId="programmerPhoneText"
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
              testId="programmerEmailText"
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
          <div className="w-4/5 flex items-center">
            <TextInput
              testId="dealText"
              className="w-[100px]"
              value={formData.ROTTPercentage}
              type="number"
              onChange={(value) =>
                editDemoModalData('ROTTPercentage', filterPercentage(parseFloat(value.target.value)), 'dealMemo')
              }
            />{' '}
            <div className=" text-primary-input-text font-bold ml-2">%</div>
            <div className=" text-primary-input-text font-bold ml-12 mr-4">PRS</div>
            <TextInput
              testId="prsText"
              className="w-[100px]"
              value={formData.PRSPercentage}
              type="number"
              onChange={(value) =>
                editDemoModalData('PRSPercentage', filterPercentage(parseFloat(value.target.value)), 'dealMemo')
              }
            />
            <div className=" text-primary-input-text font-bold ml-2">%</div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Guarantee</div>
          <div className="w-4/5 flex items-center">
            <Select
              onChange={(value) => {
                editDemoModalData('Guarantee', value, 'dealMemo');
              }}
              className="bg-primary-white w-26 mr-3"
              placeholder="Please select.."
              options={booleanOptions}
              isClearable
              isSearchable
              value={formData.Guarantee}
            />
            <div className="text-primary-input-text font-bold ml-14 mr-5">{currency}</div>

            <TextInput
              testId="guarnteeText"
              className="w-[140px] ml-1"
              type="number"
              value={formData.GuaranteeAmount}
              onChange={(value) =>
                editDemoModalData('GuaranteeAmount', filterCurrencyNum(parseFloat(value.target.value)), 'dealMemo')
              }
              placeholder="00.00"
              disabled={!formData.Guarantee}
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
              placeholder="Please select.."
              options={booleanOptions}
              isClearable
              isSearchable
              value={formData.HasCalls}
            />
            <div>
              {dealCall.map((call, index) => {
                return (
                  <div className="flex mb-6 items-center" key={index}>
                    <div className="text-primary-input-text font-bold ml-6 mr-2 w-[90px] mt-2">{calls[index]} Call</div>

                    <Select
                      onChange={(value) => {
                        editDemoCallModalData('DMCPromoterOrVenue', value, index);
                      }}
                      value={dealCall[index].DMCPromoterOrVenue}
                      className="bg-primary-white w-[170px] mr-1 "
                      placeholder=""
                      options={callOptions}
                      isClearable
                      isSearchable
                      disabled={!formData.HasCalls}
                    />

                    <Select
                      onChange={(value) => {
                        editDemoCallModalData('DMCType', value, index);
                      }}
                      value={dealCall[index].DMCType}
                      className="bg-primary-white w-[170px] mr-1 ml-6"
                      placeholder=""
                      options={callValueOptions}
                      isClearable
                      isSearchable
                      disabled={!formData.HasCalls}
                    />
                    <div
                      className={`text-primary-input-text font-bold ml-8 ${
                        dealCall[index].DMCType === 'p' ? 'mr-4' : 'mr-2'
                      }`}
                    >{`${dealCall[index].DMCType === 'p' ? ' ' : VENUE_CURRENCY_SYMBOLS.POUND}`}</div>

                    <TextInput
                      testId={`${dealCall[index].DMCType}${index}`}
                      className="w-[140px] ml-2"
                      type="number"
                      value={dealCall[index].DMCValue}
                      placeholder="00.00"
                      disabled={!formData.HasCalls}
                      onChange={(value) =>
                        editDemoCallModalData('DMCValue', filterCurrencyNum(parseFloat(value.target.value)), index)
                      }
                    />
                    <div className=" text-primary-input-text font-bold ml-2 w-2">{`${
                      dealCall[index].DMCType === 'v' ? '' : '%'
                    }`}</div>
                    <div className="flex ">
                      {index === dealCall.length - 1 && (
                        <Icon
                          className="ml-2"
                          iconName="plus-circle-solid"
                          onClick={() => formData.HasCalls && handleCall(true, index)}
                          variant="lg"
                        />
                      )}

                      {index === dealCall.length - 1 && index > 0 && (
                        <Icon
                          className="ml-2"
                          iconName="minus-circle-solid"
                          onClick={() => formData.HasCalls && handleCall(false, index)}
                          variant="lg"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Promoter Split</div>
          <div className="w-4/5 flex items-center">
            <TextInput
              testId="promoterSplitText"
              className="w-[100px] ml-6"
              type="number"
              value={formData.PromoterSplitPercentage}
              onChange={(value) =>
                editDemoModalData(
                  'PromoterSplitPercentage',
                  filterPercentage(parseFloat(value.target.value)),
                  'dealMemo',
                )
              }
            />

            <div className="text-primary-input-text font-bold ml-2 mr-2">%</div>

            <div className="text-primary-input-text font-bold ml-20 mr-2">Venue Split</div>

            <TextInput
              testId="venueSplitText"
              className="w-[100px]"
              value={formData.VenueSplitPercentage}
              onChange={(value) =>
                editDemoModalData('VenueSplitPercentage', filterPercentage(parseFloat(value.target.value)), 'dealMemo')
              }
            />
            <div className="text-primary-input-text font-bold ml-2 mr-2">%</div>
          </div>
        </div>
        {[
          ['Venue Rental', 'VenueRental', 'VenueRentalNotes'],
          ['Staffing Contra', 'StaffingContra', 'StaffingContraNotes'],
          ['Agreed Contra Items', 'AgreedContraItems', 'AgreedContraItemsNotes'],
        ].map((inputData) => {
          return (
            <div key={inputData[0]} className="flex items-center mt-4">
              <div className="w-1/5 text-primary-input-text font-bold">{inputData[0]}</div>
              <div className="w-4/5 flex items-center">
                <div className="text-primary-input-text font-bold  mr-4">{currency}</div>

                <TextInput
                  testId={`${inputData[1]}Text`}
                  type="number"
                  className="w-[100px] mr-6"
                  value={formData[inputData[1]]}
                  onChange={(value) =>
                    editDemoModalData(inputData[1], filterCurrencyNum(parseFloat(value.target.value)), 'dealMemo')
                  }
                />
                <TextInput
                  testId={`${inputData[2]}Text`}
                  className="w-[54vw]"
                  value={formData[inputData[2]]}
                  onChange={(value) => editDemoModalData(inputData[2], value.target.value, 'dealMemo')}
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
              className="bg-primary-white w-full"
              placeholder="Please select..."
              options={venueUserList}
              isClearable
              isSearchable
              value={formData.BOMVenueContactId}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
          <div className="w-4/5">
            <TextInput
              testId="boxOfficePhoneText"
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
              testId="boxOfficeEmailText"
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
              onChange={(value) => {
                editDemoModalData('OnSaleDate', value, 'dealMemo');
              }}
              value={formData.OnSaleDate}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Accounts Contact for Settlement</div>
          <div className="w-4/5 flex">
            <Select
              onChange={(value) => editDemoModalData('SettlementVenueContactId', value, 'dealMemo')}
              className="bg-primary-white w-full"
              placeholder="Please select..."
              options={venueUserList}
              isClearable
              isSearchable
              value={formData.SettlementVenueContactId}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
          <div className="w-4/5">
            <TextInput
              testId="SettlePhoneText"
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
              testId="SettlePhoneEmail"
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
          <div className="w-1/5 text-primary-input-text font-bold">Venue Capacity</div>
          <div className="w-4/5 flex items-center">
            <TextInput
              testId="venueCapacityText"
              className="w-auto text-primary-input-text font-bold"
              value={venueData ? venueData.Seats : null}
              disabled
            />
            <div className="text-primary-input-text font-bold ml-8 mr-2">Sellable Capacity</div>

            <TextInput
              testId="sellCapacityText"
              className="w-auto"
              value={formData.SellableSeats}
              onChange={(value) => editDemoModalData('SellableSeats', parseFloat(value.target.value), 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Standard Seat kills</div>
          <div className="w-4/5 flex">
            <div className="w-[394px]">
              <div>
                <StandardSeatKillsTable
                  rowData={seatKillsData}
                  tableData={(value) => handleStandardSeatsTableData(value)}
                />
              </div>
            </div>
            <div className="ml-16">
              <div className="text-primary-input-text font-bold">Hold Notes</div>
              <TextArea
                testId="holdNotesText"
                className="mt-2 mb-2 w-full h-auto"
                value={formData.OtherHolds}
                placeholder="Notes Field"
                onChange={(value) => editDemoModalData('OtherHolds', value.target.value, 'dealMemo')}
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
            <span className=" text-primary-input-text font-bold ml-4">Price</span>
          </div>
        </div>
        {Object.values(dealMemoPriceFormData as unknown).map((inputData, index) => {
          return (
            <div key={inputData.DMPTicketName} className="flex items-center mt-2">
              <div className="w-1/5 text-primary-input-text font-bold">{inputData.DMPTicketName} </div>
              <div className="w-4/5 flex">
                <div className="w-1/5">
                  <TextInput
                    testId={`DMPNumTickets${index}Text`}
                    className="w-auto"
                    onChange={(value) =>
                      editDealMemoPrice(inputData.DMPTicketName, parseFloat(value.target.value), 'DMPNumTickets')
                    }
                    value={
                      dealMemoPriceFormData[inputData.DMPTicketName]
                        ? dealMemoPriceFormData[inputData.DMPTicketName].DMPNumTickets
                        : null
                    }
                  />
                </div>

                <div className="text-primary-input-text font-bold mr-2">{currency}</div>

                <TextInput
                  testId={`DMPTicketPrice${index}Text`}
                  className="w-auto"
                  onChange={(value) =>
                    editDealMemoPrice(
                      inputData.DMPTicketName,
                      filterCurrencyNum(parseFloat(value.target.value)),
                      'DMPTicketPrice',
                    )
                  }
                  value={
                    dealMemoPriceFormData[inputData.DMPTicketName]
                      ? dealMemoPriceFormData[inputData.DMPTicketName].DMPTicketPrice
                      : null
                  }
                />
                <TextInput
                  testId={`DMPNotes${index}Text`}
                  className="w-[38vw] ml-8"
                  onChange={(value) => editDealMemoPrice(inputData.DMPTicketName, value.target.value, 'DMPNotes')}
                  value={
                    dealMemoPriceFormData[inputData.DMPTicketName]
                      ? dealMemoPriceFormData[inputData.DMPTicketName].DMPNotes
                      : ''
                  }
                />
              </div>
            </div>
          );
        })}
        {dealMemoCustomPriceFormData.map((newKey, index) => {
          if (index > 0) {
            return (
              <div key={index} className="flex items-center mt-2">
                <div className="w-1/5">
                  <TextInput
                    testId={`customPrice${index}Text`}
                    className="w-auto"
                    value={dealMemoCustomPriceFormData[index].DMPTicketName}
                    onChange={(value) =>
                      editDealMemoPrice('DMPTicketName', value.target.value, 'DMPTicketName', index, 'customPrice')
                    }
                  />
                </div>
                <div className="w-4/5 flex">
                  <div className="w-1/5">
                    <TextInput
                      testId={`DMPNumTicketsCustomPrice${index}Text`}
                      className="w-auto"
                      value={dealMemoCustomPriceFormData[index].DMPNumTickets}
                      onChange={(value) =>
                        editDealMemoPrice(
                          'DMPNumTickets',
                          parseFloat(value.target.value),
                          'DMPNumTickets',
                          index,
                          'customPrice',
                        )
                      }
                    />
                  </div>

                  <div className="text-primary-input-text font-bold mr-2">{currency}</div>

                  <TextInput
                    testId={`DMPTicketPriceCustomPrice${index}Text`}
                    className="w-auto"
                    onChange={(value) =>
                      editDealMemoPrice(
                        'DMPTicketPrice',
                        filterCurrencyNum(parseFloat(value.target.value)),
                        'DMPTicketPrice',
                        index,
                        'customPrice',
                      )
                    }
                    value={dealMemoCustomPriceFormData[index].DMPTicketPrice}
                  />
                  <div className="w-[38vw] ml-8 flex items-center">
                    <div className="w-[38vw]">
                      <TextInput
                        testId={`DMPNotesCustomPrice${index}Text`}
                        value={dealMemoCustomPriceFormData[index].DMPNotes}
                        onChange={(value) =>
                          editDealMemoPrice('DMPNotes', value.target.value, 'DMPNotes', index, 'customPrice')
                        }
                      />
                    </div>
                    {/* <Icon
                      iconName="minus-circle-solid"
                      className="mr-8"
                      onClick={() => handleCustomPrice(false, index)}
                      variant="lg"
                    /> */}
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
        <div className="flex items-center mt-2">
          <div className="w-1/5">
            <TextInput
              testId="ticketNameText"
              className="w-auto"
              value={dealMemoCustomPriceFormData[0] ? dealMemoCustomPriceFormData[0].DMPTicketName : ''}
              onChange={(value) =>
                editDealMemoPrice('DMPTicketName', value.target.value, 'DMPTicketName', 0, 'customPrice')
              }
            />
          </div>
          <div className="w-4/5 flex">
            <div className="w-1/5">
              <TextInput
                testId="numTicketsText"
                className="w-auto"
                value={dealMemoCustomPriceFormData[0] ? dealMemoCustomPriceFormData[0].DMPNumTickets : null}
                onChange={(value) =>
                  editDealMemoPrice('DMPNumTickets', parseFloat(value.target.value), 'DMPNumTickets', 0, 'customPrice')
                }
              />
            </div>

            <div className="text-primary-input-text font-bold mr-2">{currency}</div>

            <TextInput
              testId="ticketPriceText"
              className="w-auto"
              onChange={(value) =>
                editDealMemoPrice('DMPTicketPrice', parseFloat(value.target.value), 'DMPTicketPrice', 0, 'customPrice')
              }
              value={dealMemoCustomPriceFormData[0] ? dealMemoCustomPriceFormData[0].DMPTicketPrice : null}
            />
            <div className="w-[38vw] ml-8 flex items-center">
              <div className="w-[38vw]">
                <TextInput
                  testId="dmpNotesText"
                  className="w-[480px]"
                  value={dealMemoCustomPriceFormData[0] ? dealMemoCustomPriceFormData[0].DMPNotes : ''}
                  onChange={(value) => editDealMemoPrice('DMPNotes', value.target.value, 'DMPNotes', 0, 'customPrice')}
                />
              </div>
              <Icon
                iconName="plus-circle-solid"
                className={`${dealMemoCustomPriceFormData.length > 1 ? 'mr-2' : 'mr-8'} ml-1`}
                onClick={() => handleCustomPrice(true, 0)}
                variant="lg"
              />
              {dealMemoCustomPriceFormData.length > 1 && (
                <Icon
                  iconName="minus-circle-solid"
                  className="mr-1"
                  onClick={() => handleCustomPrice(false, 0)}
                  variant="lg"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">
            Restoration Levy<div>{`(per ticket)`}</div>
          </div>
          <div className="w-4/5 flex items-center">
            <div className="text-primary-input-text font-bold mr-2">{currency}</div>

            <TextInput
              testId="levyText"
              className="w-auto"
              type="number"
              value={formData.RestorationLevy}
              onChange={(value) => editDemoModalData('RestorationLevy', parseFloat(value.target.value), 'dealMemo')}
            />
            <div className="text-primary-input-text font-bold ml-16 flex">
              Booking fees <div className="ml-4 mr-2">{currency}</div>
            </div>
            <TextInput
              testId="bookingFeesText"
              className="w-auto"
              type="number"
              value={formData.BookingFees}
              onChange={(value) => editDemoModalData('BookingFees', parseFloat(value.target.value), 'dealMemo')}
            />
            <div className="text-primary-input-text font-bold ml-14 mr-2">Credit Card Commission</div>
            <TextInput
              testId="creditCardText"
              className="w-auto"
              type="number"
              value={formData.CCCommissionPercent}
              onChange={(value) =>
                editDemoModalData('CCCommissionPercent', filterPercentage(parseFloat(value.target.value)), 'dealMemo')
              }
            />
            <div className="text-primary-input-text font-bold ml-2">%</div>
          </div>
        </div>
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
            />
            <div className="text-primary-input-text font-bold ml-20 mr-2">{currency}</div>
            <TextInput
              testId="chargesText"
              className="w-auto"
              type="number"
              value={formData.TxnChargeAmount}
              onChange={(value) => editDemoModalData('TxnChargeAmount', parseFloat(value.target.value), 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Agreed Discounts</div>
          <div className="w-4/5 flex">
            <div className="w-full">
              <TextInput
                testId="disocuntsText"
                className="w-full"
                value={formData.AgreedDiscounts}
                onChange={(value) => editDemoModalData('AgreedDiscounts', value.target.value, 'dealMemo')}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex text-primary-input-text -mb-1">
            No other discounts without written agreement from{' '}
            {`${productionJumpState.ProductionCompany ? productionJumpState.ProductionCompany.ProdCoName : ''}`}
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
                  testId={`${inputData[0]}Text`}
                  className="w-full"
                  value={formData[inputData[1]]}
                  onChange={(value) =>
                    editDemoModalData(
                      inputData[1],
                      inputData[1] === 'ProducerCompCount' ? parseFloat(value.target.value) : value.target.value,
                      'dealMemo',
                    )
                  }
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
              testId="ageLimitText"
              className="w-full"
              value={formData.AgeNotes}
              onChange={(value) => editDemoModalData('AgeNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Sales Report Frequency</div>
          <div className="w-4/5 flex items-center">
            <TextInput
              testId="repFreqText"
              className="w-[20vw]"
              value={productionJumpState.SalesFrequency === 'W' ? 'Weekly' : 'Daily'}
            />
            <div className=" text-primary-input-text font-bold ml-20 mr-4">If Weekly, on</div>
            <Select
              onChange={(value) => editDemoModalData('SalesDayNum', value, 'dealMemo')}
              className="bg-primary-white w-[32vw]"
              placeholder="Sales Frequency"
              options={saleFrequencyDay}
              isClearable
              isSearchable
              disabled={productionJumpState.SalesFrequency !== 'W'}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">to be sent to</div>
          <div className="w-4/5">
            <TextInput testId="sentToText" className="w-full" placeholder="Add to Production Details" disabled />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex">
            <Select
              onChange={(value) => setSendToData(value)}
              isMulti
              className="bg-primary-white w-full"
              placeholder="Please select assignee..."
              options={[{ text: 'Select All', value: 'select_all' }, ...userList]}
              isClearable
              isSearchable
              renderOption={(option) => <CustomOption option={option} isMulti={true} />}
              value={sendTo}
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
              options={[{ text: 'Select Assignee', value: null }, ...venueUserList]}
              className="bg-primary-white w-full"
              placeholder="Please select..."
              isClearable
              isSearchable
              value={formData.MMVenueContactId}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
          <div className="w-4/5">
            <TextInput
              testId="marketingPhoneText"
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
              testId="marketingEmailText"
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
            />
            <div className="text-primary-input-text font-bold ml-20 mr-4">Final Proof by</div>

            <DateInput
              onChange={(value) => {
                editDemoModalData('FinalProofBy', value, 'dealMemo');
              }}
              value={formData.FinalProofBy}
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
                onChange={(value) => editDemoModalData('PrintDelUseVenueAddress', value.target.value, 'dealMemo')}
                checked={formData.PrintDelUseVenueAddress}
                label="Same as Venue Address"
              />
            </div>

            <div className="w-3/4">
              <TextInput
                testId="printDeliveryText"
                className="w-3/4"
                disabled={formData.PrintDelUseVenueAddress}
                value={formData.PrintDelUseVenueAddress ? '' : formData.PrintDelUseVenueAddressline}
                onChange={(value) => editDemoModalData('PrintDelUseVenueAddressline', value.target.value, 'dealMemo')}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Local Marketing Budget</div>
          <div className="w-4/5 flex">
            <div className="text-primary-input-text font-bold mr-2">{currency}</div>

            <TextInput
              testId="localMarketingText"
              className="w-auto"
              type="number"
              value={formData.LocalMarketingBudget}
              onChange={(value) =>
                editDemoModalData('LocalMarketingBudget', filterCurrencyNum(parseFloat(value.target.value)), 'dealMemo')
              }
            />
            <div className="text-primary-input-text font-bold ml-28">Local Marketing Contra </div>
            <div className="text-primary-input-text font-bold ml-20 -mr-12" />
            <div className="text-primary-input-text font-bold mr-2">{currency}</div>

            <TextInput
              testId="localMarketingText"
              className="w-auto"
              type="number"
              value={formData.LocalMarketingContra}
              onChange={(value) =>
                editDemoModalData('LocalMarketingContra', filterCurrencyNum(parseFloat(value.target.value)), 'dealMemo')
              }
            />
          </div>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex text-primary-input-text text-sm">
            Any expenditure needs pre-approval from{' '}
            {`${productionJumpState.ProductionCompany ? productionJumpState.ProductionCompany.ProdCoName : ''}`}
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
              isClearable
              isSearchable
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
              onChange={(value) => editDemoModalData('SellProgrammes', value.target.value, 'dealMemo')}
              checked={formData.SellProgrammes}
              label="Programmes"
            />

            <Checkbox
              className="ml-2"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              onChange={(value) => editDemoModalData('SellMerch', value.target.value, 'dealMemo')}
              checked={formData.SellMerch}
              label="Merchandise"
            />

            <TextArea
              className="w-[48vw] ml-2"
              value={formData.SellNotes}
              onChange={(value) => editDemoModalData('SellNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Venue Commission</div>
          <div className="w-4/5 flex text-primary-input-text font-bold items-center">
            <div className="mr-4">Programmes</div>
            <TextInput
              testId="venueCommissionText"
              className="w-[150px]"
              type="number"
              value={formData.SellProgCommPercent}
              onChange={(value) =>
                editDemoModalData('SellProgCommPercent', filterPercentage(parseFloat(value.target.value)), 'dealMemo')
              }
            />
            <div className="ml-2">%</div>
            <div className="mr-2 ml-16">Merchandise</div>
            <TextInput
              testId="merchText"
              className="w-[150px]"
              type="number"
              value={formData.SellMerchCommPercent}
              onChange={(value) =>
                editDemoModalData('SellMerchCommPercent', filterPercentage(parseFloat(value.target.value)), 'dealMemo')
              }
            />
            <div className="ml-2">%</div>
            <div className="ml-14">Fixed Pitch Fee</div>
            <div className="ml-2 mr-2">{currency}</div>

            <TextInput
              testId="fixedPitchText"
              className="w-[150px]"
              type="number"
              value={formData.SellPitchFee}
              onChange={(value) =>
                editDemoModalData('SellPitchFee', filterCurrencyNum(parseFloat(value.target.value)), 'dealMemo')
              }
            />
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Technical</div>
        <div className="flex items-center">
          <div className="w-1/5 text-primary-input-text font-bold">Technical Manager</div>
          <div className="w-4/5 flex">
            <Select
              onChange={(value) => editDemoModalData('TechVenueContactId', value, 'dealMemo')}
              options={[{ text: 'Select Assignee', value: null }, ...venueUserList]}
              className="bg-primary-white w-full"
              placeholder="Please select..."
              isClearable
              isSearchable
              value={formData.TechVenueContactId}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
          <div className="w-4/5">
            <TextInput
              testId="techPhoneText"
              className="w-full text-primary-input-text font-bold"
              placeholder={
                venueUserData[formData.TechVenueContactId]
                  ? 'Add details to Venue Database'
                  : 'Please select from the dropdown above'
              }
              value={venueUserData[formData.TechVenueContactId] ? venueUserData[formData.TechVenueContactId].Phone : ''}
              disabled
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Email</div>
          <div className="w-4/5">
            <TextInput
              testId="techEmailText"
              className="w-full text-primary-input-text font-bold"
              placeholder={
                venueUserData[formData.TechVenueContactId]
                  ? 'Add details to Venue Database'
                  : 'Please select from the dropdown above'
              }
              value={venueUserData[formData.TechVenueContactId] ? venueUserData[formData.TechVenueContactId].Email : ''}
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
            />
            <div className="ml-4 w-[100px]">
              <TimeInput
                className="w-fit h-[31px] [&>input]:!h-[25px] [&>input]:!w-11 !justify-center shadow-input-shadow ml-2"
                value={formData && formData.TechArrivalTime ? dateToTimeString(formData.TechArrivalTime) : null}
                disabled={disableDate}
                onChange={(value) =>
                  editDemoModalData('TechArrivalTime', convertTimeToTodayDateFormat(value), 'dealMemo')
                }
                tabIndexShow={true}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Stage Door What3Words</div>
          <div className="w-4/5 flex items-center">
            <TextInput
              testId="stageDoorText"
              className="w-[25vw] text-primary-input-text font-bold"
              disabled
              placeholder={venueData.AddressStageDoorW3W ? '' : 'Add details to Venue Database'}
              value={venueData ? venueData.AddressStageDoorW3W : null}
            />
            <div className="w-1/5 text-primary-input-text font-bold ml-8">Loading Bay What3Words</div>

            <TextInput
              testId="loadingBayText"
              className="w-[25vw] text-primary-input-text font-bold"
              disabled
              placeholder={venueData.AddressLoadingW3W ? '' : 'Add details to Venue Database'}
              value={venueData ? venueData.AddressLoadingW3W : null}
            />
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
                    testId="techNameText"
                    className="w-full"
                    value={inputData.DMTechVenue}
                    onChange={(value) =>
                      editTechProvisionModalData('DMTechVenue', value.target.value, inputData.DMTechName)
                    }
                  />
                </div>
                <div className="w-2/4 ml-2">
                  <TextInput
                    testId="techCompanyText"
                    className="w-full"
                    value={inputData.DMTechCompany}
                    onChange={(value) =>
                      editTechProvisionModalData('DMTechCompany', value.target.value, inputData.DMTechName)
                    }
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
                testId="dressingRoomText"
                className="w-full"
                value={formData.DressingRooms}
                onChange={(value) => editDemoModalData('DressingRooms', value.target.value, 'dealMemo')}
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
              onChange={(value) => editDemoModalData('NumFacilitiesLaundry', value.target.value, 'dealMemo')}
              checked={formData.NumFacilitiesLaundry}
            />
            <div className="text-primary-input-text font-bold mr-2 ml-6">Dryer</div>

            <Checkbox
              className="flex flex-row-reverse mr-2"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              onChange={(value) => editDemoModalData('NumFacilitiesDrier', value.target.value, 'dealMemo')}
              checked={formData.NumFacilitiesDrier}
            />
            <div className="text-primary-input-text font-bold mr-2 ml-6">Laundry Room</div>

            <Checkbox
              className="flex flex-row-reverse mr-2"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              onChange={(value) => editDemoModalData('NumFacilitiesLaundryRoom', value.target.value, 'dealMemo')}
              checked={formData.NumFacilitiesLaundryRoom}
            />
            <div className="w-3/5 ml-8">
              <TextInput
                testId="laundryText"
                className="w-full"
                value={formData.NumFacilitiesNotes}
                onChange={(value) => editDemoModalData('NumFacilitiesNotes', value.target.value, 'dealMemo')}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Catering</div>
          <div className="w-4/5 flex">
            <div className="w-full">
              <TextInput
                testId="cateringText"
                className="w-full"
                value={formData.NumCateringNotes}
                onChange={(value) => editDemoModalData('NumCateringNotes', value.target.value, 'dealMemo')}
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
                testId="baringClauseText"
                className="w-full"
                value={formData.BarringClause}
                onChange={(value) => editDemoModalData('BarringClause', value.target.value, 'dealMemo')}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Advance Payment</div>
          <div className="w-4/5 flex items-center">
            <Select
              onChange={(value) => {
                editDemoModalData('AdvancePaymentRequired', value, 'dealMemo');
              }}
              className="bg-primary-white w-40"
              placeholder="Please select..."
              options={booleanOptions}
              isClearable
              isSearchable
              value={formData.AdvancePaymentRequired}
            />
            <div className=" text-primary-input-text font-bold ml-20">
              If Yes, Amount<span className="ml-2 mr-2">{currency}</span>
            </div>

            <TextInput
              testId="yesAmountText"
              className="w-full"
              type="number"
              value={formData.AdvancePaymentAmount}
              onChange={(value) =>
                editDemoModalData('AdvancePaymentAmount', filterCurrencyNum(parseFloat(value.target.value)), 'dealMemo')
              }
              disabled={!formData.AdvancePaymentRequired}
            />
            <div className=" text-primary-input-text font-bold ml-20 mr-2"> Date Payment to be Made</div>

            <DateInput
              onChange={(value) => {
                editDemoModalData('AdvancePaymentDueBy', value, 'dealMemo');
              }}
              value={formData.AdvancePaymentDueBy}
              disabled={!formData.AdvancePaymentRequired}
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
              onChange={(value) => setContractCheckBox(value.target.value)}
              checked={contractCheckBox}
            />
            <div className=" text-primary-input-text font-bold ml-4 mr-2">or within</div>

            <TextInput
              testId="withinText"
              className="w-full"
              value={formData.SettlementDays}
              onChange={(value) => editDemoModalData('SettlementDays', parseFloat(value.target.value), 'dealMemo')}
              disabled={contractCheckBox}
            />

            <div className=" text-primary-input-text font-bold ml-2">days</div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">
            {productionJumpState.ProductionCompany ? productionJumpState.ProductionCompany.ProdCoName : ''} VAT No.
          </div>
          <div className="w-4/5 flex">
            <div className="w-full">
              <TextInput
                testId="vatText"
                className="w-full"
                value={productionJumpState.ProductionCompany ? productionJumpState.ProductionCompany.ProdCoVATCode : ''}
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
            />
          </div>
        </div>
      </div>
      <div className="w-full mt-4 flex justify-end items-center">
        <Button onClick={() => handleCancelForm(false)} className="w-33" variant="secondary" text="Cancel" />
        <Button
          onClick={() => null}
          className="ml-4 w-28"
          variant="primary"
          text="Export"
          iconProps={{ className: 'h-4 w-3' }}
          sufixIconName="excel"
        />

        <Button onClick={() => saveDemoModalData()} className="ml-4 w-33" variant="primary" text="Save and Close" />
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
  );
};

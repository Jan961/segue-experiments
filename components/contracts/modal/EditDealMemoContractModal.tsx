import PopupModal from 'components/core-ui-lib/PopupModal';
import classNames from 'classnames';
import Select from 'components/core-ui-lib/Select';
import TextInput from 'components/core-ui-lib/TextInput';
import DateInput from 'components/core-ui-lib/DateInput';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Button from 'components/core-ui-lib/Button';
import {
  ContactDemoFormAccountData,
  ContactDemoFormData,
  ContactsFormData,
  DealMemoContractFormData,
  DealMemoHoldType,
  ProductionDTO,
} from 'interfaces';
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
} from '../utils';
import { DealMemoHold, DealMemoTechProvision } from '@prisma/client';
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
  const [contactsFormData, setContactsFormData] = useState<ContactDemoFormAccountData>({});
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
    console.log('dealHoldType, demoModalData.DealMemoHold', dealHoldType, demoModalData.DealMemoHold, holdTypeData);

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

  const [contactsData, setContactsData] = useState<ContactDemoFormData>({ phone: '', email: '' });
  const { users } = useRecoilValue(userState);
  const userList = useMemo(
    () =>
      Object.values(users).map(({ Id, FirstName = '', LastName = '', Email = '' }) => ({
        value: Id,
        text: `${FirstName || ''} ${LastName || ''} | ${Email || ''}`,
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

  const handleContactsSection = async (value, key) => {
    const updatedFormData = {
      ...contactsFormData,
      [key]: value,
    };
    setIsLoading(true);
    setContactsFormData({ ...updatedFormData });
    setContactsData({ email: '', phone: '' });
    if (value) {
      try {
        const userData = (await axios.get(
          `/api/dealMemo/getContacts/${selectedTableCell.contract.Id}/${value}`,
        )) as ContactsFormData;
        if (userData.data !== null) {
          const data = {
            email: userData.data?.Email,
            phone: userData.data?.AccountUser.Account.AccountContact.AccContPhone,
          };
          setContactsData(data);
        }
      } catch (error) {
        console.error(error);
      }
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
        DMPDeMoId: formData.DeMoId,
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
    callData[index]['DMCDeMoId'] = demoModalData.DeMoId;
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
    setSendTo((prevState) => [...prevState, ...value]);
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
                editDemoModalData('DeMoDateIssued', value, 'dealMemo');
              }}
              value={formData.DeMoDateIssued}
            />
          </div>
        </div>
        <div className="text-primary-input-text mt-4">
          Please read this carefully to ensure it reflects the terms as agreed between{' '}
          {`${productionJumpState.ProductionCompany.Name}`} and {`${selectedTableCell.contract.venue}`}.
          <br />
          Please note that any terms not specifically mentioned here are still to be negotiated. If you have any
          standard conditions that you consider to be non-negotiable, or if you{' '}
          <span className="flex">
            have any queries about the Deal Memo, please contact{' '}
            <Select
              onChange={(value) => {
                editDemoModalData('DeMoAccContId', value, 'dealMemo');
              }}
              className="bg-primary-white w-3/12 ml-2 mr-2"
              placeholder="Please select..."
              options={[{ text: 'Select Assignee', value: null }, ...userList]}
              isClearable
              isSearchable
              value={formData.DeMoAccContId}
            />
            ASAP
          </span>
        </div>
        <div className="text-primary-input-text mt-4">
          If we have requested anything that incurs a cost, it must be agreed with {`Jendagi Productions Limited`} prior
          to our arrival. No extras will be paid without a pre-authorisation
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
                handleContactsSection(value, 'companyContact');
              }}
              className="bg-primary-white wfull"
              placeholder="Please select..."
              options={[{ text: 'Select Assignee', value: null }, ...userList]}
              isClearable
              isSearchable
              value={contactsFormData.companyContact}
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
              {selectedTableCell.contract.performanceTimes &&
                selectedTableCell.contract.performanceTimes
                  .split(';')
                  .map((times) => (
                    <TextInput
                      key={times}
                      testId="performanceDate"
                      className="w-[350px] mt-1 mb-1 text-primary-input-text font-bold"
                      disabled
                      value={`${getShortWeekFormat(times.split('?')[1])} ${formattedDateWithDay(
                        times.split('?')[1],
                      )} : ${times.split('?')[0]}`}
                    />
                  ))}
              {!selectedTableCell.contract.performanceTimes && (
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
              disabled={disableDate}
              onChange={() => {
                return null;
              }}
              tabIndexShow={true}
            />
            <div className=" text-primary-input-text font-bold ml-8 mr-4">Notes</div>

            <TextInput testId="runningNote" className="w-[51vw]" value={productionJumpState.RunningTimeNote} disabled />
          </div>
        </div>
        <div className="flex mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Pre / Post Show Events</div>
          <div className="w-4/5 flex">
            <div className="w-[65vw]">
              <TextArea
                testId="prePostShow"
                className="w-full h-auto"
                value={formData.DeMoPrePostShowEvents}
                onChange={(value) => editDemoModalData('DeMoPrePostShowEvents', value.target.value, 'dealMemo')}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Off-Stage Venue Curfew Time</div>
          <div className="w-4/5 flex items-center">
            <TimeInput
              className="w-fit h-[31px] [&>input]:!h-[25px] [&>input]:!w-11 !justify-center shadow-input-shadow"
              value={formData && formData.DeMoVenueCurfewTime ? dateToTimeString(formData.DeMoVenueCurfewTime) : null}
              disabled={disableDate}
              onChange={(value) =>
                editDemoModalData('DeMoVenueCurfewTime', convertTimeToTodayDateFormat(value), 'dealMemo')
              }
              tabIndexShow={true}
            />
            {/* <TextInput placeholder="hh:mm" testId="venueText" className="w-[80px] mt-1 mb-1" /> */}
            <div className=" text-primary-input-text font-bold ml-8 mr-4">Notes</div>

            <TextInput
              testId="notes"
              className="w-[51vw]"
              value={formData.DeMoRunningTimeNotes}
              onChange={(value) => editDemoModalData('DeMoRunningTimeNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Venue</div>
        {[
          ['Venue Name', 'Name'],
          ['Phone', 'Phone'],
          ['Email', 'Email'],
          ['Address', 'AddressLoadingW3W'],
        ].map((input) => {
          return (
            <div key={input[0]} className="flex items-center mb-2">
              <div className="w-1/5 text-primary-input-text font-bold">{input[0]}</div>
              <div className="w-4/5">
                <TextInput
                  testId={`venue-${input[1]}`}
                  className="w-full text-primary-input-text font-bold"
                  value={venueData ? venueData[input[1]] : ''}
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
              onChange={(value) => editDemoModalData('DeMoProgrammerVenueContactId', value, 'dealMemo')}
              options={[{ text: 'Select Assignee', value: null }, ...venueUserList]}
              className="bg-primary-white w-full"
              placeholder="Please select..."
              isClearable
              isSearchable
              value={formData.DeMoProgrammerVenueContactId}
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
                venueUserData[formData.DeMoProgrammerVenueContactId]
                  ? 'Add details to Venue Database'
                  : 'Please select from the dropdown above'
              }
              value={
                venueUserData[formData.DeMoProgrammerVenueContactId]
                  ? venueUserData[formData.DeMoProgrammerVenueContactId].Phone
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
                venueUserData[formData.DeMoProgrammerVenueContactId]
                  ? 'Add details to Venue Database'
                  : 'Please select from the dropdown above'
              }
              value={
                venueUserData[formData.DeMoProgrammerVenueContactId]
                  ? venueUserData[formData.DeMoProgrammerVenueContactId].Email
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
              value={formData.DeMoROTTPercentage}
              type="number"
              onChange={(value) =>
                editDemoModalData('DeMoROTTPercentage', filterPercentage(parseFloat(value.target.value)), 'dealMemo')
              }
            />{' '}
            <div className=" text-primary-input-text font-bold ml-2">%</div>
            <div className=" text-primary-input-text font-bold ml-12 mr-4">PRS</div>
            <TextInput
              testId="prsText"
              className="w-[100px]"
              value={formData.DeMoPRSPercentage}
              type="number"
              onChange={(value) =>
                editDemoModalData('DeMoPRSPercentage', filterPercentage(parseFloat(value.target.value)), 'dealMemo')
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
                editDemoModalData('DeMoGuarantee', value === 1, 'dealMemo');
              }}
              className="bg-primary-white w-26 mr-3"
              placeholder="Please select.."
              options={booleanOptions}
              isClearable
              isSearchable
              value={formData.DeMoGuarantee}
            />
            <div className="text-primary-input-text font-bold ml-14 mr-5">{VENUE_CURRENCY_SYMBOLS.POUND}</div>

            <TextInput
              testId="guarnteeText"
              className="w-[140px] ml-1"
              type="number"
              value={formData.DeMoGuaranteeAmount}
              onChange={(value) =>
                editDemoModalData('DeMoGuaranteeAmount', filterCurrencyNum(parseFloat(value.target.value)), 'dealMemo')
              }
              placeholder="00.00"
              disabled={!formData.DeMoGuarantee}
            />
          </div>
        </div>
        <div className="flex  mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Calls</div>
          <div className="w-4/5 flex ">
            <Select
              onChange={(value) => {
                editDemoModalData('DeMoHasCalls', value === 1, 'dealMemo');
              }}
              className="bg-primary-white w-26 mr-1 h-8"
              placeholder="Please select.."
              options={booleanOptions}
              isClearable
              isSearchable
              value={formData.DeMoHasCalls}
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
                      disabled={!formData.DeMoHasCalls}
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
                      disabled={!formData.DeMoHasCalls}
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
                      disabled={!formData.DeMoHasCalls}
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
                          onClick={() => formData.DeMoHasCalls && handleCall(true, index)}
                          variant="lg"
                        />
                      )}

                      {index === dealCall.length - 1 && index > 0 && (
                        <Icon
                          className="ml-2"
                          iconName="minus-circle-solid"
                          onClick={() => formData.DeMoHasCalls && handleCall(false, index)}
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
              value={formData.DeMoPromoterSplitPercentage}
              onChange={(value) =>
                editDemoModalData(
                  'DeMoPromoterSplitPercentage',
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
              value={formData.DeMoVenueSplitPercentage}
              onChange={(value) =>
                editDemoModalData(
                  'DeMoVenueSplitPercentage',
                  filterPercentage(parseFloat(value.target.value)),
                  'dealMemo',
                )
              }
            />
            <div className="text-primary-input-text font-bold ml-2 mr-2">%</div>
          </div>
        </div>
        {[
          ['Venue Rental', 'DeMoVenueRental', 'DeMoVenueRentalNotes'],
          ['Staffing Contra', 'DeMoStaffingContra', 'DeMoStaffingContraNotes'],
          ['Agreed Contra Items', 'DeMoAgreedContraItems', 'DeMoAgreedContraItemsNotes'],
        ].map((inputData) => {
          return (
            <div key={inputData[0]} className="flex items-center mt-4">
              <div className="w-1/5 text-primary-input-text font-bold">{inputData[0]}</div>
              <div className="w-4/5 flex items-center">
                <div className="text-primary-input-text font-bold  mr-4">{VENUE_CURRENCY_SYMBOLS.POUND}</div>

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
              onChange={(value) => editDemoModalData('DeMoBOMVenueContactId', value, 'dealMemo')}
              className="bg-primary-white w-full"
              placeholder="Please select..."
              options={venueUserList}
              isClearable
              isSearchable
              value={formData.DeMoBOMVenueContactId}
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
                venueUserData[formData.DeMoBOMVenueContactId]
                  ? 'Add details to Venue Database'
                  : 'Please select from the dropdown above'
              }
              disabled
              value={
                venueUserData[formData.DeMoBOMVenueContactId] ? venueUserData[formData.DeMoBOMVenueContactId].Phone : ''
              }
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
                venueUserData[formData.DeMoBOMVenueContactId]
                  ? 'Add details to Venue Database'
                  : 'Please select from the dropdown above'
              }
              disabled
              value={
                venueUserData[formData.DeMoBOMVenueContactId] ? venueUserData[formData.DeMoBOMVenueContactId].Email : ''
              }
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Onsale Date</div>
          <div className="w-4/5 flex">
            <DateInput
              onChange={(value) => {
                editDemoModalData('DeMoOnSaleDate', value, 'dealMemo');
              }}
              value={formData.DeMoOnSaleDate}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Accounts Contact for Settlement</div>
          <div className="w-4/5 flex">
            <Select
              onChange={(value) => editDemoModalData('DeMoSettlementVenueContactId', value, 'dealMemo')}
              className="bg-primary-white w-full"
              placeholder="Please select..."
              options={venueUserList}
              isClearable
              isSearchable
              value={formData.DeMoSettlementVenueContactId}
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
                venueUserData[formData.DeMoSettlementVenueContactId]
                  ? 'Add details to Venue Database'
                  : 'Please select from the dropdown above'
              }
              value={
                venueUserData[formData.DeMoSettlementVenueContactId]
                  ? venueUserData[formData.DeMoSettlementVenueContactId].Phone
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
                venueUserData[formData.DeMoSettlementVenueContactId]
                  ? 'Add details to Venue Database'
                  : 'Please select from the dropdown above'
              }
              value={
                venueUserData[formData.DeMoSettlementVenueContactId]
                  ? venueUserData[formData.DeMoSettlementVenueContactId].Email
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
              value={formData.DeMoSellableSeats}
              onChange={(value) => editDemoModalData('DeMoSellableSeats', parseFloat(value.target.value), 'dealMemo')}
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
                value={formData.DeMoOtherHolds}
                placeholder="Notes Field"
                onChange={(value) => editDemoModalData('DeMoOtherHolds', value.target.value, 'dealMemo')}
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

                <div className="text-primary-input-text font-bold mr-2">{VENUE_CURRENCY_SYMBOLS.POUND}</div>

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

                  <div className="text-primary-input-text font-bold mr-2">{VENUE_CURRENCY_SYMBOLS.POUND}</div>

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

            <div className="text-primary-input-text font-bold mr-2">{VENUE_CURRENCY_SYMBOLS.POUND}</div>

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
            <div className="text-primary-input-text font-bold mr-2">{VENUE_CURRENCY_SYMBOLS.POUND}</div>

            <TextInput
              testId="levyText"
              className="w-auto"
              type="number"
              value={formData.DeMoRestorationLevy}
              onChange={(value) => editDemoModalData('DeMoRestorationLevy', parseFloat(value.target.value), 'dealMemo')}
            />
            <div className="text-primary-input-text font-bold ml-16 flex">
              Booking fees <div className="ml-4 mr-2">{VENUE_CURRENCY_SYMBOLS.POUND}</div>
            </div>
            <TextInput
              testId="bookingFeesText"
              className="w-auto"
              type="number"
              value={formData.DeMoBookingFees}
              onChange={(value) => editDemoModalData('DeMoBookingFees', parseFloat(value.target.value), 'dealMemo')}
            />
            <div className="text-primary-input-text font-bold ml-14 mr-2">Credit Card Commission</div>
            <TextInput
              testId="creditCardText"
              className="w-auto"
              type="number"
              value={formData.DeMoCCCommissionPercent}
              onChange={(value) =>
                editDemoModalData(
                  'DeMoCCCommissionPercent',
                  filterPercentage(parseFloat(value.target.value)),
                  'dealMemo',
                )
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
                editDemoModalData('DeMoTxnChargeOption', value, 'dealMemo');
              }}
              className="bg-primary-white w-2/5"
              placeholder="Please select..."
              options={transactionOptions}
              isClearable
              isSearchable
              value={formData.DeMoTxnChargeOption}
            />
            <div className="text-primary-input-text font-bold ml-20 mr-2">{VENUE_CURRENCY_SYMBOLS.POUND}</div>
            <TextInput
              testId="chargesText"
              className="w-auto"
              type="number"
              value={formData.DeMoTxnChargeAmount}
              onChange={(value) => editDemoModalData('DeMoTxnChargeAmount', parseFloat(value.target.value), 'dealMemo')}
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
                value={formData.DeMoAgreedDiscounts}
                onChange={(value) => editDemoModalData('DeMoAgreedDiscounts', value.target.value, 'dealMemo')}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex text-primary-input-text -mb-1">
            No other discounts without written agreement from {`${productionJumpState.ProductionCompany.Name}`}
          </div>
        </div>
        {[
          ['Maximum Ticket Agency Allocations', 'DeMoMaxTAAlloc'],
          ['Ticket Agency Allocations', 'DeMoTAAlloc'],
          ['Ticket Copy', 'DeMoTicketCopy'],
          ['Producer Complimentary  Tickets  Per  Performance', 'DeMoProducerCompCount'],
          ['Other Tickets to be held off sale?', 'DeMoOtherHolds'],
        ].map((inputData) => {
          return (
            <div key={inputData[1]} className="flex items-center mt-2">
              <div className="w-1/5 text-primary-input-text font-bold">
                {inputData[1] !== 'DeMoProducerCompCount' ? (
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
                      inputData[1] === 'DeMoProducerCompCount' ? parseFloat(value.target.value) : value.target.value,
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
              value={formData.DeMoAgeNotes}
              onChange={(value) => editDemoModalData('DeMoAgeNotes', value.target.value, 'dealMemo')}
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
              onChange={(value) => editDemoModalData('DeMoSalesDayNum', value, 'dealMemo')}
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
              onChange={(value) => {
                setSendToData(value);
              }}
              isMulti
              className="bg-primary-white w-full"
              placeholder="Please select..."
              options={[{ text: 'Select Assignee', value: null }, ...userList]}
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
              onChange={(value) => editDemoModalData('DeMoMMVenueContactId', value, 'dealMemo')}
              options={[{ text: 'Select Assignee', value: null }, ...venueUserList]}
              className="bg-primary-white w-full"
              placeholder="Please select..."
              isClearable
              isSearchable
              value={formData.DeMoMMVenueContactId}
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
                venueUserData[formData.DeMoMMVenueContactId]
                  ? 'Add details to Venue Database'
                  : 'Please select from the dropdown above'
              }
              value={
                venueUserData[formData.DeMoMMVenueContactId] ? venueUserData[formData.DeMoMMVenueContactId].Phone : ''
              }
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
                venueUserData[formData.DeMoMMVenueContactId]
                  ? 'Add details to Venue Database'
                  : 'Please select from the dropdown above'
              }
              value={
                venueUserData[formData.DeMoMMVenueContactId] ? venueUserData[formData.DeMoMMVenueContactId].Email : ''
              }
              disabled
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Brochure Deadline</div>
          <div className="w-4/5 flex items-center">
            <DateInput
              onChange={(value) => {
                editDemoModalData('DeMoBrochureDeadline', value, 'dealMemo');
              }}
              value={formData.DeMoBrochureDeadline}
            />
            <div className="text-primary-input-text font-bold ml-20 mr-4">Final Proof by</div>

            <DateInput
              onChange={(value) => {
                editDemoModalData('DeMoFinalProofBy', value, 'dealMemo');
              }}
              value={formData.DeMoFinalProofBy}
            />
          </div>
        </div>
        <div className="flex mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Print Requirements</div>
          <div className="w-4/5">
            <TextArea
              className=" w-full h-auto"
              value={formData.DeMoPrintReqs}
              onChange={(value) => editDemoModalData('DeMoPrintReqs', value.target.value, 'dealMemo')}
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
                onChange={(value) => editDemoModalData('DeMoPrintDelUseVenueAddress', value.target.value, 'dealMemo')}
                checked={formData.DeMoPrintDelUseVenueAddress}
                label="Same as Venue Address"
              />
            </div>

            <div className="w-3/4">
              <TextInput
                testId="printDeliveryText"
                className="w-3/4"
                disabled={formData.DeMoPrintDelUseVenueAddress}
                value={formData.DeMoVatCode}
                onChange={(value) => editDemoModalData('DeMoVatCode', value.target.value, 'dealMemo')}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Local Marketing Budget</div>
          <div className="w-4/5 flex">
            <div className="text-primary-input-text font-bold mr-2">{VENUE_CURRENCY_SYMBOLS.POUND}</div>

            <TextInput
              testId="localMarketingText"
              className="w-auto"
              type="number"
              value={formData.DeMoLocalMarketingBudget}
              onChange={(value) =>
                editDemoModalData(
                  'DeMoLocalMarketingBudget',
                  filterCurrencyNum(parseFloat(value.target.value)),
                  'dealMemo',
                )
              }
            />
            <div className="text-primary-input-text font-bold ml-28">Local Marketing Contra </div>
            <div className="text-primary-input-text font-bold ml-20 -mr-12" />
            <div className="text-primary-input-text font-bold mr-2">{VENUE_CURRENCY_SYMBOLS.POUND}</div>

            <TextInput
              testId="localMarketingText"
              className="w-auto"
              type="number"
              value={formData.DeMoLocalMarketingContra}
              onChange={(value) =>
                editDemoModalData(
                  'DeMoLocalMarketingContra',
                  filterCurrencyNum(parseFloat(value.target.value)),
                  'dealMemo',
                )
              }
            />
          </div>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex text-primary-input-text text-sm">
            Any expenditure needs pre-approval from {`${productionJumpState.ProductionCompany.Name}`}
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-2 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Programmes and Merchandise</div>
        <div className="flex items-center mt-2">
          <div className="w-1/5 text-primary-input-text font-bold">Seller</div>
          <div className="w-4/5 flex">
            <Select
              onChange={(value) => editDemoModalData('DeMoSellWho', value, 'dealMemo')}
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
              onChange={(value) => editDemoModalData('DeMoSellProgrammes', value.target.value, 'dealMemo')}
              checked={formData.DeMoSellProgrammes}
              label="Programmes"
            />

            <Checkbox
              className="ml-2"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              onChange={(value) => editDemoModalData('DeMoSellMerch', value.target.value, 'dealMemo')}
              checked={formData.DeMoSellMerch}
              label="Merchandise"
            />

            <TextArea
              className="w-[48vw] ml-2"
              value={formData.DeMoSellNotes}
              onChange={(value) => editDemoModalData('DeMoSellNotes', value.target.value, 'dealMemo')}
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
              value={formData.DeMoSellProgCommPercent}
              onChange={(value) =>
                editDemoModalData(
                  'DeMoSellProgCommPercent',
                  filterPercentage(parseFloat(value.target.value)),
                  'dealMemo',
                )
              }
            />
            <div className="ml-2">%</div>
            <div className="mr-2 ml-16">Merchandise</div>
            <TextInput
              testId="merchText"
              className="w-[150px]"
              type="number"
              value={formData.DeMoSellMerchCommPercent}
              onChange={(value) =>
                editDemoModalData(
                  'DeMoSellMerchCommPercent',
                  filterPercentage(parseFloat(value.target.value)),
                  'dealMemo',
                )
              }
            />
            <div className="ml-2">%</div>
            <div className="ml-14">Fixed Pitch Fee</div>
            <div className="ml-2 mr-2">{VENUE_CURRENCY_SYMBOLS.POUND}</div>

            <TextInput
              testId="fixedPitchText"
              className="w-[150px]"
              type="number"
              value={formData.DeMoSellPitchFee}
              onChange={(value) =>
                editDemoModalData('DeMoSellPitchFee', filterCurrencyNum(parseFloat(value.target.value)), 'dealMemo')
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
              onChange={(value) => editDemoModalData('DeMoTechVenueContactId', value, 'dealMemo')}
              options={[{ text: 'Select Assignee', value: null }, ...venueUserList]}
              className="bg-primary-white w-full"
              placeholder="Please select..."
              isClearable
              isSearchable
              value={formData.DeMoTechVenueContactId}
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
                venueUserData[formData.DeMoTechVenueContactId]
                  ? 'Add details to Venue Database'
                  : 'Please select from the dropdown above'
              }
              value={
                venueUserData[formData.DeMoTechVenueContactId]
                  ? venueUserData[formData.DeMoTechVenueContactId].Phone
                  : ''
              }
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
                venueUserData[formData.DeMoTechVenueContactId]
                  ? 'Add details to Venue Database'
                  : 'Please select from the dropdown above'
              }
              value={
                venueUserData[formData.DeMoTechVenueContactId]
                  ? venueUserData[formData.DeMoTechVenueContactId].Email
                  : ''
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
                editDemoModalData('DeMoTechArrivalDate', value, 'dealMemo');
              }}
              value={formData.DeMoTechArrivalDate}
            />
            <div className="ml-4 w-[100px]">
              <TimeInput
                className="w-fit h-[31px] [&>input]:!h-[25px] [&>input]:!w-11 !justify-center shadow-input-shadow ml-2"
                value={formData && formData.DeMoTechArrivalTime ? dateToTimeString(formData.DeMoTechArrivalTime) : null}
                disabled={disableDate}
                onChange={(value) =>
                  editDemoModalData('DeMoTechArrivalTime', convertTimeToTodayDateFormat(value), 'dealMemo')
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
                value={formData.DeMoDressingRooms}
                onChange={(value) => editDemoModalData('DeMoDressingRooms', value.target.value, 'dealMemo')}
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
              onChange={(value) => editDemoModalData('DeMoNumFacilitiesLaundry', value.target.value, 'dealMemo')}
              checked={formData.DeMoNumFacilitiesLaundry}
            />
            <div className="text-primary-input-text font-bold mr-2 ml-6">Dryer</div>

            <Checkbox
              className="flex flex-row-reverse mr-2"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              onChange={(value) => editDemoModalData('DeMoNumFacilitiesDrier', value.target.value, 'dealMemo')}
              checked={formData.DeMoNumFacilitiesDrier}
            />
            <div className="text-primary-input-text font-bold mr-2 ml-6">Laundry Room</div>

            <Checkbox
              className="flex flex-row-reverse mr-2"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              onChange={(value) => editDemoModalData('DeMoNumFacilitiesLaundryRoom', value.target.value, 'dealMemo')}
              checked={formData.DeMoNumFacilitiesLaundryRoom}
            />
            <div className="w-3/5 ml-8">
              <TextInput
                testId="laundryText"
                className="w-full"
                value={formData.DeMoNumFacilitiesNotes}
                onChange={(value) => editDemoModalData('DeMoNumFacilitiesNotes', value.target.value, 'dealMemo')}
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
                value={formData.DeMoNumCateringNotes}
                onChange={(value) => editDemoModalData('DeMoNumCateringNotes', value.target.value, 'dealMemo')}
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
                value={formData.DeMoBarringClause}
                onChange={(value) => editDemoModalData('DeMoBarringClause', value.target.value, 'dealMemo')}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Advance Payment</div>
          <div className="w-4/5 flex items-center">
            <Select
              onChange={(value) => {
                editDemoModalData('DeMoAdvancePaymentRequired', value === 1, 'dealMemo');
              }}
              className="bg-primary-white w-40"
              placeholder="Please select..."
              options={booleanOptions}
              isClearable
              isSearchable
              value={formData.DeMoAdvancePaymentRequired}
            />
            <div className=" text-primary-input-text font-bold ml-20">
              If Yes, Amount<span className="ml-2 mr-2">{VENUE_CURRENCY_SYMBOLS.POUND}</span>
            </div>

            <TextInput
              testId="yesAmountText"
              className="w-full"
              type="number"
              value={formData.DeMoAdvancePaymentAmount}
              onChange={(value) =>
                editDemoModalData(
                  'DeMoAdvancePaymentAmount',
                  filterCurrencyNum(parseFloat(value.target.value)),
                  'dealMemo',
                )
              }
              disabled={!formData.DeMoAdvancePaymentRequired}
            />
            <div className=" text-primary-input-text font-bold ml-20 mr-2"> Date Payment to be Made</div>

            <DateInput
              onChange={(value) => {
                editDemoModalData('DeMoAdvancePaymentDueBy', value, 'dealMemo');
              }}
              value={formData.DeMoAdvancePaymentDueBy}
              disabled={!formData.DeMoAdvancePaymentRequired}
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
              value={formData.DeMoSettlementDays}
              onChange={(value) => editDemoModalData('DeMoSettlementDays', parseFloat(value.target.value), 'dealMemo')}
              disabled={contractCheckBox}
            />

            <div className=" text-primary-input-text font-bold ml-2">days</div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">
            {productionJumpState.ProductionCompany.Name} VAT No.
          </div>
          <div className="w-4/5 flex">
            <div className="w-full">
              <TextInput
                testId="vatText"
                className="w-full"
                value={productionJumpState.ProductionCompany.ProdCoVATCode}
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
              value={formData.DeMoContractClause}
              onChange={(value) => editDemoModalData('DeMoContractClause', value.target.value, 'dealMemo')}
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

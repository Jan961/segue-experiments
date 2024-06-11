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
import { Icon, TimeInput } from 'components/core-ui-lib';
import axios from 'axios';
import { defaultDemoCall, filterPrice, filterTechProvision } from '../utils';
import { DealMemoTechProvision } from '@prisma/client';
import { dealMemoInitialState } from 'state/contracts/contractsFilterState';
import { LoadingOverlay } from 'components/shows/ShowsTable';

export const EditDealMemoContractModal = ({
  visible,
  onCloseDemoForm,
  productionJumpState,
  selectedTableCell,
  demoModalData,
  venueData,
}: {
  visible: boolean;
  onCloseDemoForm: () => void;
  productionJumpState: Partial<ProductionDTO>;
  selectedTableCell: AddEditContractsState;
  demoModalData: Partial<DealMemoContractFormData>;
  venueData;
}) => {
  // const [formData, setFormData] = useState<Partial<DealMemoContractFormData>>({
  //   ...demoModalData,
  // });
  const [formData, setFormData] = useRecoilState(dealMemoInitialState);

  const [contactsFormData, setContactsFormData] = useState<ContactDemoFormAccountData>({});
  const [contractCheckBox, setContractCheckBox] = useState<boolean>(false);
  const [dealMemoPriceFormData, setdealMemoPriceFormData] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dealCall, setDealCall] = useState([]);

  const [dealMemoCustomPriceFormData, setDealMemoCustomPriceFormData] = useState<any>([]);
  const [dealMemoTechProvision, setDealMemoTechProvision] = useState<DealMemoTechProvision[]>([]);

  const [venueFormData, setVenueFormData] = useState({ phone: '', email: '', id: '' });
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

  useEffect(() => {
    setFormData({ ...demoModalData });
    const priceData = filterPrice(demoModalData.DealMemoPrice);
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
  }, []);

  const [contactsData, setContactsData] = useState<ContactDemoFormData>({ phone: '', email: '' });
  const { users } = useRecoilValue(userState);
  const userList = useMemo(
    () =>
      Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
        value: Id,
        text: `${FirstName || ''} ${LastName || ''}`,
      })),
    [users],
  );

  useEffect(() => {
    const data = [...Object.values(dealMemoPriceFormData), ...dealMemoCustomPriceFormData];
    setFormData((prevDealMemo) => ({
      ...prevDealMemo,
      DealMemoPrice: data,
    }));
    // formData.DealMemoPrice = data;
  }, [dealMemoCustomPriceFormData, dealMemoPriceFormData]);

  useEffect(() => {
    // const data = [...dealMemoTechProvision];
    setFormData((prevDealMemo) => ({
      ...prevDealMemo,
      DealMemoTechProvision: [],
    }));
    // formData.DealMemoTechProvision = [];
  }, [dealMemoTechProvision]);

  useEffect(() => {
    const data = [...dealCall];
    setFormData((prevDealMemo) => ({
      ...prevDealMemo,
      DealMemoCall: data,
    }));
    // formData.DealMemoCall = data;
  }, [dealCall]);

  const editDemoModalData = async (key: string, value, type: string) => {
    const updatedFormData = {
      ...formData,
      [key]: value,
    };

    if (type === 'dealMemo') {
      setFormData({ ...updatedFormData });
    }
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
    await axios.post(`/api/dealMemo/updateDealMemo/${selectedTableCell.contract.Id}`, {
      formData,
    });
    setIsLoading(true);

    onCloseDemoForm();
    setIsLoading(false);
  };

  const handleContactsSection = async (value, key) => {
    const updatedFormData = {
      ...contactsFormData,
      [key]: value,
    };
    setContactsFormData({ ...updatedFormData });
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
  };

  const handleVenueProgrammer = (value) => {
    const venueProgrammerData = venueData.VenueContact.find((venue) => {
      return venue.Id === value;
    });
    setVenueFormData({ phone: venueProgrammerData.Phone, email: venueProgrammerData.Email, id: value });
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

  const handleCall = (key: boolean) => {
    const demoCallData = {
      DMCDeMoId: null,
      DMCCallNum: 0,
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
    callData[index][dataKey] = value;
    // eslint-disable-next-line dot-notation
    callData[index]['DMCDeMoId'] = demoModalData.DeMoId;
    setDealCall([...callData]);
  };
  return (
    <PopupModal
      show={visible}
      title="Deal Memo"
      titleClass={classNames('text-xl text-primary-navy font-bold -mt-2.5')}
      onClose={() => onCloseDemoForm()}
    >
      <div className="h-[80vh] w-[82vw] overflow-y-scroll pr-2">
        <p className="text-primary-red ">PLEASE NOTE:</p>{' '}
        <p className="text-primary-input-text">
          Some information is pre-populated from other areas of Segue. For venue details including addresses and venue
          contacts, please see <b>VENUE DATABASE.</b>
          <br /> For performance details including dates and times, please see <b>BOOKINGS.</b> For production company
          details including Promotor contacts and VAT number, please see <b>SYSTEM ADMIN.</b> For sales reports emails
          and frequency, please see <b>MANAGE SHOWS / PRODUCTIONS.</b>
        </p>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="flex items-center">
          <div className="w-1/5 text-primary-input-text font-bold">Show</div>
          <div className="w-4/5">
            <div className="w-full">
              <TextInput className="w-full" value={productionJumpState.ShowName} />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Venue</div>
          <div className="w-4/5">
            <div className="w-full">
              <TextInput className="w-full" value={selectedTableCell.contract.venue} />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Agreed Deal Memo Dated</div>
          <div className="w-4/5">
            <DateInput
              onChange={(value) => editDemoModalData('DeMoRunningTime', value, 'dealMemo')}
              value={formData.DeMoRunningTime}
            />
          </div>
        </div>
        <div className="text-primary-input-text mt-4">
          Please read this carefully to ensure it reflects the terms as agreed between {`Jendagi Productions Limited`}{' '}
          and {`${selectedTableCell.contract.venue}`}.
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
              placeholder="User Name Dropdown"
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
          {`(this includes internal access).`} Unless otherwise agreed, all staff calls will be scheduled within the
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
              placeholder="User Name Dropdown"
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
            <div className="w-2/4">
              <TextInput className="w-2/4" value={contactsData.phone} />
            </div>

            <div className="text-primary-input-text font-bold ml-8 mr-4">Email</div>
            <div className="w-2/4">
              <TextInput className="w-2/4" value={contactsData.email} />
            </div>
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Performance</div>
        <div className="flex items-center">
          <div className="w-1/5 text-primary-input-text font-bold">Show Title</div>

          <div className="w-4/5 flex items-center">
            {/* <div className=" text-primary-input-text "> {productionJumpState.ShowName}</div> */}
            <TextInput className="w-[400px]" value={productionJumpState.ShowName} />
            <div className="text-primary-input-text font-bold ml-8 mr-4"> No. of Performances</div>
            <TextInput className="w-[350px]" value={selectedTableCell.contract.performanceCount} />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Performance Date(s) and Time(s)</div>
          <div className="w-4/5 flex">
            <div>
              {selectedTableCell.contract.performanceTimes &&
                selectedTableCell.contract.performanceTimes.split(';').map((times) => (
                  <TextInput
                    key={times}
                    id="venueText"
                    className="w-[350px] mt-1 mb-1"
                    value={times}
                    // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'dealMemo')}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Running Time</div>
          <div className="w-4/5 flex items-center">
            <DateInput
              onChange={(value) => editDemoModalData('DeMoRunningTime', value, 'dealMemo')}
              value={formData.DeMoRunningTime}
            />
            <div className=" text-primary-input-text font-bold ml-8 mr-4">Notes</div>

            <TextInput
              id="venueText"
              className="w-[51vw]"
              value={formData.DeMoRunningTimeNotes}
              onChange={(value) => editDemoModalData('DeMoRunningTimeNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Pre / Post Show Events</div>
          <div className="w-4/5 flex">
            <TextArea
              className="h-[102px] w-[65vw]"
              value={formData.DeMoPrePostShowEvents}
              onChange={(value) => editDemoModalData('DeMoPrePostShowEvents', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Off-Stage Venue Curfew Time</div>
          <div className="w-4/5 flex">
            <DateInput
              onChange={(value) =>
                // formData.DeMoVenueCurfewTime.toString() !== toISO(value) &&
                editDemoModalData('DeMoVenueCurfewTime', value, 'dealMemo')
              }
              value={formData.DeMoVenueCurfewTime}
            />
            <div className=" text-primary-input-text font-bold ml-8 mr-4">Notes</div>

            <TextInput
              id="venueText"
              className="w-[51vw]"
              value={formData.DeMoPerformanceNotes}
              onChange={(value) => editDemoModalData('DeMoPerformanceNotes', value.target.value, 'dealMemo')}
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
                  id="venueText"
                  className="w-full"
                  value={venueData ? venueData[input[1]] : ''}
                  onChange={(value) => editDemoModalData('DeMoPerformanceNotes', value.target.value, 'dealMemo')}
                />
              </div>
            </div>
          );
        })}
        <div className="flex items-center mb-2">
          <div className="w-1/5 text-primary-input-text font-bold">Programmer</div>
          <div className="w-4/5">
            <Select
              onChange={(value) => {
                handleVenueProgrammer(value);
              }}
              options={[{ text: 'Select Assignee', value: null }, ...venueUserList]}
              className="bg-primary-white w-full"
              value={venueFormData.id}
              placeholder="Venue User Name Dropdown"
              isClearable
              isSearchable
            />
          </div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
          <div className="w-4/5">
            <TextInput id="venueText" className="w-full" value={venueFormData.phone} />
          </div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-1/5 text-primary-input-text font-bold">Email</div>
          <div className="w-4/5">
            <TextInput id="venueText" className="w-full" value={venueFormData.email} />
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Deal</div>
        <div className="flex items-center">
          <div className="w-1/5 text-primary-input-text font-bold">Royalty Off the top</div>
          <div className="w-4/5 flex items-center">
            <TextInput
              id="venueText"
              className="w-[100px]"
              value={formData.DeMoROTTPercentage}
              onChange={(value) => editDemoModalData('DeMoROTTPercentage', value.target.value, 'dealMemo')}
            />{' '}
            <div className=" text-primary-input-text font-bold ml-2">%</div>
            <div className=" text-primary-input-text font-bold ml-12 mr-4">PRS</div>
            <TextInput
              id="venueText"
              className="w-[100px]"
              value={formData.DeMoPRSPercentage}
              type="number"
              onChange={(value) => editDemoModalData('DeMoPRSPercentage', value.target.value, 'dealMemo')}
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
              className="bg-primary-white w-26 mr-1"
              placeholder="YES|NO"
              options={booleanOptions}
              isClearable
              isSearchable
            />
            <div className="text-primary-input-text font-bold ml-16 mr-2">£</div>

            <TextInput
              id="venueText"
              className="w-[140px] ml-2"
              value={formData.DeMoGuaranteeAmount}
              onChange={(value) => editDemoModalData('DeMoGuaranteeAmount', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex  mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Calls</div>
          <div className="w-4/5 flex ">
            <Select
              onChange={(value) => {
                editDemoModalData('DeMoHasCalls', value, 'dealMemo');
              }}
              className="bg-primary-white w-26 mr-1 h-8"
              placeholder="YES|NO"
              options={booleanOptions}
              isClearable
              isSearchable
              value={formData.DeMoHasCalls}
            />
            <div>
              {dealCall.map((call, index) => {
                return (
                  <div className="flex mb-6" key={index}>
                    <div className="text-primary-input-text font-bold ml-6 mr-2 w-[90px]">{calls[index]} Call</div>

                    <Select
                      onChange={(value) => {
                        editDemoCallModalData('DMCPromoterOrVenue', value, index);

                        // DMCPromoterOrVenue
                      }}
                      value={dealCall[index].DMCPromoterOrVenue}
                      className="bg-primary-white w-[140px] mr-1 "
                      placeholder=""
                      options={callOptions}
                      isClearable
                      isSearchable
                      disabled={dealCall[index].DeMoHasCalls === 1}
                    />

                    <Select
                      onChange={(value) => {
                        editDemoCallModalData('DMCType', value, index);
                      }}
                      value={dealCall[index].DMCType}
                      className="bg-primary-white w-[140px] mr-1 ml-6"
                      placeholder=""
                      options={callValueOptions}
                      isClearable
                      isSearchable
                      disabled={dealCall[index].DeMoHasCalls === 1}
                    />

                    <div className="text-primary-input-text font-bold ml-8 mr-2">£</div>

                    <TextInput
                      id="venueText"
                      className="w-[140px] ml-2"
                      type="number"
                      value={dealCall[index].DMCValue}
                      disabled={formData.DealMemoCall && formData.DealMemoCall.DeMoHasCalls === 1}
                      onChange={(value) => editDemoCallModalData('DMCValue', parseInt(value.target.value), index)}
                    />
                    <div className=" text-primary-input-text font-bold ml-2">%</div>
                    <Icon className="ml-2" iconName="plus-circle-solid" onClick={() => handleCall(true)} variant="lg" />
                    {dealCall.length > 1 && (
                      <Icon
                        className="ml-2"
                        iconName="minus-circle-solid"
                        onClick={() => handleCall(false)}
                        variant="lg"
                      />
                    )}
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
              id="venueText"
              className="w-[150px]"
              type="number"
              value={formData.DeMoPromoterSplitPercentage}
              onChange={(value) => editDemoModalData('DeMoPromoterSplitPercentage', value.target.value, 'dealMemo')}
            />

            <div className="text-primary-input-text font-bold ml-2 mr-2">%</div>

            <div className="text-primary-input-text font-bold ml-20 mr-2">Venue Split</div>

            <TextInput
              id="venueText"
              className="w-[100px]"
              value={formData.DeMoVenueSplitPercentage}
              onChange={(value) => editDemoModalData('DeMoVenueSplitPercentage', value.target.value, 'dealMemo')}
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
                <div className="text-primary-input-text font-bold  mr-4">£</div>

                <TextInput
                  id="venueText"
                  className="w-[100px] mr-6"
                  value={formData[inputData[1]]}
                  onChange={(value) => editDemoModalData(inputData[1], value.target.value, 'dealMemo')}
                />
                <TextInput
                  id="venueText"
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
              onChange={() => {
                return null;
              }}
              className="bg-primary-white w-full"
              placeholder="User Name Dropdown"
              options={venueUserList}
              isClearable
              isSearchable
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
          <div className="w-4/5">
            <TextInput
              id="venueText"
              className="w-full"
              //   value={formData.DeMoPerformanceNotes}
              //   onChange={(value) => editDemoModalData('DeMoPerformanceNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Email</div>
          <div className="w-4/5">
            <TextInput
              id="venueText"
              className="w-full"
              //   value={formData.DeMoPerformanceNotes}
              //   onChange={(value) => editDemoModalData('DeMoPerformanceNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Onsale Date</div>
          <div className="w-4/5 flex">
            <DateInput
              onChange={() => {
                return null;
              }}
              // DeMoOnSaleDate
              // className='w-[300px]'
              // value={formData.SignedDate}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Accounts Contact for Settlement</div>
          <div className="w-4/5 flex">
            <Select
              onChange={() => {
                return null;
              }}
              className="bg-primary-white w-full"
              placeholder="User Name Dropdown"
              options={venueUserList}
              isClearable
              isSearchable
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
          <div className="w-4/5">
            <TextInput
              id="venueText"
              className="w-full"
              //   value={formData.DeMoPerformanceNotes}
              //   onChange={(value) => editDemoModalData('DeMoPerformanceNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Email</div>
          <div className="w-4/5">
            <TextInput
              id="venueText"
              className="w-full"
              //   value={formData.DeMoPerformanceNotes}
              //   onChange={(value) => editDemoModalData('DeMoPerformanceNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Venue Capacity</div>
          <div className="w-4/5 flex items-center">
            <TextInput
              id="venueText"
              className="w-auto"
              value={venueData ? venueData.VenueSeats : null}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'dealMemo')}
            />
            <div className="text-primary-input-text font-bold ml-8 mr-2">Sellable Capacity</div>

            <TextInput
              id="venueText"
              className="w-auto"
              value={formData.DeMoSellableSeats}
              onChange={(value) => editDemoModalData('DeMoSellableSeats', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Mixer Desk Position</div>
          <div className="w-4/5 flex">
            <TextInput
              id="venueText"
              className="w-[40vw]"
              value={formData.DeMoMixerDeskPosition}
              onChange={(value) => editDemoModalData('DeMoMixerDeskPosition', value.target.value, 'dealMemo')}
            />
            <div className="text-primary-input-text font-bold ml-8 mr-4">No. of Seats</div>

            <TextInput
              id="venueText"
              className="w-[15vw]"
              value={formData.DeMoSellableSeats}
              onChange={(value) => editDemoModalData('DeMoSellableSeats', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Standard Seat Skills</div>
          <div className="w-4/5">
            <TextInput
              id="venueText"
              className="w-full"
              value={formData.DeMoStandardSeatKills}
              onChange={(value) => editDemoModalData('DeMoPerformanceNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="flex items-center">
          <div className="text-xl text-primary-navy font-bold ">Prices</div>
          <div className="ml-2 text-sm"> {`(net of levies, commissions etc)`}</div>
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
        {Object.values(dealMemoPriceFormData as unknown).map((inputData) => {
          return (
            <div key={inputData.DMPTicketName} className="flex items-center mt-2">
              <div className="w-1/5 text-primary-input-text font-bold">{inputData.DMPTicketName} </div>
              <div className="w-4/5 flex">
                <div className="w-1/5">
                  <TextInput
                    id="venueText"
                    className="w-auto"
                    onChange={(value) =>
                      editDealMemoPrice(inputData.DMPTicketName, parseInt(value.target.value), 'DMPNumTickets')
                    }
                    value={
                      dealMemoPriceFormData[inputData.DMPTicketName]
                        ? dealMemoPriceFormData[inputData.DMPTicketName].DMPNumTickets
                        : null
                    }
                  />
                </div>

                <div className="text-primary-input-text font-bold mr-2">£</div>

                <TextInput
                  id="venueText"
                  className="w-auto"
                  onChange={(value) =>
                    editDealMemoPrice(inputData.DMPTicketName, parseInt(value.target.value), 'DMPTicketPrice')
                  }
                  value={
                    dealMemoPriceFormData[inputData.DMPTicketName]
                      ? dealMemoPriceFormData[inputData.DMPTicketName].DMPTicketPrice
                      : null
                  }
                />
                <TextInput
                  id="venueText"
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
                    id="venueText"
                    className="w-auto"
                    value={dealMemoCustomPriceFormData[index].DMPTicketName}
                    onChange={(value) =>
                      editDealMemoPrice('DMPTicketName', value.target.value, 'DMPTicketName', index, 'customPrice')
                    }
                  />
                </div>
                <div className="w-4/5 flex">
                  <TextInput
                    id="venueText"
                    className="w-auto"
                    value={dealMemoCustomPriceFormData[index].DMPNumTickets}
                    onChange={(value) =>
                      editDealMemoPrice(
                        'DMPNumTickets',
                        parseInt(value.target.value),
                        'DMPNumTickets',
                        index,
                        'customPrice',
                      )
                    }
                  />

                  <span className="text-primary-input-text font-bold mr-2 ml-4">£</span>

                  <TextInput
                    id="venueText"
                    className="w-auto"
                    onChange={(value) =>
                      editDealMemoPrice(
                        'DMPTicketPrice',
                        parseInt(value.target.value),
                        'DMPTicketPrice',
                        index,
                        'customPrice',
                      )
                    }
                    value={dealMemoCustomPriceFormData[index].DMPTicketPrice}
                  />
                  <TextInput
                    id="venueText"
                    className="w-[33vw] ml-8"
                    value={dealMemoCustomPriceFormData[index].DMPNotes}
                    onChange={(value) =>
                      editDealMemoPrice('DMPNotes', value.target.value, 'DMPNotes', index, 'customPrice')
                    }
                  />
                  <Icon iconName="minus" onClick={() => handleCustomPrice(false, index)} variant="lg" />
                </div>
              </div>
            );
          }
          return null;
        })}
        <div className="flex items-center mt-2">
          <div className="w-1/5">
            <TextInput
              id="venueText"
              className="w-auto"
              value={dealMemoCustomPriceFormData[0] ? dealMemoCustomPriceFormData[0].DMPTicketName : ''}
              onChange={(value) =>
                editDealMemoPrice('DMPTicketName', value.target.value, 'DMPTicketName', 0, 'customPrice')
              }
            />
          </div>
          <div className="w-4/5 flex">
            <TextInput
              id="venueText"
              className="w-auto"
              value={dealMemoCustomPriceFormData[0] ? dealMemoCustomPriceFormData[0].DMPNumTickets : null}
              onChange={(value) =>
                editDealMemoPrice('DMPNumTickets', parseInt(value.target.value), 'DMPNumTickets', 0, 'customPrice')
              }
            />

            <span className="text-primary-input-text font-bold mr-2 ml-4">£</span>

            <TextInput
              id="venueText"
              className="w-auto"
              onChange={(value) =>
                editDealMemoPrice('DMPTicketPrice', parseInt(value.target.value), 'DMPTicketPrice', 0, 'customPrice')
              }
              value={dealMemoCustomPriceFormData[0] ? dealMemoCustomPriceFormData[0].DMPTicketPrice : null}
            />
            <TextInput
              id="venueText"
              className="w-[33vw] ml-8"
              value={dealMemoCustomPriceFormData[0] ? dealMemoCustomPriceFormData[0].DMPNotes : ''}
              onChange={(value) => editDealMemoPrice('DMPNotes', value.target.value, 'DMPNotes', 0, 'customPrice')}
            />

            <Icon iconName="minus" onClick={() => handleCustomPrice(false, 0)} variant="lg" />
            <Icon iconName="plus-circle-solid" onClick={() => handleCustomPrice(true, 0)} variant="lg" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">
            Restoration Levy<div>{`(per ticket)`}</div>
          </div>
          <div className="w-4/5 flex items-center">
            <div className="text-primary-input-text font-bold mr-2">£</div>

            <TextInput
              id="venueText"
              className="w-auto"
              type="number"
              value={formData.DeMoRestorationLevy}
              onChange={(value) => editDemoModalData('DeMoRestorationLevy', parseInt(value.target.value), 'dealMemo')}
            />
            <div className="text-primary-input-text font-bold ml-16 flex">
              Booking fees <div className="ml-4 mr-2">£</div>
            </div>
            <TextInput
              id="venueText"
              className="w-auto"
              type="number"
              value={formData.DeMoBookingFees}
              onChange={(value) => editDemoModalData('DeMoBookingFees', parseInt(value.target.value), 'dealMemo')}
            />
            <div className="text-primary-input-text font-bold ml-16">Credit Card Commission</div>
            <TextInput
              id="venueText"
              className="w-auto"
              type="number"
              value={formData.DeMoCCCommissionPercent}
              onChange={(value) =>
                editDemoModalData('DeMoCCCommissionPercent', parseInt(value.target.value), 'dealMemo')
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
              placeholder="User Name Dropdown"
              options={transactionOptions}
              isClearable
              isSearchable
            />
            <div className="text-primary-input-text font-bold ml-20">£</div>
            <TextInput
              id="venueText"
              className="w-auto"
              value={formData.DeMoTxnChargeAmount}
              onChange={(value) => editDemoModalData('DeMoTxnChargeAmount', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Agreed Disocunts</div>
          <div className="w-4/5 flex">
            <TextInput
              id="venueText"
              className="w-auto"
              value={formData.DeMoAgreedDiscounts}
              onChange={(value) => editDemoModalData('DeMoAgreedDiscounts', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex text-primary-input-text mt-2 -mb-4">
            No other disocunts without written agreement from {`<AUTO GENERATE ORGANISATION NAME`}
          </div>
        </div>
        {[
          ['Maximum Ticket Agency Allocations', 'DeMoMaxTAAlloc'],
          ['Ticket Agency Allocations', 'DeMoTAAlloc'],
          ['Ticket Copy', 'DeMoTicketCopy'],
          ['Producer Complementary Tickets Per Performance', 'DeMoProducerCompCount'],
          ['Other Tickets to be held off sale?', 'DeMoOtherHolds'],
        ].map((inputData) => {
          return (
            <div key={inputData[0]} className="flex items-center mt-2">
              <div className="w-1/5 text-primary-input-text font-bold">{inputData[0]}</div>
              <div className="w-4/5">
                <TextInput
                  id="venueText"
                  className="w-full"
                  value={formData[inputData[1]]}
                  onChange={(value) =>
                    editDemoModalData(
                      inputData[1],
                      inputData[1] === 'DeMoProducerCompCount' ? parseInt(value.target.value) : value.target.value,
                      'dealMemo',
                    )
                  }
                />
              </div>
            </div>
          );
        })}
        <div className="flex items-center mt-2">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex text-primary-input-text">
            e.g. Wheelchair / Restricted View / House Seats / Press
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5 text-primary-input-text font-bold">Age Limit / Guidance</div>
          <div className="w-4/5">
            <TextInput
              id="venueText"
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
              id="venueText"
              className="w-[20vw]"
              value={productionJumpState.SalesFrequency === 'W' ? 'Weekly' : 'Daily'}
            />
            <div className=" text-primary-input-text font-bold ml-20 mr-4">If Weekly, on</div>
            <Select
              onChange={(value) => editDemoModalData('DeMoSalesDayNum ', value, 'dealMemo')}
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
            <TextInput
              id="venueText"
              className="w-full"
              // value={formData[inputData[1]]}
              // onChange={(value) => editDemoModalData(inputData[1], value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex">
            <Select
              onChange={() => {
                return null;
              }}
              className="bg-primary-white w-full"
              placeholder="User Name Dropdown"
              options={[{ text: 'Select Assignee', value: null }]}
              isClearable
              isSearchable
            />
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Marketing</div>
        <div className="flex items-center">
          <div className="w-1/5 text-primary-input-text font-bold">Marketing Manager</div>
          <div className="w-4/5 flex">
            <Select
              onChange={() => {
                return null;
              }}
              options={[{ text: 'Select Assignee', value: null }, ...venueUserList]}
              className="bg-primary-white w-full"
              placeholder="User Name Dropdown"
              isClearable
              isSearchable
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
          <div className="w-4/5">
            <TextInput
              id="venueText"
              className="w-full"
              //   value={formData.DeMoPerformanceNotes}
              //   onChange={(value) => editDemoModalData('DeMoPerformanceNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Email</div>
          <div className="w-4/5">
            <TextInput
              id="venueText"
              className="w-full"
              //   value={formData.DeMoPerformanceNotes}
              //   onChange={(value) => editDemoModalData('DeMoPerformanceNotes', value.target.value, 'dealMemo')}
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
              className="h-[93px] w-full"
              value={formData.DeMoPrintReqs}
              onChange={(value) => editDemoModalData('DeMoPrintReqs', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Print Delivery Address</div>
          <div className="w-4/5">
            <TextInput
              id="venueText"
              className="w-full"
              //   value={formData.DeMoPerformanceNotes}
              //   onChange={(value) => editDemoModalData('DeMoPerformanceNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Local Marketing Budget</div>
          <div className="w-4/5 flex">
            <div className="text-primary-input-text font-bold mr-2">£</div>

            <TextInput
              id="venueText"
              className="w-auto"
              type="number"
              value={formData.DeMoLocalMarketingBudget}
              onChange={(value) =>
                editDemoModalData('DeMoLocalMarketingBudget', parseInt(value.target.value), 'dealMemo')
              }
            />
            <div className="text-primary-input-text font-bold ml-20">Local Marketing Contra </div>
            <div className="text-primary-input-text font-bold ml-20 mr-2">£</div>
            <TextInput
              id="venueText"
              className="w-auto"
              type="number"
              value={formData.DeMoLocalMarketingContra}
              onChange={(value) =>
                editDemoModalData('DeMoLocalMarketingContra', parseInt(value.target.value), 'dealMemo')
              }
            />
          </div>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex text-primary-input-text text-sm">
            Any expenditure needs pre-approval from {`<AUTO GENERATE ORGANISATION NAME>`}
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
              placeholder="User Name Dropdown"
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
              className="h-[200px] w-[48vw] ml-2"
              value={formData.DeMoSellNotes}
              onChange={(value) => editDemoModalData('DeMoSellNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">View Commission</div>
          <div className="w-4/5 flex text-primary-input-text font-bold">
            <div className="mr-4">Programmes</div>
            <TextInput
              id="venueText"
              className="w-auto"
              type="number"
              value={formData.DeMoSellProgCommPercent}
              onChange={(value) => editDemoModalData('DeMoSellProgCommPercent', value.target.value, 'dealMemo')}
            />
            <div className="ml-2">%</div>
            <div className="mr-4 ml-2">Merchandise</div>
            <TextInput
              id="venueText"
              className="w-auto"
              type="number"
              value={formData.DeMoSellMerchCommPercent}
              onChange={(value) => editDemoModalData('DeMoSellMerchCommPercent', value.target.value, 'dealMemo')}
            />
            <div className="ml-2">%</div>
            <div className="mr-2 ml-8">Fixed Pitch Fee</div>
            <div className="ml-2 mr-2">£</div>

            <TextInput
              id="venueText"
              className="w-auto"
              type="number"
              value={formData.DeMoSellPitchFee}
              onChange={(value) => editDemoModalData('DeMoSellPitchFee', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Technical</div>
        <div className="flex items-center">
          <div className="w-1/5 text-primary-input-text font-bold">Technical Manager</div>
          <div className="w-4/5 flex">
            <Select
              onChange={(value) => {
                handleVenueProgrammer(value);
              }}
              options={[{ text: 'Select Assignee', value: null }, ...venueUserList]}
              className="bg-primary-white w-full"
              value={venueFormData.id}
              placeholder="Venue User Name Dropdown"
              isClearable
              isSearchable
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Phone</div>
          <div className="w-4/5">
            <TextInput id="venueText" className="w-full" value={venueFormData.phone} />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Email</div>
          <div className="w-4/5">
            <TextInput id="venueText" className="w-full" value={venueFormData.email} />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Company Arrival Date / Time</div>
          <div className="w-4/5 flex">
            {/* DeMoTechArrivalDate / DeMoTechArrivalTime */}
            <DateInput
              onChange={(value) => {
                editDemoModalData('DeMoTechArrivalDate', value, 'dealMemo');
              }}
              value={formData.DeMoTechArrivalDate}
            />
            <TimeInput
              className="w-fit h-[31px] [&>input]:!h-[25px] [&>input]:!w-11 !justify-center shadow-input-shadow ml-2"
              value={venueData ? venueData.DeMoTechArrivalTime : null}
              onChange={
                () => null
                // editDemoModalData('DeMoTechArrivalTime', value, 'dealMemo')
              }
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">Stage Door What3Words</div>
          <div className="w-4/5 flex items-center">
            <TextInput
              id="venueText"
              className="w-[25vw]"
              value={venueData ? venueData.AddressStageDoorW3W : null}
              // onChange={(value) => editDemoModalData('RoyaltyPercentage', value.target.value, 'dealMemo')}
            />
            <div className="w-1/5 text-primary-input-text font-bold ml-4">Loading Bay What3Words</div>

            <TextInput
              id="venueText"
              className="w-[25vw]"
              value={venueData ? venueData.AddressLoadingW3W : null}

              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'dealMemo')}
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
                    id="venueText"
                    className="w-full"
                    value={inputData.DMTechVenue}
                    onChange={(value) =>
                      editTechProvisionModalData('DMTechVenue', value.target.value, inputData.DMTechName)
                    }
                  />
                </div>
                <div className="w-2/4 ml-2">
                  <TextInput
                    id="venueText"
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
                id="venueText"
                type="number"
                className="w-full"
                value={formData.DeMoNumDressingRooms}
                onChange={(value) =>
                  editDemoModalData('DeMoNumDressingRooms', parseInt(value.target.value), 'dealMemo')
                }
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
            <div className="text-primary-input-text font-bold mr-2 ml-6">Drier</div>

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
                id="venueText"
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
                id="venueText"
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
                id="venueText"
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
              className="bg-primary-white w-36"
              placeholder="YES|NO"
              options={booleanOptions}
              isClearable
              isSearchable
            />
            <div className=" text-primary-input-text font-bold ml-20">
              If Yes, Amount<span className="ml-2 mr-2">£</span>
            </div>

            <TextInput
              id="venueText"
              className="w-full"
              type="number"
              value={formData.DeMoAdvancePaymentAmount}
              onChange={(value) =>
                editDemoModalData('DeMoAdvancePaymentAmount', parseInt(value.target.value), 'dealMemo')
              }
            />
            <div className=" text-primary-input-text font-bold ml-20"> Date Payment to be Made</div>

            <DateInput
              onChange={(value) => {
                editDemoModalData('DeMoAdvancePaymentDueBy', value, 'dealMemo');
              }}
              value={formData.DeMoAdvancePaymentDueBy}
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
              id="venueText"
              className="w-full"
              value={formData.DeMoSettlementDays}
              onChange={(value) => editDemoModalData('DeMoSettlementDays', parseInt(value.target.value), 'dealMemo')}
              disabled={contractCheckBox}
            />

            <div className=" text-primary-input-text font-bold ml-2">days</div>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-1/5 text-primary-input-text font-bold">VAT No.</div>
          <div className="w-4/5 flex">
            <div className="w-full">
              <TextInput
                id="venueText"
                className="w-full"
                // value={formData.DeMoContractClause}
                // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'dealMemo')}
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
        <Button onClick={() => onCloseDemoForm()} className="w-33" variant="secondary" text="Cancel" />
        <Button onClick={() => null} className="ml-4 w-33" variant="primary" text="Export to Excel" />

        <Button onClick={() => saveDemoModalData()} className="ml-4 w-33" variant="primary" text="Save and Close" />
      </div>
      {isLoading && <LoadingOverlay />}
    </PopupModal>
  );
};

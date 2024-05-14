import PopupModal from 'components/core-ui-lib/PopupModal';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
import Select from 'components/core-ui-lib/Select';
import DateInput from 'components/core-ui-lib/DateInput';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Checkbox from 'components/core-ui-lib/Checkbox';
import TextInput from 'components/core-ui-lib/TextInput';
import {
  allStatusOptions,
  contractsKeyStatusMap,
  dealTypeOptions,
  initialEditContractFormData,
} from 'config/contracts';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import { addEditContractsState } from 'state/contracts/contractsState';
import useAxios from 'hooks/useAxios';
import { bookingStatusMap } from 'config/bookings';
import { userState } from 'state/account/userState';
import { useMemo, useState } from 'react';
import { SaveContractBookingFormState, SaveContractFormState, VenueContractFormData } from 'interfaces';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { convertDate } from 'services/dateService';
const convert = (data: Date): string => {
  const dateObj = new Date(data);
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date format');
  }
  return dateObj.toISOString();
};
const EditVenueContractModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const productionJumpState = useRecoilValue(currentProductionSelector);
  const selectedTableCell = useRecoilValue(addEditContractsState);
  const [saveContractFormData, setSaveContractFormData] = useState<Partial<SaveContractFormState>>({});
  const [saveBookingFormData, setSaveBookingFormData] = useState<Partial<SaveContractBookingFormState>>({});
  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<VenueContractFormData>>({
    ...initialEditContractFormData,
    ...selectedTableCell.contract,
  });
  const modalTitle = `${productionJumpState.ShowCode + productionJumpState.Code} | ${productionJumpState.ShowName} | ${
    selectedTableCell.contract.venue
  } | ${convertDate(productionJumpState.StartDate)} - ${convertDate(productionJumpState.EndDate)}`;
  const { fetchData } = useAxios();
  const router = useRouter();
  const { users } = useRecoilValue(userState);
  const userList = useMemo(
    () =>
      Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
        value: Id,
        text: `${FirstName || ''} ${LastName || ''}`,
      })),
    [users],
  );

  const editContractModalData = async (key: string, value, type: string) => {
    const updatedFormData = {
      ...formData,
      [key]: value,
    };

    setFormData(updatedFormData);
    if (type === 'booking') {
      setSaveBookingFormData({ ...saveBookingFormData, [key]: value });
    }
    if (type === 'contract') {
      setSaveContractFormData({ ...saveContractFormData, [key]: value });
    }
  };

  const handleFormData = async () => {
    const bookingData = Object.keys(saveBookingFormData).length > 0;
    const contractData = Object.keys(saveContractFormData).length > 0;
    if (contractData) {
      await fetchData({
        url: `/api/contracts/update/venueContract/${selectedTableCell.contract.Id}`,
        method: 'PATCH',
        data: saveContractFormData,
      });
    }

    if (bookingData) {
      await fetchData({
        url: `/api/contracts/update/venueContractBooking/${selectedTableCell.contract.Id}`,
        method: 'PATCH',
        data: saveBookingFormData,
      });
    }
    setSaveBookingFormData({});
    setSaveContractFormData({});
    onClose();
    router.replace(router.asPath);
  };

  const handleCancelForm = (cancel: boolean) => {
    if (cancel) {
      onClose();
    }
    if (Object.keys(saveBookingFormData).length > 0 || Object.keys(saveContractFormData).length > 0) {
      setCancelModal(true);
    } else {
      onClose();
    }
  };

  return (
    <PopupModal
      show={visible}
      title={modalTitle}
      titleClass={classNames('text-xl text-primary-navy font-bold -mt-2.5')}
      onClose={() => handleCancelForm(false)}
    >
      <div className="h-[80vh] w-auto overflow-scroll flex">
        <div className="h-[800px]   flex">
          <div className="w-[423px] h-[1008px] rounded border-2 border-secondary mr-2 p-3 bg-primary-blue bg-opacity-15">
            <div className=" text-primary-input-text font-bold text-lg">Deal Memo</div>
            <div className=" text-primary-input-text font-bold text-sm mt-1.5">Deal Memo Status</div>
            <Select
              options={allStatusOptions}
              className="bg-primary-white w-52"
              placeholder="Deal Memo Status"
              onChange={(value) => editContractModalData('dealMemoStatus', value, 'booking')}
              value={contractsKeyStatusMap[formData.StatusCode]}
              isClearable
              isSearchable
            />

            <div className=" text-primary-input-text font-bold text-sm mt-6">Completed By</div>
            <Select
              onChange={() => {
                return null;
              }}
              className="bg-primary-white w-52"
             
              options={[{ text: 'Select Assignee', value: null }, ...userList]}
              isClearable
              isSearchable
            />

            <div className=" text-primary-input-text font-bold text-sm mt-6">Approved By</div>
            <Select
              onChange={() => {
                return null;
              }}
              className="bg-primary-white w-52"
              
              options={[{ text: 'Select Assignee', value: null }, ...userList]}
              isClearable
              isSearchable
            />
            <div className="flex items-center mt-6">
              <div className=" text-primary-input-text font-bold text-sm">Date Issued</div>
              <DateInput
                onChange={() => {
                  return null;
                }}
                value={formData.SignedDate}
              />

              <div className=" text-primary-input-text font-bold text-sm">Date Returned</div>

              <DateInput
                onChange={() => {
                  return null;
                }}
                value={formData.SignedDate}
              />
            </div>

            <div className=" text-primary-input-text font-bold text-sm mt-6">Notes</div>
            <TextArea
              className={'h-[580px] w-[400px]'}
              value={formData.DealNotes}
              
            />
            <div className="flex mt-4 items-center">
              <Button className="w-60" variant="primary" text="Create/Edit Deal Memo" />
              <Button className="ml-3 w-36" variant="primary" text="View as PDF" />
            </div>
          </div>
          <div className="w-[652px] h-[1008px] rounded border-2 border-secondary ml-2 p-3 bg-primary-blue bg-opacity-15">
            <div className=" text-primary-input-text font-bold text-lg">Venue Contract</div>

            <div className="flex mt-2.5">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Booking Status</div>
              </div>
              <div className="w-4/5">
                <div className=" text-primary-input-text text-sm">{bookingStatusMap[formData.status]}</div>
              </div>
            </div>
            <div className="flex mt-2.5">
              <div className=" text-primary-input-text font-bold text-sm">Perf / Day</div>
              <div className=" text-primary-input-text text-sm ml-5">{formData.performanceCount}</div>
              <div className=" text-primary-input-text font-bold text-sm ml-4">Times</div>
              <div className=" text-primary-input-text font-bold text-sm ml-2">1</div>
              <div className=" text-primary-input-text text-sm ml-1">
                {formData.performanceTimes && formData.performanceTimes.split(';')[0]}
              </div>
              <div className=" text-primary-input-text font-bold text-sm ml-2">2</div>
              <div className=" text-primary-input-text text-sm ml-1">
                {formData.performanceTimes && formData.performanceTimes.split(';')[1]}
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Contract Status</div>
              </div>
              <div className="w-4/5 flex">
                <Select
                  onChange={(value) => editContractModalData('StatusCode', value, 'contract')}
                  className="bg-primary-white w-52"
                  value={formData.StatusCode}
                  placeholder="Contract Status"
                  options={allStatusOptions}
                  isClearable
                  isSearchable
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Signed By Producer</div>
              </div>
              <div className="w-4/5 flex justify-between">
                <Select
                  onChange={() => {
                    return null;
                  }}
                  className="bg-primary-white w-52"
                 
                  placeholder="User Name Dropdown"
                  options={[{ text: 'Select Assignee', value: null }, ...userList]}
                  isClearable
                  isSearchable
                />

                <div className="flex items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Signed On</div>
                  <DateInput
                    onChange={(value) =>
                      formData.SignedDate.toString() !== convert(value) && editContractModalData('SignedDate', value, 'contract')
                    }
                    value={formData.SignedDate}
                  />
                </div>
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Returned to Venue</div>
              </div>
              <div className="w-4/5 flex justify-between">
                <DateInput
                  onChange={(value) => {
                    formData.ReturnDate.toString() !== convert(value) && editContractModalData('ReturnDate', value, 'contract');
                  }}
                  value={formData.ReturnDate}
                />
                <div className="flex items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Returned from Venue</div>

                  <DateInput
                    onChange={(value) =>
                      formData.ReceivedBackDate.toString() !== convert(value) &&
                      editContractModalData('ReceivedBackDate', value, 'contract')
                    }
                    value={formData.ReceivedBackDate}
                  />
                </div>
              </div>
            </div>
            <div className="flex mt-4 mb-4 items-center">
              <div className="flex flex-1 items-center">
                <div className=" text-primary-input-text font-bold text-sm mr-5">Bank Details Sent</div>
                <Checkbox
                  className="flex flex-row-reverse"
                  labelClassName="!text-base"
                  id="includeExcludedVenues"
                  
                  onChange={() => {
                    return null;
                  }}
                />
              </div>
              <div className="flex flex-1 items-center justify-center">
                <div className=" text-primary-input-text font-bold text-sm mr-5">Tech Spec Sent</div>
                <Checkbox
                  className="flex flex-row-reverse"
                  labelClassName="!text-base"
                  id="includeExcludedVenues"
                 
                  onChange={() => {
                    return null;
                  }}
                />
              </div>
              <div className="flex flex-1 items-center justify-end">
                <div className=" text-primary-input-text font-bold text-sm mr-5">PRS Certificate Sent</div>
                <Checkbox
                  className="flex flex-row-reverse"
                  labelClassName="!text-base"
                  id="includeExcludedVenues"
                  
                  onChange={() => {
                    return null;
                  }}
                />
              </div>
            </div>

            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Deal Type</div>
              </div>
              <div className="w-4/5 flex">
                <Select
                  onChange={(value) => editContractModalData('DealType', value, 'contract')}
                  className="bg-primary-white w-52"
                  value={formData.DealType ? formData.DealType : 'NULL'}
                  placeholder="Deal Type"
                  options={dealTypeOptions}
                  isClearable
                  isSearchable
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Notes</div>
              </div>

              <div className="w-4/5">
                <TextArea
                  className={'mt-2.5 h-[58px] w-[498px]'}
                  value={formData.bookingNotes}
                  onChange={(value) => editContractModalData('bookingNotes', value.target.value, 'booking')}

                  
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Gross Potential</div>
              </div>
              <div className="w-4/5 flex items-center justify-between">
                <div className="flex  items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-1">£</div>
                  <TextInput
                    id={'venueText'}
                    
                    className="w-[100px]"
                    
                  />
                </div>
                <div className="flex  items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-1">Royalty</div>
                  <TextInput
                    id={'venueText'}
                    
                    className="w-[100px]"
                    value={formData.RoyaltyPercentage}
                    
                    onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
                  />
                  <div className=" text-primary-input-text font-bold text-sm ml-1">%</div>
                </div>

                <div className="flex  items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-1">Promoter</div>
                  <TextInput
                    id={'venueText'}
                    
                    className="w-[100px]"
                    
                  />
                  <div className=" text-primary-input-text font-bold text-sm ml-1">%</div>
                </div>
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Ticket Pricing Notes</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className={'mt-2.5 h-[58px] w-[498px]'}
                  value={formData.TicketPriceNotes}
                  onChange={(value) => editContractModalData('TicketPriceNotes', value.target.value, 'booking')}
                  placeholder="Ticket Pricing Notes"
                  
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Marketing Deal</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className={'mt-2.5 h-[58px] w-[498px]'}
                  value={formData.MarketingDealNotes}
                  onChange={(value) => editContractModalData('MarketingDealNotes', value.target.value, 'booking')}
                  placeholder="Marketing Deal"
                  
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Crew Notes</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className={'mt-2.5 h-[58px] w-[498px]'}
                  value={formData.CrewNotes}
                  onChange={(value) => editContractModalData('CrewNotes', value.target.value, 'booking')}
                  placeholder="Crew Notes"
                  
                />
              </div>
            </div>
            <div className="flex mt-2.5  ">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Barring Clause</div>
              </div>
              <div className="w-4/5 flex">
                <div className="w-1/3 flex">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Pre Show</div>
                  <div className=" text-primary-input-text  text-sm">Auto Pop</div>
                </div>
                <div className="w-1/3 flex justify-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Post Show</div>
                  <div className=" text-primary-input-text  text-sm">Auto Pop</div>
                </div>
                <div className="w-1/3 flex justify-end">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Miles</div>
                  <div className=" text-primary-input-text  text-sm">Auto Pop</div>
                </div>
                <div className="w-1/3 flex mt-1">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Venues</div>
                  <div className=" text-primary-input-text  text-sm">Auto Pop</div>
                </div>
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Exceptions</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className={'mt-2.5 h-[58px] w-[498px]'}
                  value={formData.Exceptions}
                  onChange={(value) => editContractModalData('Exceptions', value.target.value, 'contract')}

                  
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Contract Notes</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className={'mt-2.5 h-[58px] w-[498px]'}
                  value={formData.Notes}
                  onChange={(value) => editContractModalData('Notes', value.target.value, 'contract')}

                  
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Merchandise Notes</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className={'mt-2.5 h-[58px] w-[498px]'}
                  value={formData.MerchandiseNotes}
                  onChange={(value) => editContractModalData('MerchandiseNotes', value.target.value, 'booking')}

                  
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button className="ml-4 w-33" variant="primary" text="Add Attachments" />
              <Button className="ml-4 w-33" variant="primary" text="View as PDF" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-4 flex justify-end items-center">
        <Button onClick={() => handleCancelForm(false)} className="w-33" variant="secondary" text="Cancel" />
        <Button onClick={handleFormData} className="ml-4 w-33" variant="primary" text="Save and Close" />
      </div>
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

export default EditVenueContractModal;

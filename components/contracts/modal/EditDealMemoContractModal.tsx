import PopupModal from 'components/core-ui-lib/PopupModal';
import classNames from 'classnames';
import Select from 'components/core-ui-lib/Select';
import TextInput from 'components/core-ui-lib/TextInput';
import DateInput from 'components/core-ui-lib/DateInput';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Button from 'components/core-ui-lib/Button';
import { DealMemoContractFormData, ProductionDTO } from 'interfaces';
import { AddEditContractsState } from 'state/contracts/contractsState';
import { useState } from 'react';
// import { toISO } from 'services/dateService';
import useAxios from 'hooks/useAxios';

export const EditDealMemoContractModal = ({
  visible,
  onCloseDemoForm,
  productionJumpState,
  selectedTableCell,
  demoModalData,
}: {
  visible: boolean;
  onCloseDemoForm: () => void;
  productionJumpState: Partial<ProductionDTO>;
  selectedTableCell: AddEditContractsState;
  demoModalData: Partial<DealMemoContractFormData>;
}) => {
  const { fetchData } = useAxios();
  //      const [formData, setFormData] = useState<Partial<VenueContractFormData>>({
  //     ...initialEditContractFormData,
  //     ...selectedTableCell.contract,
  //   });
  // console.log("props==>", selectedTableCell)
  const [formData, setFormData] = useState<Partial<DealMemoContractFormData>>({
    ...demoModalData,
  });

  const editDemoModalData = async (key: string, value, type: string) => {
    const updatedFormData = {
      ...formData,
      [key]: value,
    };

    if (type === 'dealMemo') {
      setFormData({ ...updatedFormData });
    }

    // if(type === "dealMemo"){
    //     await fetchData({
    //         url: `/api/dealMemo/updateDealMemo/${selectedTableCell.contract.Id}`,
    //         method: 'POST',
    //         data: formData
    //       });
    // }
  };

  const saveDemoModalData = async () => {
    console.log('formData==>', formData);

    await fetchData({
      url: `/api/dealMemo/updateDealMemo/${selectedTableCell.contract.Id}`,
      method: 'POST',
      data: formData,
    });
  };

  return (
    <PopupModal
      show={visible}
      title="Deal Memo"
      titleClass={classNames('text-xl text-primary-navy font-bold -mt-2.5')}
      onClose={() => onCloseDemoForm()}
    >
      <div className="h-[80vh] w-[82vw] overflow-y-scroll">
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
          <div className="w-1/5">Show</div>
          <div className="w-4/5">
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
        <div className="flex items-center mt-4">
          <div className="w-1/5">Venue</div>
          <div className="w-4/5">
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
        <div className="flex items-center mt-4">
          <div className="w-1/5">Agreed Deal Memo Dated</div>
          <div className="w-4/5">
            <Select
              onChange={() => {
                return null;
              }}
              className="bg-primary-white w-5/12"
              placeholder="User Name Dropdown"
              options={[{ text: 'Select Assignee', value: null }]}
              isClearable
              isSearchable
            />
          </div>
        </div>
        <div>
          Please read this carefully to ensure it reflects the terms as agreed between{' '}
          {`<ORGANISATION - AUTO GENERATED>`} and {`<VENUE - AUTO GENERTAED>`}.
          <br />
          Please note that any terms not specifically mentioned here are still to be negotiated. If you have any
          standard conditions that you consider to be non-negotiable, or if you{' '}
          <span className="flex">
            have any queries about the Deal Memo, please contact{' '}
            <Select
              onChange={() => {
                return null;
              }}
              className="bg-primary-white w-3/12"
              placeholder="User Name Dropdown"
              options={[{ text: 'Select Assignee', value: null }]}
              isClearable
              isSearchable
            />
            ASAP
          </span>
        </div>
        <div>
          If we have requested anything that incurs a cost, it must be agreed with {`<ORGANISATION - AUTO GENERATED>`}{' '}
          prior to our arrival. No extras will be paid without a pre-authorisation
          {`(this includes internal access).`} Unless otherwise agreed, all staff calls will be scheduled within the
          contractual allowance- if you foresee any overtime, please advise immediately.
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Contacts</div>
        <div className="flex items-center">
          <div className="w-1/5">Company Contact</div>
          <div className="w-4/5">
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
        <div className="flex items-center">
          <div className="w-1/5">Phone</div>
          <div className="w-4/5">
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

          <div className="w-1/5">Email</div>
          <div className="w-4/5">
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
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Performance</div>
        <div className="flex items-center">
          <div className="w-1/5">Show Title</div>
          <div className="w-4/5 flex items-center">
            <div className=" text-primary-input-text  text-sm"> {productionJumpState.ShowName}</div>
            No. of Performances
            <div className=" text-primary-input-text  text-sm">{selectedTableCell.contract.performanceCount}</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Performance Date(s) and Time(s)</div>
          <div className="w-4/5 flex">
            <div>
              {[
                selectedTableCell.contract.performanceTimes && selectedTableCell.contract.performanceTimes.split(';'),
              ].map((times) => (
                <div key={times}>{times}</div>
              ))}

              {/* <TextInput
                                id={'venueText'}
                                className="w-[100px]"
                            // value={formData.RoyaltyPercentage}
                            // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
                            /> */}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Running Time</div>
          <div className="w-4/5 flex">
            <DateInput
              onChange={(value) =>
                // formData.DeMoRunningTime.toString() !== toISO(value) &&
                editDemoModalData('DeMoRunningTime', value, 'dealMemo')
              }
              value={formData.DeMoRunningTime}
            />
            Notes
            <TextInput
              id={'venueText'}
              className="w-[100px]"
              value={formData.DeMoRunningTimeNotes}
              onChange={(value) => editDemoModalData('DeMoRunningTimeNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Pre / Post Show Events</div>
          <div className="w-4/5 flex">
            <TextArea
              className={'h-[200px] w-[400px]'}
              value={formData.DeMoPrePostShowEvents}
              onChange={(value) => editDemoModalData('DeMoPrePostShowEvents', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Off-Stage Venue Curfew Time</div>
          <div className="w-4/5 flex">
            <DateInput
              onChange={(value) =>
                // formData.DeMoVenueCurfewTime.toString() !== toISO(value) &&
                editDemoModalData('DeMoVenueCurfewTime', value, 'dealMemo')
              }
              value={formData.DeMoVenueCurfewTime}
            />
            Notes
            <TextInput
              id={'venueText'}
              className="w-[100px]"
              value={formData.DeMoPerformanceNotes}
              onChange={(value) => editDemoModalData('DeMoPerformanceNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Venue</div>
        {['Venue Name', 'Phone', 'Email', 'Address', 'Programmer', 'Phone', 'Email'].map((input) => {
          return (
            <div key={input} className="flex items-center">
              <div className="w-1/5">{input}</div>
              <div className="w-4/5">
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
          );
        })}
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Deal</div>
        <div className="flex items-center">
          <div className="w-1/5">Royalty Off the top</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-[100px]"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />{' '}
            % PRS
            <TextInput
              id={'venueText'}
              className="w-[100px]"
              value={formData.DeMoPRSPercentage}
              type="number"
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
            %
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Guarantee</div>
          <div className="w-4/5 flex">
            <Select
              onChange={() => {
                // DeMoGuarantee
              }}
              className="bg-primary-white w-full"
              placeholder="User Name Dropdown"
              options={[{ text: 'Select Assignee', value: null }]}
              isClearable
              isSearchable
            />
            PRS
            <TextInput
              id={'venueText'}
              className="w-[100px]"
              value={formData.DeMoGuaranteeAmount}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
            %
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Calls</div>
          <div className="w-4/5 flex">
            <Select
              onChange={(value) => editDemoModalData('DeMoHasCalls', value, 'dealMemo')}
              className="bg-primary-white w-full"
              placeholder="User Name Dropdown"
              options={[{ text: 'Select Assignee', value: null }]}
              isClearable
              isSearchable
            />
            First Call
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
            5
            <TextInput
              id={'venueText'}
              className="w-[100px]"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
            %
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Promoter Split</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-[100px]"
              type="number"
              value={formData.DeMoPromoterSplitPercentage}
              onChange={(value) => editDemoModalData('DeMoPromoterSplitPercentage', value.target.value, 'dealMemo')}
            />
            % Venue Split
            <TextInput
              id={'venueText'}
              className="w-[100px]"
              value={formData.DeMoVenueSplitPercentage}
              onChange={(value) => editDemoModalData('DeMoVenueSplitPercentage', value.target.value, 'dealMemo')}
            />
            %
          </div>
        </div>
        {[
          ['Venue Rental', 'DeMoVenueRental', 'DeMoVenueRentalNotes'],
          ['Staffing Contra', 'DeMoStaffingContra', 'DeMoStaffingContraNotes'],
          ['Agreed Contra Items', 'DeMoAgreedContraItems', 'DeMoAgreedContraItemsNotes'],
        ].map((inputData) => {
          return (
            <div key="inputData" className="flex items-center">
              <div className="w-1/5">{inputData[0]}</div>
              <div className="w-4/5 flex">
                $
                <TextInput
                  id={'venueText'}
                  className="w-[100px]"
                  value={formData[inputData[1]]}
                  onChange={(value) => editDemoModalData(inputData[1], value.target.value, 'dealMemo')}
                />
                <TextInput
                  id={'venueText'}
                  className="w-auto"
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
          <div className="w-1/5">Box Office Manager</div>
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
        <div className="flex items-center">
          <div className="w-1/5">Phone</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Email</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Onsale Date</div>
          <div className="w-4/5 flex">
            <DateInput
              onChange={() => {
                return null;
              }}
              // value={formData.SignedDate}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Accounts COntact for Settlement</div>
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
        <div className="flex items-center">
          <div className="w-1/5">Phone</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Email</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Venue Capacity</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
            Sellable Capacity
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Mixer Desk Position</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
            No. of Seats
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Standard Seat Kills</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Prices {`(net of levies, commissions etc)`}</div>
        <div className="flex items-center">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex">
            <span>No. of Tickets</span>
            <span>Price</span>
          </div>
        </div>
        {['Premium', 'Concession', 'Family Tickets(per four)', 'Groups', 'Schools', 'Babes in Arms'].map(
          (inputData) => {
            return (
              <div key={inputData} className="flex items-center">
                <div className="w-1/5">{inputData} </div>
                <div className="w-4/5 flex">
                  <TextInput
                    id={'venueText'}
                    className="w-auto"
                    // value={formData.RoyaltyPercentage}
                    // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
                  />
                  $
                  <TextInput
                    id={'venueText'}
                    className="w-auto"
                    // value={formData.RoyaltyPercentage}
                    // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
                  />
                  <TextInput
                    id={'venueText'}
                    className="w-auto"
                    // value={formData.RoyaltyPercentage}
                    // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
                  />
                </div>
              </div>
            );
          },
        )}
        <div className="flex items-center">
          <div className="w-1/5">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
            $
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">
            Restoration Levy<div>{`(per ticket)`}</div>
          </div>
          <div className="w-4/5 flex">
            $
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
            Booking fees $
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
            Credit Card Commission
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
            %
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Transaction Charges</div>
          <div className="w-4/5 flex">
            <Select
              onChange={() => {
                // DeMoTxnChargeOption
              }}
              className="bg-primary-white w-full"
              placeholder="User Name Dropdown"
              options={[{ text: 'Select Assignee', value: null }]}
              isClearable
              isSearchable
            />
            $
            <TextInput
              id={'venueText'}
              className="w-auto"
              value={formData.DeMoTxnChargeAmount}
              onChange={(value) => editDemoModalData('DeMoTxnChargeAmount', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Agreed Disocunts</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              value={formData.DeMoAgreedDiscounts}
              onChange={(value) => editDemoModalData('DeMoAgreedDiscounts', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex">
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
            <div key={inputData[0]} className="flex items-center">
              <div className="w-1/5">{inputData[0]}</div>
              <div className="w-4/5">
                <TextInput
                  id={'venueText'}
                  className="w-full"
                  value={formData[inputData[1]]}
                  onChange={(value) => editDemoModalData(inputData[1], value.target.value, 'dealMemo')}
                />
              </div>
            </div>
          );
        })}
        <div className="flex items-center">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex">e.g. Wheelchair / Restricted View / House Seats / Press</div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Age Limit / Guidance </div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              value={formData.DeMoAgeNotes}
              onChange={(value) => editDemoModalData('DeMoAgeNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Sales Report Frequency</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
            If Weekly, on
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
        <div className="flex items-center">
          <div className="w-1/5">to be sent to</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
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
          <div className="w-1/5">Marketing Manager</div>
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
        <div className="flex items-center">
          <div className="w-1/5">Phone</div>
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
        <div className="flex items-center">
          <div className="w-1/5">Email</div>
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
        <div className="flex items-center">
          <div className="w-1/5">Brochure Deadline</div>
          <div className="w-4/5 flex">
            <DateInput
              onChange={() => {
                return null;
              }}
              value={formData.DeMoBrochureDeadline}
            />
            Final Proof by
            <DateInput
              onChange={() => {
                return null;
              }}
              // value={formData.SignedDate}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Print Requirements</div>
          <div className="w-4/5 flex">
            <TextArea
              className={'h-[200px] w-[400px]'}
              value={formData.DeMoPrintReqs}
              onChange={(value) => editDemoModalData('DeMoPrintReqs', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Print Delivery Address</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Local Marketing Budget</div>
          <div className="w-4/5 flex">
            $
            <TextInput
              id={'venueText'}
              className="w-auto"
              value={formData.DeMoLocalMarketingBudget}
              onChange={(value) => editDemoModalData('DeMoLocalMarketingBudget', value.target.value, 'dealMemo')}
            />
            Local Marketing Contra $
            <TextInput
              id={'venueText'}
              className="w-auto"
              value={formData.DeMoLocalMarketingContra}
              onChange={(value) => editDemoModalData('DeMoLocalMarketingContra', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex">
            Any expenditure needs pre-approval from {`<AUTO GENERATE ORGANISATION NAME>`}
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Programmes and Merchandise</div>
        <div className="flex items-center">
          <div className="w-1/5">Seller</div>
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
        <div className="flex items-center">
          <div className="w-1/5">Items to be Sold</div>
          <div className="w-4/5 flex">
            <Checkbox
              className="flex flex-row-reverse"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              onChange={() => {
                // DeMoSellProgrammes
              }}
            />
            Programmes
            <Checkbox
              className="flex flex-row-reverse"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              onChange={() => {
                // DeMoSellMerch
              }}
            />
            Merchandise
            <TextArea
              className={'h-[200px] w-[400px]'}
              value={formData.DeMoSellNotes}
              onChange={(value) => editDemoModalData('DeMoSellNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">View Commission</div>
          <div className="w-4/5 flex">
            Programmes
            <TextInput
              id={'venueText'}
              className="w-auto"
              value={formData.DeMoSellProgCommPercent}
              onChange={(value) => editDemoModalData('DeMoSellProgCommPercent', value.target.value, 'dealMemo')}
            />
            % Merchandise
            <TextInput
              id={'venueText'}
              className="w-auto"
              value={formData.DeMoSellMerchCommPercent}
              onChange={(value) => editDemoModalData('DeMoSellMerchCommPercent', value.target.value, 'dealMemo')}
            />
            Fixed Pitch Fee $
            <TextInput
              id={'venueText'}
              className="w-auto"
              value={formData.DeMoSellPitchFee}
              onChange={(value) => editDemoModalData('DeMoSellPitchFee', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Technical</div>
        <div className="flex items-center">
          <div className="w-1/5">Technical Manager</div>
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
        <div className="flex items-center">
          <div className="w-1/5">Phone</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-auto"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Email</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-full"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Company Arrival Date / Time</div>
          <div className="w-4/5 flex">
            <DateInput
              onChange={() => {
                return null;
              }}
              // value={formData.SignedDate}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Stage Door What3Words</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-full"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
            Loading Bay What3Words
            <TextInput
              id={'venueText'}
              className="w-full"
              // value={formData.RoyaltyPercentage}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5"> </div>
          <div className="w-4/5 flex">Venue to Provide Visiting Company to Provide</div>
        </div>
        {['Lighting', 'Sound', 'Other', 'Technical Staff'].map((inputData) => {
          return (
            <div key={inputData} className="flex items-center">
              <div className="w-1/5">{inputData} </div>
              <div className="w-4/5 flex">
                <TextInput
                  id={'venueText'}
                  className="w-full"
                  // value={formData.RoyaltyPercentage}
                  // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
                />

                <TextInput
                  id={'venueText'}
                  className="w-full"
                  // value={formData.RoyaltyPercentage}
                  // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
                />
              </div>
            </div>
          );
        })}
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Misc.</div>
        <div className="flex items-center">
          <div className="w-1/5">No. of Dressing Rooms</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-full"
              value={formData.DeMoNumDressingRooms}
              onChange={(value) => editDemoModalData('DeMoNumDressingRooms', value.target.value, 'demoContract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Laundry Facilities</div>
          <div className="w-4/5 flex">
            Washer
            <Checkbox
              className="flex flex-row-reverse"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              onChange={() => {
                // DeMoNumFacilitiesLaundry
              }}
            />
            \ Drier
            <Checkbox
              className="flex flex-row-reverse"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              onChange={() => {
                // DeMoNumFacilitiesDrier
              }}
            />
            Laundry Room
            <Checkbox
              className="flex flex-row-reverse"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              onChange={() => {
                // DeMoNumFacilitiesLaundryRoom
              }}
            />
            <TextInput
              id={'venueText'}
              className="w-full"
              value={formData.DeMoNumFacilitiesNotes}
              onChange={(value) => editDemoModalData('DeMoNumFacilitiesNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Catering</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-full"
              value={formData.DeMoNumCateringNotes}
              onChange={(value) => editDemoModalData('DeMoNumCateringNotes', value.target.value, 'dealMemo')}
            />
          </div>
        </div>
        <hr className="bg-primary h-[3px] mt-4 mb-4" />
        <div className="text-xl text-primary-navy font-bold -mt-2.5">Contract / Settlement</div>
        <div className="flex items-center">
          <div className="w-1/5">Barring Clause</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-full"
              value={formData.DeMoBarringClause}
              onChange={(value) => editDemoModalData('DeMoBarringClause', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Advance Payment</div>
          <div className="w-4/5 flex">
            <Select
              onChange={() => {
                // DeMoAdvancePaymentRequired
              }}
              className="bg-primary-white w-full"
              placeholder="User Name Dropdown"
              options={[{ text: 'Select Assignee', value: null }]}
              isClearable
              isSearchable
            />
            If Yes, Amount $
            <TextInput
              id={'venueText'}
              className="w-full"
              value={formData.DeMoAdvancePaymentAmount}
              onChange={(value) => editDemoModalData('DeMoAdvancePaymentAmount', value.target.value, 'contract')}
            />
            Date Payment to be Made
            <DateInput
              onChange={() => {
                return null;
              }}
              value={formData.DeMoAdvancePaymentDueBy}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">Settlement Terms</div>
          <div className="w-4/5 flex">
            Payment to be made Same Day
            <Checkbox
              className="flex flex-row-reverse"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              onChange={() => {
                return null;
              }}
            />
            or within
            <TextInput
              id={'venueText'}
              className="w-full"
              value={formData.DeMoSettlementDays}
              onChange={(value) => editDemoModalData('DeMoSettlementDays', value.target.value, 'contract')}
            />
            days
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/5">VAT No.</div>
          <div className="w-4/5 flex">
            <TextInput
              id={'venueText'}
              className="w-full"
              // value={formData.DeMoContractClause}
              // onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
            />
          </div>
        </div>
        <div>
          <div>Please include the following clause(s) in the contract:</div>
          <TextArea
            className={'h-[200px] w-[400px]'}
            value={formData.DeMoContractClause}
            onChange={(value) => editDemoModalData('DeMoContractClause', value.target.value, 'contract')}
          />
        </div>
      </div>
      <div className="w-full mt-4 flex justify-end items-center">
        <Button onClick={() => null} className="w-33" variant="secondary" text="Cancel" />
        <Button onClick={() => null} className="ml-4 w-33" variant="primary" text="Export to Excel" />

        <Button onClick={() => saveDemoModalData()} className="ml-4 w-33" variant="primary" text="Save and Close" />
      </div>
    </PopupModal>
  );
};

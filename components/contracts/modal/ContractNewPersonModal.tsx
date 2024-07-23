import { Button, Checkbox, DateInput, Select, TextInput } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { AddNewPersonInput } from '../AddNewPersonInputs';
import { addNewPersonInputData, agencyDetailsData, emergecnyContactData, salaryDetailsData } from '../utils';
import { booleanOptions } from 'config/contracts';

export const ContractNewPersonModal = ({ openNewPersonContract }: { openNewPersonContract: boolean }) => {
  return (
    <PopupModal
      show={openNewPersonContract}
      title="Add New Person"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      // onClose={handleModalCancel}
      // hasOverlay={showSalesSnapshot}
    >
      <div className="h-[80vh] w-[82vw] overflow-y-scroll">
        {addNewPersonInputData.map((newPersonData) => {
          return (
            <>
              <AddNewPersonInput newPersonData={newPersonData} />
            </>
          );
        })}
        <div className="flex mt-2 items-center">
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Town</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                className=" text-primary-input-text font-bold w-full"
                disabled
                // value={contactsData.phone}
                // placeholder={
                //   contactsData.phone ? 'Add details to the Contact Database' : 'Please select from the dropdown above'
                // }
              />
            </div>
          </div>

          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold  mr-4 w-2/5">Passport Expiry Date</div>
            <div className="w-[22vw] ml-4 flex items-center">
              <DateInput
              //   onChange={(value) => {
              //     editDemoModalData('DeMoOnSaleDate', value, 'dealMemo');
              //   }}
              //   value={formData.DeMoOnSaleDate}
              />
              <div className="text-xs text-primary-input-text font-bold ml-4">
                (<span className="underline">NOTE:</span> Expiry date is 10 years from{' '}
                <span className="text-red-500 underline">PASSPORT ISSUE DATE</span>)
              </div>
            </div>
          </div>
        </div>

        <div className="flex mt-2 items-center">
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Postcode</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                className=" text-primary-input-text font-bold w-full"
                disabled
                // value={contactsData.phone}
                // placeholder={
                //   contactsData.phone ? 'Add details to the Contact Database' : 'Please select from the dropdown above'
                // }
              />
            </div>
          </div>

          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold  mr-4 w-2/5">Eligible to Work in the UK</div>
            <div className="w-[22vw] ml-4 flex items-center">
              <Select
                //   onChange={(value) => {
                // editDemoModalData('DeMoAdvancePaymentRequired', value === 1, 'dealMemo');
                //   }}
                className="bg-primary-white w-40"
                placeholder="Please select..."
                options={booleanOptions}
                isClearable
                isSearchable
                //   value={formData.DeMoAdvancePaymentRequired}
              />
              <div className="text-primary-input-text font-bold ml-2 mr-2">Checked</div>
              <Select
                //   onChange={(value) => {
                //     editDemoModalData('DeMoAdvancePaymentRequired', value === 1, 'dealMemo');
                //   }}
                className="bg-primary-white w-40"
                placeholder="Please select..."
                options={booleanOptions}
                isClearable
                isSearchable
                //   value={formData.DeMoAdvancePaymentRequired}
              />
            </div>
          </div>
        </div>

        <div className="flex mt-2 items-center">
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-[10vw]">Country</div>
            <div className="w-[22vw] ml-8">
              <Select
                //   onChange={(value) => {
                //     editDemoModalData('DeMoGuarantee', value === 1, 'dealMemo');
                //   }}
                className="bg-primary-white w-26 mr-3"
                placeholder="Please select.."
                options={booleanOptions}
                isClearable
                isSearchable
                //   value={formData.DeMoGuarantee}
              />
            </div>
          </div>

          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold  mr-4 w-2/5">
              Is FEU (Foreign Entertainer Union) permission required
            </div>
            <div className="w-[22vw] ml-4">
              <Select
                //   onChange={(value) => {
                //     editDemoModalData('DeMoGuarantee', value === 1, 'dealMemo');
                //   }}
                className="bg-primary-white w-40 mr-3"
                placeholder="Please select.."
                options={booleanOptions}
                isClearable
                isSearchable
                //   value={formData.DeMoGuarantee}
              />
            </div>
          </div>
        </div>
        {['General Notes', 'Relevant Health Details', 'Advisory Notes'].map((input) => {
          return (
            <>
              <div className="flex items-center mb-2">
                <div className="w-[13vw] text-primary-input-text font-bold">{input}</div>
                <div className="w-4/5">
                  <TextInput
                    id="venueText"
                    className="w-full text-primary-input-text font-bold"
                    //   value={venueData ? venueData[input[1]] : ''}
                    disabled={true}
                    placeholder="Notes"
                  />
                </div>
              </div>
            </>
          );
        })}

        <div className="flex mt-2 items-center">
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-[10vw]">Type Of Work</div>
            <div className="w-[22vw] ml-8">
              <Select
                //   onChange={(value) => {
                //     editDemoModalData('DeMoGuarantee', value === 1, 'dealMemo');
                //   }}
                className="bg-primary-white w-26 mr-3"
                placeholder="Please select.."
                options={booleanOptions}
                isClearable
                isSearchable
                //   value={formData.DeMoGuarantee}
              />
            </div>
          </div>
        </div>
        {['Other Type Of work', 'Notes Field'].map((type) => {
          return (
            <div className="flex mt-2 items-center" key={type}>
              <div className="w-1/2 flex items-center">
                <div className="text-primary-input-text font-bold mr-4 w-[11vw]"> </div>
                <div className="w-[22vw] ml-4">
                  <TextInput
                    className=" text-primary-input-text font-bold w-full"
                    disabled
                    // value={contactsData.phone}
                    // placeholder={
                    //   contactsData.phone ? 'Add details to the Contact Database' : 'Please select from the dropdown above'
                    // }
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex">
          <div className="text-xl text-primary-navy font-bold w-[50vw]">Emergency Contact 1</div>
          <div className="text-xl text-primary-navy font-bold w-[50vw]">Emergency Contact 2</div>
        </div>
        {emergecnyContactData.map((newPersonData) => {
          return (
            <>
              <AddNewPersonInput newPersonData={newPersonData} />
            </>
          );
        })}
        <div className="flex">
          <div className="text-xl text-primary-navy font-bold w-[50vw]">Agency Details</div>
        </div>
        {agencyDetailsData.map((newPersonData) => {
          return (
            <>
              <AddNewPersonInput newPersonData={newPersonData} />
            </>
          );
        })}
        <div className="flex">
          <div className="text-xl text-primary-navy font-bold w-[50vw]">Salary Details</div>
        </div>

        <div className="flex">
          <div className="text-m text-primary-navy font-bold w-[50vw]">Salary</div>
          <div className="text-m text-primary-navy font-bold w-[50vw]">Expenses</div>
        </div>

        <div className="flex">
          <div className="flex w-[50vw]">
            <div className="text-sm text-primary-navy font-bold">Salary to be Paid to</div>

            <Checkbox
              className="flex flex-row-reverse mr-2"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              // onChange={(value) => editDemoModalData('DeMoNumFacilitiesLaundry', value.target.value, 'dealMemo')}
              // checked={formData.DeMoNumFacilitiesLaundry}
            />
            <div className="text-primary-input-text font-bold mr-2 ml-6">Agent</div>
          </div>
          <div className="flex w-[50vw]">
            <div className="text-sm text-primary-navy font-bold ">Expenses to be paid to</div>
            <Checkbox
              className="flex flex-row-reverse mr-2"
              labelClassName="!text-base"
              id="includeExcludedVenues"
              // onChange={(value) => editDemoModalData('DeMoNumFacilitiesLaundry', value.target.value, 'dealMemo')}
              // checked={formData.DeMoNumFacilitiesLaundry}
            />
            <div className="text-primary-input-text font-bold mr-2 ml-6">Company Member</div>
          </div>
        </div>
        {salaryDetailsData.map((newPersonData) => {
          return (
            <>
              <AddNewPersonInput newPersonData={newPersonData} />
            </>
          );
        })}
      </div>
      <div className="w-full mt-4 flex justify-end items-center">
        <Button className="w-33" variant="secondary" text="Cancel" />
        <Button className="ml-4 w-33" variant="primary" text="Save and Return to Contracts" />
      </div>
    </PopupModal>
  );
};

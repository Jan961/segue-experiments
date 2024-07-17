import { DateInput, Select, TextInput } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { AddNewPersonInput } from '../AddNewPersonInputs';
import { addNewPersonInputData } from '../utils';
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
      <div className="h-[80vh] w-[82vw]">
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
      </div>
    </PopupModal>
  );
};

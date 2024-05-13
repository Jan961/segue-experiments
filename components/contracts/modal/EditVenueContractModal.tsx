import PopupModal from 'components/core-ui-lib/PopupModal';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
import Select from 'components/core-ui-lib/Select';
import DateInput from 'components/core-ui-lib/DateInput';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Checkbox from 'components/core-ui-lib/Checkbox';
import TextInput from 'components/core-ui-lib/TextInput';
import { allStatusOptions } from 'config/contracts';

const EditVenueContractModal = () => {
  return (
    <PopupModal
      show={true}
      title="Prod code"
      titleClass={classNames('text-xl text-primary-navy font-bold -mt-2.5')}
      //   onClose={handleModalCancel}
    >
      <div className="h-auto w-auto flex">
        <div className="w-[423px] h-[1008px] rounded border-2 border-secondary mr-2 p-3 bg-primary-blue bg-opacity-15">
          <div className=" text-primary-input-text font-bold text-lg">Deal Memo</div>
          <div className=" text-primary-input-text font-bold text-sm mt-1.5">Deal Memo Status</div>
          <Select
            onChange={() => {
              return null;
            }}
            className="bg-primary-white w-52"
            // value={filter.dealMemoStatusDropDown}
            // disabled={!productionId}
            placeholder="Deal Memo Status"
            options={allStatusOptions}
            isClearable
            isSearchable
            // label="hhj"
          />

          <div className=" text-primary-input-text font-bold text-sm mt-6">Completed By</div>
          <Select
            onChange={() => {
              return null;
            }}
            className="bg-primary-white w-52"
            // value={filter.dealMemoStatusDropDown}
            // disabled={!productionId}
            placeholder="Deal Memo Status"
            options={allStatusOptions}
            isClearable
            isSearchable
            // label="hhj"
          />

          <div className=" text-primary-input-text font-bold text-sm mt-6">Approved By</div>
          <Select
            onChange={() => {
              return null;
            }}
            className="bg-primary-white w-52"
            // value={filter.dealMemoStatusDropDown}
            // disabled={!productionId}
            placeholder="Deal Memo Status"
            options={allStatusOptions}
            isClearable
            isSearchable
            // label="hhj"
          />
          <div className="flex mt-2.5 items-center mt-6">
            <div className=" text-primary-input-text font-bold text-sm">Date Issued</div>
            <DateInput
              onChange={() => {
                return null;
              }}
            />

            <div className=" text-primary-input-text font-bold text-sm">Date Returned</div>

            <DateInput
              onChange={() => {
                return null;
              }}
            />
          </div>

          <div className=" text-primary-input-text font-bold text-sm mt-6">Notes</div>
          <TextArea
            className={'h-[580px] w-[400px]'}
            // value={changeNotes}
            // placeholder="Notes Field"
            // onChange={(e) => setChangeNotes(e.target.value)}
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
              <div className=" text-primary-input-text text-sm">status</div>
            </div>
          </div>
          <div className="flex mt-2.5">
            <div className=" text-primary-input-text font-bold text-sm">Perf / Day</div>
            <div className=" text-primary-input-text text-sm ml-5">Auto Populated</div>
            <div className=" text-primary-input-text font-bold text-sm ml-4">Times</div>
            <div className=" text-primary-input-text font-bold text-sm ml-2">1</div>
            <div className=" text-primary-input-text text-sm ml-1">Auto Populated</div>
            <div className=" text-primary-input-text font-bold text-sm ml-2">2</div>
            <div className=" text-primary-input-text text-sm ml-1">Auto Populated</div>
          </div>
          <div className="flex mt-2.5 items-center">
            <div className="w-1/5">
              <div className=" text-primary-input-text font-bold text-sm">Contract Status</div>
            </div>
            <div className="w-4/5 flex">
              <Select
                onChange={() => {
                  return null;
                }}
                className="bg-primary-white w-52"
                // value={filter.dealMemoStatusDropDown}
                // disabled={!productionId}
                placeholder="Deal Memo Status"
                options={allStatusOptions}
                isClearable
                isSearchable
                // label="hhj"
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
                // value={filter.dealMemoStatusDropDown}
                // disabled={!productionId}
                placeholder="User Name Dropdown"
                options={allStatusOptions}
                isClearable
                isSearchable
                // label="hhj"
              />

              <div className="flex items-center">
                <div className=" text-primary-input-text font-bold text-sm mr-2">Signed On</div>

                <DateInput
                  onChange={() => {
                    return null;
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex mt-2.5 items-center">
            <div className="w-1/5">
              <div className=" text-primary-input-text font-bold text-sm">Returned to Venue</div>
            </div>
            <div className="w-4/5 flex justify-between">
              <Select
                onChange={() => {
                  return null;
                }}
                className="bg-primary-white w-52"
                // value={filter.dealMemoStatusDropDown}
                // disabled={!productionId}
                placeholder="User Name Dropdown"
                options={allStatusOptions}
                isClearable
                isSearchable
                // label="hhj"
              />
              <div className="flex items-center">
                <div className=" text-primary-input-text font-bold text-sm mr-2">Returned from Venue</div>

                <DateInput
                  onChange={() => {
                    return null;
                  }}
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
                // label="Include Excluded Venues"
                id="includeExcludedVenues"
                // name="includeExcludedVenues"
                // checked={includeExcluded}
                // onChange={(e) => handleOnChange({ includeExcluded: e.target.checked })}
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
                // label="Include Excluded Venues"
                id="includeExcludedVenues"
                // name="includeExcludedVenues"
                // checked={includeExcluded}
                // onChange={(e) => handleOnChange({ includeExcluded: e.target.checked })}
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
                // label="Include Excluded Venues"
                id="includeExcludedVenues"
                // name="includeExcludedVenues"
                // checked={includeExcluded}
                // onChange={(e) => handleOnChange({ includeExcluded: e.target.checked })}
                onChange={() => {
                  return null;
                }}
              />
            </div>
          </div>
          {/* <div className="flex mt-2.5 items-center">
            <div className="w-1/5">
            <div className=" text-primary-input-text font-bold text-sm">Deal Type</div>
            </div>
            <div className="w-4/5">
            <Select
              onChange={() => {return null}}
              className="bg-primary-white w-52"
              // value={filter.dealMemoStatusDropDown}
              // disabled={!productionId}
              placeholder="Deal Type Dropdown"
              options={allStatusOptions}
              isClearable
              isSearchable
            // label="hhj"
            />
            </div>
          </div> */}

          <div className="flex mt-2.5 items-center">
            <div className="w-1/5">
              <div className=" text-primary-input-text font-bold text-sm">Deal Type</div>
            </div>
            <div className="w-4/5 flex">
              <Select
                onChange={() => {
                  return null;
                }}
                className="bg-primary-white w-52"
                // value={filter.dealMemoStatusDropDown}
                // disabled={!productionId}
                placeholder="Deal Type DropDown"
                options={allStatusOptions}
                isClearable
                isSearchable
                // label="hhj"
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
                // value={changeNotes}
                // placeholder="Notes Field"
                // onChange={(e) => setChangeNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="flex mt-2.5 items-center">
            <div className="w-1/5">
              <div className=" text-primary-input-text font-bold text-sm">Gross Potential</div>
            </div>
            <div className="w-4/5 flex items-center justify-between">
              <div className="flex  items-center">
                <div className=" text-primary-input-text font-bold text-sm">£</div>
                <TextInput
                  id={'venueText'}
                  // disabled={!ProductionId}
                  // placeholder="Search bookings..."
                  className="w-[100px]"
                  // iconName="search"
                  // value={filter.venueText}
                  // onChange={onChange}
                />
              </div>
              <div className="flex  items-center">
                <div className=" text-primary-input-text font-bold text-sm">Royalty</div>
                <TextInput
                  id={'venueText'}
                  // disabled={!ProductionId}
                  // placeholder="Search bookings..."
                  className="w-[100px]"
                  // iconName="search"
                  // value={filter.venueText}
                  // onChange={onChange}
                />
                <div className=" text-primary-input-text font-bold text-sm">%</div>
              </div>

              <div className="flex  items-center">
                <div className=" text-primary-input-text font-bold text-sm">Promoter</div>
                <TextInput
                  id={'venueText'}
                  // disabled={!ProductionId}
                  // placeholder="Search bookings..."
                  className="w-[100px]"
                  iconName="search"
                  // value={filter.venueText}
                  // onChange={onChange}
                />
                <div className=" text-primary-input-text font-bold text-sm">%</div>
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
                // value={changeNotes}
                placeholder="Notes Field"
                // onChange={(e) => setChangeNotes(e.target.value)}
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
                // value={changeNotes}
                placeholder="Notes Field"
                // onChange={(e) => setChangeNotes(e.target.value)}
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
                // value={changeNotes}
                placeholder="Notes Field"
                // onChange={(e) => setChangeNotes(e.target.value)}
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
                // value={changeNotes}
                placeholder="Notes Field"
                // onChange={(e) => setChangeNotes(e.target.value)}
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
                // value={changeNotes}
                placeholder="Notes Field"
                // onChange={(e) => setChangeNotes(e.target.value)}
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
                // value={changeNotes}
                placeholder="Notes Field"
                // onChange={(e) => setChangeNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button className="ml-4 w-33" variant="primary" text="Add Attachments" />
            <Button className="ml-4 w-33" variant="primary" text="View as PDF" />
          </div>
        </div>
      </div>
      <div className="w-full mt-4 flex justify-end items-center">
        <Button className="w-33" variant="secondary" text="Cancel" />
        <Button className="ml-4 w-33" variant="primary" text="Save and Close" />
      </div>
    </PopupModal>
  );
};

export default EditVenueContractModal;

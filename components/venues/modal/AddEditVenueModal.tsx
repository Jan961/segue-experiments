import { styleProps, venueContractDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Icon from 'components/core-ui-lib/Icon';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import Table from 'components/core-ui-lib/Table';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import Tooltip from 'components/core-ui-lib/Tooltip';
import Typeahead from 'components/core-ui-lib/Typeahead/Typeahead';

export default function AddEditVenueModal() {
  const dummyVenueContractData = [
    {
      VenueRole: 'Manager',
      VenueFirstName: 'John',
      VenueLastName: 'Doe',
      VenuePhone: '123-456-7890',
      VenueEmail: 'john.doe@example.com',
      delete: 'Delete Button 1',
    },
    {
      VenueRole: 'Coordinator',
      VenueFirstName: 'Jane',
      VenueLastName: 'Smith',
      VenuePhone: '987-654-3210',
      VenueEmail: 'jane.smith@example.com',
      delete: 'Delete Button 2',
    },
    // Add more dummy data as needed
  ];
  return (
    <>
      <PopupModal title="Add / Edit Venue" show panelClass="relative" titleClass="text-xl text-primary-navy ">
        <div className="w-[1026px]">
          <h2 className="text-xl text-primary-navy font-bold">Main</h2>
          <div className="grid grid-cols-2 gap-5">
            <label htmlFor="" className="flex flex-row gap-5 justify-between  ">
              Venue Code
              <Tooltip
                width="w-[200px]"
                position="right"
                body="Venue Code is the first three letters of the town followed by the first three letters of the venue. eg. King's Theatre, Glasgow would have the code GLAKIN."
              >
                <TextInput placeHolder="Enter Venue Code" type="" className="w-[364px]" iconName="info-circle-solid" />
              </Tooltip>
            </label>
            <Select label="Venue Status" placeHolder="<Venue Status DROPDOWN>" className="w-[430px] place-self-end " />

            <label htmlFor="" className="flex flex-row gap-5 justify-between ">
              Venue Name
              <TextInput placeHolder="Enter Venue Name" type="" className="w-[364px]" />
            </label>
            <div className="flex flex-row justify-between pl-20">
              <Checkbox
                label="VAT Indicator"
                id={''}
                onChange={function (e: any): void {
                  throw new Error('Function not implemented.', e);
                }}
              />
              <Checkbox
                label="Culturally Excempt Venue"
                id={''}
                onChange={function (e: any): void {
                  throw new Error('Function not implemented.', e);
                }}
              />
            </div>
            <label className="flex flex-row gap-5 justify-between ">
              Venue Family
              <Typeahead
                placeholder="Venue Family Dropdown"
                className="w-[364px]"
                onChange={function (value: string | number): void {
                  console.log('value :>> ', value);
                  throw new Error('Function not implemented.');
                }}
                options={[]}
              />
            </label>
            <label className="flex flex-row gap-5 justify-between  ">
              Currency
              <Typeahead
                className="mr-[175px]"
                placeholder="Currency Dropdown"
                onChange={function (value: string | number): void {
                  console.log('value :>> ', value);
                  throw new Error('Function not implemented.');
                }}
                options={[]}
              />
            </label>
            <label htmlFor="" className="flex flex-row gap-5 justify-between ">
              Capacity
              <TextInput placeHolder="Enter Capacity" type="" className="w-[364px]" />
            </label>
            <label htmlFor="" className="flex flex-row gap-5 justify-between ">
              Town Population
              <TextInput placeHolder="Enter Town Population" type="" className="w-[364px]" />
            </label>
            <label
              htmlFor=""
              className="grid grid-cols-[100px_minmax(500px,_1fr)] flex-row gap-10 justify-between col-span-2 w-full"
            >
              <span>Website</span>
              <TextInput
                placeHolder="Enter Venue Website"
                type=""
                className="w-full justify-between"
                inputClassName="w-full"
              />
            </label>
            <label
              htmlFor=""
              className="grid grid-cols-[100px_minmax(500px,_1fr)] flex-row gap-10 justify-between col-span-2 w-full"
            >
              Notes
              <TextArea placeHolder="Notes Field" className="w-full max-h-40 min-h-[50px] h-40 justify-between" />
            </label>
          </div>
          <h2 className="text-xl text-primary-navy font-bold pt-7">Addresses</h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-5">
              <h2 className="text-base text-primary-input-text font-bold pt-7">Primary</h2>
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">Address 1</p>
                <TextInput
                  placeHolder="Enter Address 1"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">Address 2</p>
                <TextInput
                  placeHolder="Enter Address 2"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">Address 3</p>
                <TextInput
                  placeHolder="Enter Address 3"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">Town</p>
                <TextInput
                  placeHolder="Enter Town"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">Postcode</p>
                <TextInput
                  placeHolder="Enter Postcode"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>

              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">Country</p>
                <TextInput
                  placeHolder="Enter Country"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">What3Words Stage Door</p>
                <TextInput
                  placeHolder="what.three.words"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">What3Words Loading</p>
                <TextInput
                  placeHolder="what.three.words"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
            </div>
            <div className="flex flex-col gap-5">
              <h2 className="text-base text-primary-input-text font-bold pt-7">Delivery</h2>
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">Address 1</p>
                <TextInput
                  placeHolder="Enter Address 1"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">Address 2</p>
                <TextInput
                  placeHolder="Enter Address 2"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">Address 3</p>
                <TextInput
                  placeHolder="Enter Address 3"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">Town</p>
                <TextInput
                  placeHolder="Enter Town"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">Postcode</p>
                <TextInput
                  placeHolder="Enter Postcode"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>

              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-full">
                <p className="min-w-fit">Country</p>
                <TextInput
                  placeHolder="Enter Country"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <div className="flex flex-row items-center gap-4 justify-end ">
                <p>Exclude from Barring Check and Venue Gap Suggestions</p>
                <Tooltip
                  width="w-[200px]"
                  body="Selected venues will be excluded from Venue Gap Suggestions and Barring Checks. Selecting this check box will include this venue in that exclusion. This exclusion can be unselected when running the Suggestions or Barring Checks."
                  position="right"
                >
                  <Icon iconName="info-circle-solid" />
                </Tooltip>
                <Checkbox
                  id={''}
                  onChange={function (e: any): void {
                    throw new Error('Function not implemented.', e);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="pt-7">
            <div className="flex flex-row items-cente justify-between  pb-5">
              <h2 className="text-xl text-primary-navy font-bold ">Venue Contacts</h2>
              <Button variant="primary" text="Add New Contact" />
            </div>
            <Table columnDefs={venueContractDefs} rowData={dummyVenueContractData} styleProps={styleProps} />
          </div>
          <h2 className="text-xl text-primary-navy font-bold pt-7">Technical</h2>
        </div>
      </PopupModal>
    </>
  );
}

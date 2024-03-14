import { barredVenues, styleProps, venueContractDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Icon from 'components/core-ui-lib/Icon';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import Table from 'components/core-ui-lib/Table';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { useState } from 'react';

export default function AddEditVenueModal() {
  const getRowStyle = (params) => {
    if (params.node.rowIndex === 0) {
      // Change 'red' to your desired background color
      return { background: '#fad0cc' };
    }
    return null;
  };
  const dummyVenueContractData = [
    {
      VenueRole: 'Enter Job title',
      VenueFirstName: 'Enter First Name',
      VenueLastName: 'Enter Last Name',
      VenuePhone: 'Enter Phone No.',
      VenueEmail: 'Enter Email Address',
      delete: true,
    },
    {
      VenueRole: 'Box Office Default',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Box Office Manager',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Finance Manager',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Front of House Manager',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Marketing Contact',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Marketing Manager',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Operations Manager',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Stage Door',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Technical Manager',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Venue Chief LX',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Venue Head of Sound',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Venue Manager',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Venue Programming',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    {
      VenueRole: 'Venue Stage Manager',
      VenueFirstName: 'First Name',
      VenueLastName: 'Last Name',
      VenuePhone: '(00) 0000 000000',
      VenueEmail: 'name@theatrecompany.com',
      delete: false,
    },
    // Add more dummy data as needed
  ];

  const barredVenuesData = [
    {
      venueOptions: 'test',
    },
    {
      venueOptions: 'test-2',
    },
    // Add more dummy data as needed
  ];
  const [formData, setFormData] = useState({
    venueCode: '',
    venueName: '',
    venueStatus: '',
  });

  // const handleInputChange = (field, value) => {
  //   setFormData({
  //     ...formData,
  //     [field]: value,
  //   });
  // };
  const handleInputChange = (field, value) => {
    let sanitizedValue = value;

    // Additional logic for Venue Code field
    if (field === 'venueCode') {
      // Ensure only letters are allowed
      sanitizedValue = sanitizedValue.replace(/[^a-zA-Z]/g, '');

      // // Capitalize the value
      // sanitizedValue = sanitizedValue.toUpperCase();
    }

    setFormData({
      ...formData,
      [field]: sanitizedValue,
    });
  };

  const handleSaveAndClose = () => {
    // Validate Venue Name
    if (!formData.venueName) {
      alert('Venue Name is required.');
      return;
    }

    // Validate Venue Code
    if (!formData.venueCode) {
      alert('Venue Code is required.');
      return;
    }
    // Validate Venue Code
    if (!/^[A-Z]{6}$/.test(formData.venueCode)) {
      alert('Venue Code must be exactly 6 uppercase letters.');
      return;
    }

    console.log('Form Data:', formData);
    // Add logic to save the formData to the database or perform any other actions

    // Close the modal or perform any other necessary actions
  };
  return (
    <>
      <PopupModal title="Add / Edit Venue" show panelClass="relative" titleClass="text-xl text-primary-navy ">
        <form className="w-[1026px]">
          <h2 className="text-xl text-primary-navy font-bold">Main</h2>
          <div className="grid grid-cols-2 gap-5">
            <label htmlFor="" className="flex flex-row gap-5 justify-between">
              <p className="text-primary-input-text">Venue Code</p>
              <Tooltip
                width="w-[200px]"
                position="right"
                body="Venue Code is the first three letters of the town followed by the first three letters of the venue. eg. King's Theatre, Glasgow would have the code GLAKIN."
              >
                <TextInput
                  placeHolder="Enter Venue Code"
                  type=""
                  id="venueCode"
                  className="w-[364px]"
                  iconName="info-circle-solid"
                  value={formData.venueCode}
                  onBlur={() => handleInputChange('venueCode', formData.venueCode.toUpperCase())}
                  onChange={(e) => handleInputChange('venueCode', e.target.value)}
                />
              </Tooltip>
            </label>
            <Select
              label="Venue Status"
              options={[
                { text: 'Open', value: 'open' },
                { text: 'Closed', value: 'closed' },
                { text: 'Warning', value: 'warning' },
              ]}
              onChange={(value) => handleInputChange('venueStatus', value)}
              value={formData.venueStatus}
              placeHolder="<Venue Status DROPDOWN>"
              className="w-[430px] font-bold place-self-end "
            />

            <label htmlFor="" className="flex flex-row gap-5 justify-between ">
              <p className="text-primary-input-text">Venue Name</p>
              <TextInput
                placeHolder="Enter Venue Name"
                type=""
                className="w-[364px]"
                value={formData.venueName}
                onChange={(e) => handleInputChange('venueName', e.target.value)}
              />
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
              <p className="text-primary-input-text">Venue Family</p>
              <Select
                placeHolder="Venue Family Dropdown"
                className="w-[364px] font-bold"
                onChange={function (value: string | number): void {
                  console.log('value :>> ', value);
                  throw new Error('Function not implemented.');
                }}
                options={[]}
              />
            </label>
            <label className="flex flex-row gap-5 justify-between  ">
              <p className="text-primary-input-text">Currency</p>
              <Select
                className="mr-[175px] font-bold"
                placeHolder="Currency Dropdown"
                onChange={function (value: string | number): void {
                  console.log('value :>> ', value);
                  throw new Error('Function not implemented.');
                }}
                options={[]}
              />
            </label>
            <label htmlFor="" className="flex flex-row gap-5 justify-between ">
              <p className="text-primary-input-text">Capacity</p>
              <TextInput placeHolder="Enter Capacity" type="" className="w-[364px]" />
            </label>
            <label htmlFor="" className="flex flex-row gap-5 justify-between ">
              <p className="text-primary-input-text">Town Population</p>
              <TextInput placeHolder="Enter Town Population" type="" className="w-[364px]" />
            </label>
            <label
              htmlFor=""
              className="grid grid-cols-[100px_minmax(500px,_1fr)] flex-row gap-10 justify-between col-span-2 w-full"
            >
              <p className="text-primary-input-text">Website</p>
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
              <p className="text-primary-input-text">Notes</p>
              <TextArea placeHolder="Notes Field" className="w-full max-h-40 min-h-[50px]  justify-between" />
            </label>
          </div>
          <h2 className="text-xl text-primary-navy font-bold pt-7">Addresses</h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-5">
              <h2 className="text-base text-primary-input-text font-bold pt-7">Primary</h2>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className=" text-primary-input-text">Address 1</p>
                <TextInput
                  placeHolder="Enter Address 1"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Address 2</p>
                <TextInput
                  placeHolder="Enter Address 2"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Address 3</p>
                <TextInput
                  placeHolder="Enter Address 3"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Town</p>
                <TextInput
                  placeHolder="Enter Town"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Postcode</p>
                <TextInput
                  placeHolder="Enter Postcode"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>

              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Country</p>
                <TextInput
                  placeHolder="Enter Country"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[170px_minmax(100px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">What3Words Stage Door</p>
                <TextInput
                  placeHolder="what.three.words"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[170px_minmax(100px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">What3Words Loading</p>
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
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Address 1</p>
                <TextInput
                  placeHolder="Enter Address 1"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Address 2</p>
                <TextInput
                  placeHolder="Enter Address 2"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Address 3</p>
                <TextInput
                  placeHolder="Enter Address 3"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Town</p>
                <TextInput
                  placeHolder="Enter Town"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Postcode</p>
                <TextInput
                  placeHolder="Enter Postcode"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>

              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Country</p>
                <TextInput
                  placeHolder="Enter Country"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <div className="flex flex-row items-center gap-4 justify-end ">
                <p className="text-primary-input-text">Exclude from Barring Check and Venue Gap Suggestions</p>
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
            <div className="flex flex-row items-center justify-between  pb-5">
              <h2 className="text-xl text-primary-navy font-bold ">Venue Contacts</h2>
              <Button variant="primary" text="Add New Contact" />
            </div>
            <Table
              columnDefs={venueContractDefs}
              rowData={dummyVenueContractData}
              styleProps={styleProps}
              getRowStyle={getRowStyle}
            />
          </div>
          <div className="pt-7">
            <h2 className="text-xl text-primary-navy font-bold ">Technical</h2>
            <div className="flex flex-row  justify-between">
              <label htmlFor="" className="flex flex-row gap-10 justify-between  w-[700px]">
                <p className="text-primary-input-text">Tech Specs URL</p>
                <TextInput
                  placeHolder="Enter Tech Specs URL"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                />
              </label>
              <Button text="Upload Venue Tech Spec" />
            </div>
            <div className="grid grid-cols-2 gap-5 pt-5">
              <div className="flex flex-col gap-5">
                <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                  <p className="text-primary-input-text">Tech LX Desk</p>
                  <TextInput
                    placeHolder="Enter Tech LX Desk"
                    type=""
                    className="w-full justify-between"
                    inputClassName="w-full"
                  />
                </label>
                <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                  <p className="text-primary-input-text">LX Notes</p>
                  <TextArea placeHolder="Notes Field" className="!w-[380px] max-h-40 min-h-[50px]  justify-between" />
                </label>
                <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                  <p className="text-primary-input-text">Stage Size</p>
                  <TextInput
                    placeHolder="Enter Stage Size"
                    type=""
                    className="w-full justify-between"
                    inputClassName="w-full"
                  />
                </label>
              </div>
              <div className="flex flex-col gap-5">
                <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                  <p className="text-primary-input-text">Sound Desk</p>
                  <TextInput
                    placeHolder="Enter Sound Desk"
                    type=""
                    className="w-full justify-between"
                    inputClassName="w-full"
                  />
                </label>
                <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                  <p className="text-primary-input-text">LX Notes</p>
                  <TextArea placeHolder="Notes Field" className="!w-[380px] max-h-40 min-h-[50px]  justify-between" />
                </label>
                <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                  <p className="text-primary-input-text">Grid Height</p>
                  <TextInput
                    placeHolder="Enter Grid Height"
                    type=""
                    className="w-full justify-between"
                    inputClassName="w-full"
                  />
                </label>
              </div>
              <label className="grid grid-cols-[90px_minmax(100px,_1fr)] col-span-2 gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Flags</p>
                <TextArea placeHolder="Notes Field" className="w-full max-h-40 min-h-[50px]  justify-between" />
              </label>
            </div>
            <div className="pt-7 ">
              <h2 className="text-xl text-primary-navy font-bold ">Barring</h2>
              <label className="grid grid-cols-[95px_minmax(100px,350px)]  gap-10   w-full">
                <p className="text-primary-input-text">Barring Clause</p>
                <TextArea
                  placeHolder="Enter Barring Clause"
                  className="w-full max-h-32 min-h-[50px]  justify-between"
                />
              </label>
              <div className="grid grid-cols-2 gap-7 ">
                <div className="flex flex-col gap-5 pt-5 ">
                  <p className="text-primary-input-text">Barring Weeks</p>
                  <label
                    htmlFor=""
                    className="grid grid-cols-[90px_minmax(200px,30px)] gap-10 justify-items-start  w-full"
                  >
                    <p className="text-primary-input-text">Pre Show</p>
                    <TextInput placeHolder="Enter Pre Show Weeks" type="" className="w-full justify-between" />
                  </label>
                  <label
                    htmlFor=""
                    className="grid grid-cols-[90px_minmax(200px,30px)] gap-10 justify-items-start  w-full"
                  >
                    <p className="text-primary-input-text">Post Show</p>
                    <TextInput
                      placeHolder="Enter Post Show Weeks"
                      type=""
                      className="w-full justify-between"
                      // inputClassName="w-full"
                    />
                  </label>
                  <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                    <p className="text-primary-input-text">Barring Miles</p>
                    <TextInput
                      placeHolder="Enter Barring Miles"
                      type=""
                      className="w-full justify-between"
                      inputClassName="w-full"
                    />
                  </label>
                </div>
                <div className=" ">
                  <div className="flex justify-end pb-3">
                    <Button text="Add Barred Venue" className=" w-32" />
                  </div>

                  <Table styleProps={styleProps} columnDefs={barredVenues} rowData={barredVenuesData} />
                </div>
              </div>
            </div>
            <div className="pt-7">
              <h2 className="text-xl text-primary-navy font-bold  pb-2">Confidential Warning Notes</h2>
              <TextArea placeHolder="Notes Field" className="w-full max-h-40 min-h-[50px]  justify-between" />
            </div>
            <div className="flex gap-4 pt-4 float-right">
              <Button variant="secondary" text="Cancel" className="w-32" />
              <Button variant="tertiary" text="Delete Venue" className="w-32" />
              <Button text="Save and Close" className="w-32" onClick={handleSaveAndClose} />
            </div>
          </div>
        </form>
      </PopupModal>
    </>
  );
}

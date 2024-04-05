import { useState } from 'react';
import { barredVenues, styleProps, venueContractDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Icon from 'components/core-ui-lib/Icon';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import Table from 'components/core-ui-lib/Table';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { barredVenuesData, dummyVenueContractData, initialVenueState, venueStatusOptions } from 'config/Venue';
import schema from './validation';

type AddEditVenueModalProps = {
  visible: boolean;
  venueCurrencyOptionList: SelectOption[];
  venueFamilyOptionList: SelectOption[];
  onClose: () => void;
};

export default function AddEditVenueModal({
  visible,
  venueCurrencyOptionList,
  venueFamilyOptionList,
  onClose,
}: AddEditVenueModalProps) {
  const getRowStyle = (params) => {
    if (params.node.rowIndex === 0) {
      // Change 'red' to your desired background color
      return { background: '#fad0cc' };
    }
    return null;
  };

  const [formData, setFormData] = useState(initialVenueState);
  const [validationErrors, setValidationErrors] = useState({});
  const handleInputChange = (field: string, value: any) => {
    let sanitizedValue = value;
    if (field === 'venueCode') {
      sanitizedValue = sanitizedValue?.replace(/[^a-zA-Z]/g, '').toUpperCase();
    }
    setFormData({
      ...formData,
      [field]: sanitizedValue,
    });
  };

  const handleSaveAndClose = async () => {
    const isValid = await validateVenue(formData);
    if (isValid) {
      // TODO: Api call to create/edit Venue
      console.log(`Venue	errors`, validationErrors);
    }
  };
  const addNewBarredVenue = () => {
    console.log('Adding new venue is in Progress	');
  };
  const onAddNewVenueContact = () => {
    console.log('Adding new venue is in Progress	');
  };

  async function validateVenue(data) {
    return schema
      .validate(
        {
          ...data,
        },
        { abortEarly: false },
      )
      .then(() => {
        return true;
      })
      .catch((validationErrors) => {
        const errors = {};
        validationErrors.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        setValidationErrors(errors);
        return false;
      });
  }
  return (
    <>
      <PopupModal
        onClose={onClose}
        title="Add / Edit Venue"
        show={visible}
        panelClass="relative"
        titleClass="text-xl text-primary-navy "
      >
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
                  id="venueCode"
                  type="text"
                  maxlength={6}
                  className="w-[364px]"
                  placeholder="Enter Venue Code"
                  iconName="info-circle-solid"
                  value={formData.venueCode}
                  onBlur={() => handleInputChange('venueCode', formData.venueCode)}
                  onChange={(e) => handleInputChange('venueCode', e.target.value)}
                />
              </Tooltip>
            </label>
            <Select
              label="Venue Status"
              options={venueStatusOptions}
              onChange={(value) => handleInputChange('venueStatus', value)}
              value={formData.venueStatus}
              placeholder="<Venue Status DROPDOWN>"
              className="w-[430px] font-bold place-self-end "
            />

            <label htmlFor="" className="flex flex-row gap-5 justify-between ">
              <p className="text-primary-input-text">Venue Name</p>
              <TextInput
                placeholder="Enter Venue Name"
                type=""
                className="w-[364px]"
                value={formData.venueName}
                onChange={(e) => handleInputChange('venueName', e.target.value)}
              />
            </label>
            <div className="flex flex-row justify-between pl-20">
              <Checkbox
                label="VAT Indicator"
                id={'vatIndicator'}
                onChange={(e) => handleInputChange('vatIndicator', e.target.value)}
              />
              <Checkbox
                label="Culturally Exempt Venue"
                id={'culturallyExemptVenue'}
                onChange={(e) => handleInputChange('culturallyExemptVenue', e.target.value)}
              />
            </div>
            <label className="flex flex-row gap-5 justify-between ">
              <p className="text-primary-input-text">Venue Family</p>
              <Select
                name="venueFamily"
                placeholder="Venue Family Dropdown"
                className="w-[364px] font-bold"
                onChange={(value) => handleInputChange('venueFamily', value)}
                options={venueFamilyOptionList}
              />
            </label>
            <label className="flex flex-row gap-5 justify-between  ">
              <p className="text-primary-input-text">Currency</p>
              <Select
                name="currency"
                className="mr-[175px] font-bold"
                placeholder="Currency Dropdown"
                onChange={(value) => handleInputChange('currency', value)}
                options={venueCurrencyOptionList}
                isSearchable
              />
            </label>
            <label htmlFor="" className="flex flex-row gap-5 justify-between ">
              <p className="text-primary-input-text">Capacity</p>
              <TextInput
                placeholder="Enter Capacity"
                type="number"
                className="w-[364px]"
                value={formData.venueCapacity}
                onChange={(e) => handleInputChange('venueCapacity', e.target.value)}
              />
            </label>
            <label htmlFor="" className="flex flex-row gap-5 justify-between ">
              <p className="text-primary-input-text">Town Population</p>
              <TextInput
                placeholder="Enter Town Population"
                type="number"
                className="w-[364px]"
                value={formData.townPopulation}
                onChange={(e) => handleInputChange('townPopulation', e.target.value)}
              />
            </label>
            <label
              htmlFor=""
              className="grid grid-cols-[100px_minmax(500px,_1fr)] flex-row gap-10 justify-between col-span-2 w-full"
            >
              <p className="text-primary-input-text">Website</p>
              <TextInput
                placeholder="Enter Venue Website"
                type=""
                className="w-full justify-between"
                inputClassName="w-full"
                value={formData.venuWebsite}
                onChange={(e) => handleInputChange('venuWebsite', e.target.value)}
              />
            </label>
            <label
              htmlFor=""
              className="grid grid-cols-[100px_minmax(500px,_1fr)] flex-row gap-10 justify-between col-span-2 w-full"
            >
              <p className="text-primary-input-text">Notes</p>
              <TextArea
                placeholder="Notes Field"
                className="w-full max-h-40 min-h-[50px]  justify-between"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </label>
          </div>
          <h2 className="text-xl text-primary-navy font-bold pt-7">Addresses</h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-5">
              <h2 className="text-base text-primary-input-text font-bold pt-7">Primary</h2>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className=" text-primary-input-text">Address 1</p>
                <TextInput
                  placeholder="Enter Address 1"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.primaryAddress1}
                  onChange={(e) => handleInputChange('primaryAddress1', e.target.value)}
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Address 2</p>
                <TextInput
                  placeholder="Enter Address 2"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.primaryAddress2}
                  onChange={(e) => handleInputChange('primaryAddress2', e.target.value)}
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Address 3</p>
                <TextInput
                  placeholder="Enter Address 3"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.primaryAddress3}
                  onChange={(e) => handleInputChange('primaryAddress3', e.target.value)}
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Town</p>
                <TextInput
                  placeholder="Enter Town"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.primaryTown}
                  onChange={(e) => handleInputChange('primaryTown', e.target.value)}
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Postcode</p>
                <TextInput
                  placeholder="Enter Postcode"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.primaryPostCode}
                  onChange={(e) => handleInputChange('primaryPostCode', e.target.value)}
                />
              </label>

              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Country</p>
                <TextInput
                  placeholder="Enter Country"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.primaryCountry}
                  onChange={(e) => handleInputChange('primaryCountry', e.target.value)}
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[170px_minmax(100px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">What3Words Stage Door</p>
                <TextInput
                  placeholder="what.three.words"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.what3WordsStage}
                  onChange={(e) => handleInputChange('what3WordsStage', e.target.value)}
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[170px_minmax(100px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">What3Words Loading</p>
                <TextInput
                  placeholder="what.three.words"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.what3WordsLoading}
                  onChange={(e) => handleInputChange('what3WordsLoading', e.target.value)}
                />
              </label>
            </div>
            <div className="flex flex-col gap-5">
              <h2 className="text-base text-primary-input-text font-bold pt-7">Delivery</h2>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Address 1</p>
                <TextInput
                  placeholder="Enter Address 1"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.deliveryAddress1}
                  onChange={(e) => handleInputChange('deliveryAddress1', e.target.value)}
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Address 2</p>
                <TextInput
                  placeholder="Enter Address 2"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.deliveryAddress2}
                  onChange={(e) => handleInputChange('deliveryAddress2', e.target.value)}
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Address 3</p>
                <TextInput
                  placeholder="Enter Address 3"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.deliveryAddress3}
                  onChange={(e) => handleInputChange('deliveryAddress3', e.target.value)}
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Town</p>
                <TextInput
                  placeholder="Enter Town"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.deliveryTown}
                  onChange={(e) => handleInputChange('deliveryTown', e.target.value)}
                />
              </label>
              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Postcode</p>
                <TextInput
                  placeholder="Enter Postcode"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.deliveryPostCode}
                  onChange={(e) => handleInputChange('deliveryPostCode', e.target.value)}
                />
              </label>

              <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Country</p>
                <TextInput
                  placeholder="Enter Country"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.deliveryCountry}
                  onChange={(e) => handleInputChange('deliveryCountry', e.target.value)}
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
                  id={'excludeFromChecks'}
                  onChange={(e) => handleInputChange('excludeFromChecks', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="pt-7">
            <div className="flex flex-row items-center justify-between  pb-5">
              <h2 className="text-xl text-primary-navy font-bold ">Venue Contacts</h2>
              <Button onClick={onAddNewVenueContact} variant="primary" text="Add New Contact" />
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
                  placeholder="Enter Tech Specs URL"
                  type=""
                  className="w-full justify-between"
                  inputClassName="w-full"
                  value={formData.techSpecsUrl}
                  onChange={(e) => handleInputChange('techSpecUrl', e.target.value)}
                />
              </label>
              <Button text="Upload Venue Tech Spec" />
            </div>
            <div className="grid grid-cols-2 gap-5 pt-5">
              <div className="flex flex-col gap-5">
                <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                  <p className="text-primary-input-text">Tech LX Desk</p>
                  <TextInput
                    placeholder="Enter Tech LX Desk"
                    type=""
                    className="w-full justify-between"
                    inputClassName="w-full"
                    value={formData.techLXDesk}
                    onChange={(e) => handleInputChange('techLXDesk', e.target.value)}
                  />
                </label>
                <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                  <p className="text-primary-input-text">LX Notes</p>
                  <TextArea
                    placeholder="Notes Field"
                    className="!w-[380px] max-h-40 min-h-[50px]  justify-between"
                    value={formData.techLXNotes}
                    onChange={(e) => handleInputChange('techLXNotes', e.target.value)}
                  />
                </label>
                <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                  <p className="text-primary-input-text">Stage Size</p>
                  <TextInput
                    placeholder="Enter Stage Size"
                    type=""
                    className="w-full justify-between"
                    inputClassName="w-full"
                    value={formData.stageSize}
                    onChange={(e) => handleInputChange('stageSize', e.target.value)}
                  />
                </label>
              </div>
              <div className="flex flex-col gap-5">
                <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                  <p className="text-primary-input-text">Sound Desk</p>
                  <TextInput
                    id="soundDesk"
                    placeholder="Enter Sound Desk"
                    type=""
                    className="w-full justify-between"
                    inputClassName="w-full"
                    value={formData.soundDesk}
                    onChange={(e) => handleInputChange('soundDesk', e.target.value)}
                  />
                </label>
                <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                  <p className="text-primary-input-text">LX Notes</p>
                  <TextArea
                    id="soundLXNotes"
                    placeholder="Notes Field"
                    className="!w-[380px] max-h-40 min-h-[50px]  justify-between"
                    value={formData.soundLXNotes}
                    onChange={(e) => handleInputChange('soundLXNotes', e.target.value)}
                  />
                </label>
                <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                  <p className="text-primary-input-text">Grid Height</p>
                  <TextInput
                    id="gridHeight"
                    placeholder="Enter Grid Height"
                    type=""
                    className="w-full justify-between"
                    inputClassName="w-full"
                    value={formData.gridHeight}
                    onChange={(e) => handleInputChange('gridHeight', e.target.value)}
                  />
                </label>
              </div>
              <label className="grid grid-cols-[90px_minmax(100px,_1fr)] col-span-2 gap-10 justify-between  w-full">
                <p className="text-primary-input-text">Flags</p>
                <TextArea
                  id="flags"
                  placeholder="Notes Field"
                  className="w-full max-h-40 min-h-[50px]  justify-between"
                  value={formData.flags}
                  onChange={(e) => handleInputChange('flags', e.target.value)}
                />
              </label>
            </div>
            <div className="pt-7 ">
              <h2 className="text-xl text-primary-navy font-bold ">Barring</h2>
              <label className="grid grid-cols-[95px_minmax(100px,350px)]  gap-10   w-full">
                <p className="text-primary-input-text">Barring Clause</p>
                <TextArea
                  id="barringClause"
                  placeholder="Enter Barring Clause"
                  className="w-full max-h-32 min-h-[50px]  justify-between"
                  value={formData.barringClause}
                  onChange={(e) => handleInputChange('barringClause', e.target.value)}
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
                    <TextInput
                      id="preShow"
                      placeholder="Enter Pre Show Weeks"
                      type="number"
                      className="w-full justify-between"
                      value={formData.preShow}
                      onChange={(e) => handleInputChange('preShow', e.target.value)}
                    />
                  </label>
                  <label
                    htmlFor=""
                    className="grid grid-cols-[90px_minmax(200px,30px)] gap-10 justify-items-start  w-full"
                  >
                    <p className="text-primary-input-text">Post Show</p>
                    <TextInput
                      id="address2"
                      placeholder="Enter Post Show Weeks"
                      type="number"
                      className="w-full justify-between"
                      value={formData.postShow}
                      onChange={(e) => handleInputChange('postShow', e.target.value)}
                    />
                  </label>
                  <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
                    <p className="text-primary-input-text">Barring Miles</p>
                    <TextInput
                      id="barringMiles"
                      placeholder="Enter Barring Miles"
                      type="number"
                      className="w-full justify-between"
                      inputClassName="w-full"
                      value={formData.barringMiles}
                      onChange={(e) => handleInputChange('barringMiles', e.target.value)}
                    />
                  </label>
                </div>
                <div className=" ">
                  <div className="flex justify-end pb-3">
                    <Button onClick={addNewBarredVenue} text="Add Barred Venue" className="w-32" />
                  </div>
                  <Table styleProps={styleProps} columnDefs={barredVenues} rowData={barredVenuesData} />
                </div>
              </div>
            </div>
            <div className="pt-7">
              <h2 className="text-xl text-primary-navy font-bold  pb-2">Confidential Warning Notes</h2>
              <TextArea
                id="confidentialNotes"
                placeholder="Notes Field"
                className="w-full max-h-40 min-h-[50px]  justify-between"
                value={formData.confidentialNotes}
                onChange={(e) => handleInputChange('confidentialNotes', e.target.value)}
              />
            </div>
            <div className="flex gap-4 pt-4 float-right">
              <Button onClick={onClose} variant="secondary" text="Cancel" className="w-32" />
              <Button variant="tertiary" text="Delete Venue" className="w-32" />
              <Button text="Save and Close" className="w-32" onClick={handleSaveAndClose} />
            </div>
          </div>
        </form>
      </PopupModal>
    </>
  );
}

import TextInput from 'components/core-ui-lib/TextInput';
import { initialVenueAddressDetails } from 'config/venue';
import { useState } from 'react';
import { UiTransformedVenue } from 'utils/venue';

interface VenueAddressFormProps {
  venue: Partial<UiTransformedVenue>;
  onChange: (data: any) => void;
}
const VenueAddressForm = ({ venue, onChange }: VenueAddressFormProps) => {
  const [formData, setFormData] = useState({ ...initialVenueAddressDetails, ...venue });
  const handleInputChange = (field: string, value: any) => {
    let sanitizedValue = value;
    if (field === 'venueCode') {
      sanitizedValue = sanitizedValue?.replace(/[^a-zA-Z]/g, '').toUpperCase();
    }
    const updatedFormData = {
      ...formData,
      [field]: sanitizedValue,
    };
    setFormData(updatedFormData);
    onChange(updatedFormData);
  };
  return (
    <>
      <div className="flex flex-col gap-5">
        <h2 className="text-base text-primary-input-text font-bold pt-7">Primary</h2>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className=" text-primary-input-text">Address 1</p>
          <TextInput
            placeholder="Enter Address 1"
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
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.deliveryCountry}
            onChange={(e) => handleInputChange('deliveryCountry', e.target.value)}
          />
        </label>
      </div>
    </>
  );
};

export default VenueAddressForm;

import { useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import { initialVenueState } from 'config/venue';
import schema from './addEditVenuesValidationSchema';
import MainVenueForm from './MainVenueForm';
import VenueAddressForm from './VenueAddressForm';
import VenueTechnicalDetailsForm from './VenueTechnicalDetailsForm';
import VenueBarringForm from './VenueBarringForm';
import axios from 'axios';
import { UiTransformedVenue } from 'utils/venue';

interface AddEditVenueModalProps {
  visible: boolean;
  venueCurrencyOptionList: SelectOption[];
  venueFamilyOptionList: SelectOption[];
  countryOptions: SelectOption[];
  venue?: UiTransformedVenue;
  onClose: () => void;
}

export default function AddEditVenueModal({
  venue,
  visible,
  venueCurrencyOptionList,
  venueFamilyOptionList,
  countryOptions,
  onClose,
}: AddEditVenueModalProps) {
  const [formData, setFormData] = useState({ ...initialVenueState, ...(venue || {}) });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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

  const createVenue = async (venue: UiTransformedVenue) => {
    return axios.post('/api/venue/create', venue).then(() => {
      onClose();
    });
  };

  const updateVenue = async (venue: UiTransformedVenue) => {
    return axios.post('/api/venue/update/' + venue.id, venue).then(() => {
      onClose();
    });
  };

  const handleSaveAndClose = async () => {
    const isValid = await validateVenue(formData);
    if (isValid) {
      formData.id ? updateVenue(formData) : createVenue(formData);
    }
  };

  async function validateVenue(data: UiTransformedVenue) {
    try {
      await schema.validate({ ...data }, { abortEarly: false });
      return true;
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setValidationErrors(errors);
      console.log('validation Errors', errors);
      return false;
    }
  }
  const onChange = (data = {}) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };
  const updateValidationErrors = (key: string, value: string) => {
    setValidationErrors((prev) => ({ ...prev, [key]: value }));
  };
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
            <MainVenueForm
              venue={formData}
              venueCurrencyOptionList={venueCurrencyOptionList}
              venueFamilyOptionList={venueFamilyOptionList}
              onChange={onChange}
              validationErrors={validationErrors}
              updateValidationErrrors={updateValidationErrors}
            />
          </div>
          <h2 className="text-xl text-primary-navy font-bold pt-7">Addresses</h2>
          <div className="grid grid-cols-2 gap-5">
            <VenueAddressForm
              countryOptions={countryOptions}
              venue={formData}
              onChange={onChange}
              validationErrors={validationErrors}
              updateValidationErrrors={updateValidationErrors}
            />
          </div>
          <div className="pt-7">
            <h2 className="text-xl text-primary-navy font-bold ">Technical</h2>
            <VenueTechnicalDetailsForm
              venue={formData}
              onChange={onChange}
              validationErrors={validationErrors}
              updateValidationErrrors={updateValidationErrors}
            />
            <div className="pt-7 ">
              <h2 className="text-xl text-primary-navy font-bold ">Barring</h2>
              <VenueBarringForm
                venue={formData}
                validationErrors={validationErrors}
                onChange={onChange}
                updateValidationErrrors={updateValidationErrors}
              />
            </div>
            <div className="pt-7">
              <h2 className="text-xl text-primary-navy font-bold  pb-2">Confidential Warning Notes</h2>
              <TextArea
                id="confidentialNotes"
                placeholder="Notes Field"
                className="w-full max-h-40 min-h-[50px] justify-between"
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

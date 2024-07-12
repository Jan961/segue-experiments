import { useState } from 'react';
import { UiAccountType, initialUiAccountDetails } from 'config/account';
import { FormField } from '../../account/Form/FormField';

export default function AccountDetailsTab() {
  const [formData, setFormData] = useState<Partial<UiAccountType>>({ ...initialUiAccountDetails });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  setValidationErrors({});
  // async function validateDetails(data: UiAccountType) {
  //   try {
  //     await schema.validate({ ...data }, { abortEarly: false });
  //     return true;
  //   } catch (validationErrors) {
  //     const errors = {};
  //     validationErrors.inner.forEach((error) => {
  //       errors[error.path] = error.message;
  //     });
  //     setValidationErrors(errors);
  //     console.log('validation Errors', errors);
  //     return false;
  //   }
  // }

  const handleInputChange = (field: string, value: any) => {
    let sanitizedValue = value;

    if (field === 'venueCode') {
      sanitizedValue = sanitizedValue?.replace(/[^a-zA-Z]/g, '').toUpperCase();
    }
    // validate email here

    const updatedFormData = {
      // ...venue,
      [field]: sanitizedValue,
    };
    setFormData(updatedFormData);
  };

  return (
    <div className="flex flex-row gap-5 w-full">
      <div className="flex flex-col gap-5 w-1/2">
        <h2 className="text-base text-primary-input-text font-bold pt-7">Primary</h2>
        <div className="flex flex-col">
          <FormField value={formData.firstName} displayText="First Name" handleInputChange={handleInputChange} />
          {validationErrors.firstName && <small className="text-primary-red flex">{validationErrors.firstName}</small>}
        </div>
        <FormField value={formData.lastName} displayText="Last Name" handleInputChange={handleInputChange} />
        <FormField value={formData.companyName} displayText="Company Name" handleInputChange={handleInputChange} />
        <FormField value={formData.phoneNumber} displayText="Phone Number" handleInputChange={handleInputChange} />
        <FormField value={formData.addressLine1} displayText="Address Line 1" handleInputChange={handleInputChange} />
        <FormField value={formData.addressLine2} displayText="Address Line 2" handleInputChange={handleInputChange} />
        <FormField value={formData.addressLine3} displayText="Address Line 3" handleInputChange={handleInputChange} />
        <FormField value={formData.townName} displayText="Town" handleInputChange={handleInputChange} />
        <FormField value={formData.postcode} displayText="Postcode" handleInputChange={handleInputChange} />
      </div>
      <div className="flex flex-col gap-5 w-1/2">
        <h2 className="text-base text-primary-input-text font-bold pt-7">Primary</h2>
        <div className="flex flex-col">
          <FormField value={formData.firstName} displayText="First Name" handleInputChange={handleInputChange} />
          {validationErrors.primaryAddress1 && (
            <small className="text-primary-red flex">{validationErrors.primaryAddress1}</small>
          )}
        </div>
        <FormField value={formData.lastName} displayText="Last Name" handleInputChange={handleInputChange} />
        <FormField value={formData.companyName} displayText="Company Name" handleInputChange={handleInputChange} />
        <FormField value={formData.phoneNumber} displayText="Phone Number" handleInputChange={handleInputChange} />
      </div>
    </div>
  );
}

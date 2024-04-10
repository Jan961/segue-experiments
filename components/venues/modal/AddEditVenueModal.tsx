import { useState } from 'react';
import { styleProps, venueContractDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import Table from 'components/core-ui-lib/Table';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import { dummyVenueContractData, initialVenueState } from 'config/Venue';
import schema from './validation';
import MainVenueForm from './MainVenueForm';
import VenueAddressForm from './VenueAddressForm';
import VenueTechnicalDetailsForm from './VenueTechnicalDetailsForm';
import VenueBarringForm from './VenueBarringForm';

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
  const onChange = (data = {}) => {
    setFormData((prev) => ({ ...prev, ...data }));
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
              venueCurrencyOptionList={venueCurrencyOptionList}
              venueFamilyOptionList={venueFamilyOptionList}
              onChange={onChange}
            />
          </div>
          <h2 className="text-xl text-primary-navy font-bold pt-7">Addresses</h2>
          <div className="grid grid-cols-2 gap-5">
            <VenueAddressForm onChange={onChange} />
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
            <VenueTechnicalDetailsForm onChange={onChange} />
            <div className="pt-7 ">
              <h2 className="text-xl text-primary-navy font-bold ">Barring</h2>
              <VenueBarringForm onChange={onChange} />
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

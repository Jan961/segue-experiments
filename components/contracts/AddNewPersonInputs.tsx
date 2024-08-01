import { Select, TextInput } from 'components/core-ui-lib';
import { booleanOptions } from 'config/contracts';
import { useState } from 'react';

interface AddPersonDataProps {
  first?: string;
  second?: string;
  type?: string;
  dataFieldFirst?: string;
  dataFieldSecond?: string;
}
interface NewPersonDataProps {
  newPersonData: AddPersonDataProps;
}

export const AddNewPersonInput = ({ newPersonData }: NewPersonDataProps) => {
  const [newPersonForm, setNewPersonForm] = useState({});
  const handleAddNewPersonForm = (key: string, value, type: string) => {
    const updatedFormData = {
      ...newPersonForm,
      [key]: value,
    };

    if (type === 'dealMemo') {
      setNewPersonForm({ ...updatedFormData });
    }
    // setFormEdited(true);
    // setNewPersonForm()
  };

  return (
    <div className="flex mt-2 items-center">
      {newPersonData.first && (
        <div className="w-1/2 flex items-center">
          <div className="text-primary-input-text font-bold mr-4 w-[11vw]">{newPersonData.first}</div>
          <div className="w-[22vw] ml-4">
            {newPersonData.type === 'textInput' && (
              <TextInput
                className=" text-primary-input-text font-bold w-full"
                disabled
                onChange={(value) => {
                  handleAddNewPersonForm(newPersonData.dataFieldFirst, value, 'dealMemo');
                }}
                // value={contactsData.phone}
                // placeholder={
                //   contactsData.phone ? 'Add details to the Contact Database' : 'Please select from the dropdown above'
                // }
              />
            )}
            {newPersonData.type === 'select' && (
              <Select
                onChange={() => {
                  return null;
                }}
                className="bg-primary-white w-full"
                placeholder="Please select..."
                options={booleanOptions}
                isClearable
                isSearchable
                //   value={formData.DeMoAdvancePaymentRequired}
              />
            )}
          </div>
        </div>
      )}

      {newPersonData.second && (
        <div className="w-1/2 flex items-center">
          <div className="text-primary-input-text font-bold  mr-4 w-2/5">{newPersonData.second}</div>
          <div className="w-[22vw] ml-4">
            {newPersonData.type === 'textInput' && (
              <TextInput
                className=" text-primary-input-text font-bold w-full"
                disabled
                onChange={(value) => {
                  handleAddNewPersonForm(newPersonData.dataFieldSecond, value, 'dealMemo');
                }}
                // value={contactsData.phone}
                // placeholder={
                //   contactsData.phone ? 'Add details to the Contact Database' : 'Please select from the dropdown above'
                // }
              />
            )}

            {newPersonData.type === 'select' && (
              <Select
                onChange={() => {
                  return null;
                }}
                className="bg-primary-white w-full"
                placeholder="Please select..."
                options={booleanOptions}
                isClearable
                isSearchable
                //   value={formData.DeMoAdvancePaymentRequired}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

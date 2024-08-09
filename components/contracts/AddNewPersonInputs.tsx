import { Select, TextInput } from 'components/core-ui-lib';
import { booleanOptions } from 'config/contracts';

interface AddPersonDataProps {
  first?: string;
  second?: string;
  type?: string;
  dataFieldFirst?: string;
  dataFieldSecond?: string;
}
interface NewPersonDataProps {
  newPersonData: AddPersonDataProps;
  handleAddpersonData: (x, y) => void;
  newPersonForm: any;
}

export const AddNewPersonInput = ({ newPersonData, handleAddpersonData, newPersonForm }: NewPersonDataProps) => {
  const handleAddNewPersonForm = (key: string, value) => {
    handleAddpersonData(key, value);
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
                onChange={(value) => {
                  handleAddNewPersonForm(newPersonData.dataFieldFirst, value.target.value);
                }}
                value={newPersonForm ? newPersonForm[newPersonData.dataFieldFirst] : ''}
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
                onChange={(value) => {
                  handleAddNewPersonForm(newPersonData.dataFieldSecond, value.target.value);
                }}
                value={newPersonForm ? newPersonForm[newPersonData.dataFieldSecond] : ''}
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
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import { TemplateFormRowPopulated, ContractData } from 'components/company-contracts/types';
import { FormInputGeneral } from '../formTypeMap';
import { PlusCircleSolidIcon } from 'components/core-ui-lib/assets/svg';

interface ContractDetailsTabProps {
  formData: TemplateFormRowPopulated[];
  setFormData: React.Dispatch<React.SetStateAction<TemplateFormRowPopulated[]>>;
  setContractData: React.Dispatch<React.SetStateAction<ContractData[]>>;
}

const ContractDetailsTab = ({ formData, setFormData, setContractData }: ContractDetailsTabProps) => {
  const handleAddEntry = (rowID: number, entryIndex: number) => {
    setFormData((prevStructure) =>
      prevStructure.map((row) => {
        if (row.rowID === rowID) {
          const valueIndex = row.values.findIndex((value) => value.index === entryIndex);

          if (valueIndex === -1) {
            console.error('Entry not found with index', entryIndex);
            return row;
          }

          const newIndex = row.values.length > 0 ? row.values[row.values.length - 1].index + 1 : 1;

          const newComponents =
            row.values[valueIndex]?.components.map((component) => ({
              ...component,
              value: null,
            })) || [];

          const newValueEntry = {
            index: newIndex,
            components: newComponents,
          };

          const updatedValues = [
            ...row.values.slice(0, valueIndex + 1),
            newValueEntry,
            ...row.values.slice(valueIndex + 1),
          ];

          return {
            ...row,
            values: updatedValues,
          };
        }
        return row;
      }),
    );
  };

  const handleFormInputChange = (value, compID, index) => {
    setContractData((prevData) => {
      const existingEntryIndex = prevData.findIndex((entry) => entry.compID === compID && entry.index === index);

      if (existingEntryIndex !== -1) {
        const updatedData = [...prevData];
        updatedData[existingEntryIndex] = {
          ...updatedData[existingEntryIndex],
          value,
        };
        return updatedData;
      } else {
        return [
          ...prevData,
          {
            compID,
            index,
            value,
          },
        ];
      }
    });
  };

  return (
    <div>
      {formData.map((row) => (
        <div key={row.rowID} className="mb-10">
          <div className="font-semibold"> {row.rowLabel} </div>
          <div className="w-full h-[1px] bg-slate-300 mb-2" />

          {row.values.map((value) => (
            <div key={value.index} className="mb-4 flex items-center">
              <div className="flex gap-x-4">
                {value.components
                  .sort((a, b) => a.orderInRow - b.orderInRow)
                  .map((component) => (
                    <div key={component.id} className="mb-1">
                      <FormInputGeneral
                        type={component.type}
                        label={component.label}
                        initialValue={component.value}
                        handleChange={(val) => handleFormInputChange(val, component.id, value.index)}
                      />
                    </div>
                  ))}
              </div>

              {row.isAList && (
                <PlusCircleSolidIcon
                  className="hover:cursor-pointer"
                  onClick={() => handleAddEntry(row.rowID, value.index)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ContractDetailsTab;

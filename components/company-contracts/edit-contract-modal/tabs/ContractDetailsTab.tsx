import { TemplateFormRowPopulated, ContractData } from 'components/company-contracts/types';
import { FormInputGeneral } from '../formTypeMap';
import { PlusCircleSolidIcon } from 'components/core-ui-lib/assets/svg';

interface ContractDetailsTabProps {
  formData: TemplateFormRowPopulated[];
  setFormData: React.Dispatch<React.SetStateAction<TemplateFormRowPopulated[]>>;
  setContractData: React.Dispatch<React.SetStateAction<ContractData[]>>;
}

const ContractDetailsTab = ({ formData, setFormData, setContractData }: ContractDetailsTabProps) => {
  const handleAddEntry = (rowID, entryIndex) => {
    let newComponents = [];
    const newIndex = entryIndex + 1;

    setFormData((prevFormData) =>
      prevFormData.map((row) => {
        if (row.rowID === rowID) {
          const valueListIndex = row.values.findIndex((value) => value.index === entryIndex);

          if (valueListIndex === -1) {
            console.error('Entry not found with index', entryIndex);
            return row;
          }

          newComponents =
            row.values[valueListIndex]?.components.map((component) => ({
              ...component,
              value: null,
            })) || [];

          const newValueEntry = {
            index: newIndex,
            components: newComponents,
          };

          const updatedValues = [
            ...row.values.slice(0, valueListIndex + 1),
            newValueEntry,
            ...row.values.slice(valueListIndex + 1).map((obj) => ({
              ...obj,
              index: obj.index + 1,
            })),
          ];

          return {
            ...row,
            values: updatedValues,
          };
        }
        return row;
      }),
    );

    setContractData((prevContractData) => {
      const updatedContractData = prevContractData.map((entry) => {
        if (entry.index > entryIndex) {
          return { ...entry, index: entry.index + 1 };
        } else {
          return entry;
        }
      });

      const newContractDataEntries = newComponents.map((component) => ({
        compID: component.id,
        index: newIndex,
        value: component.value,
      }));

      return [...updatedContractData, ...newContractDataEntries];
    });
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

          {row.values
            .sort((a, b) => a.index - b.index)
            .map((value) => (
              <div key={value.index} className="mb-4 flex items-center">
                <div className="flex gap-x-4">
                  {value.components
                    .sort((a, b) => a.orderInRow - b.orderInRow)
                    .map((component) => (
                      <div key={`${row.rowID}-${value.index}-${component.id}-${component.orderInRow}`} className="mb-1">
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

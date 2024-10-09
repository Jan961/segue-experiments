import { TemplateFormRowPopulated, ContractData, TemplateFormRow } from 'components/company-contracts/types';
import { FormInputGeneral } from '../form-components/GeneralInput';
import { PlusCircleSolidIcon, MinusCircleSolidIcon } from 'components/core-ui-lib/assets/svg';
import { useEffect } from 'react';
import { populateTemplateWithValues } from '../utils';

interface ContractDetailsTabProps {
  formData: TemplateFormRowPopulated[];
  setFormData: React.Dispatch<React.SetStateAction<TemplateFormRowPopulated[]>>;
  contractData: ContractData[];
  setContractData: React.Dispatch<React.SetStateAction<ContractData[]>>;
  templateFormStructure: TemplateFormRow[];
}

const ContractDetailsTab = ({
  formData,
  setFormData,
  contractData,
  setContractData,
  templateFormStructure,
}: ContractDetailsTabProps) => {
  useEffect(() => {
    const formData = populateTemplateWithValues(templateFormStructure, contractData);
    setFormData(formData);
  }, [contractData]);

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
      const currentCompIDs = newComponents.map((component) => component.id);

      const updatedContractData = prevContractData.map((entry) => {
        if (currentCompIDs.includes(entry.compID) && entry.index > entryIndex) {
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

  const handleDeleteEntry = (rowID, deleteIndex) => {
    let removedCompIDs = [];

    setFormData((prevFormData) =>
      prevFormData.map((row) => {
        if (row.rowID === rowID) {
          const updatedValues = row.values
            .filter((value) => {
              if (value.index === deleteIndex) {
                removedCompIDs = value.components.map((component) => component.id);
                return false;
              }
              return true;
            })
            .map((value) => {
              if (value.index > deleteIndex) {
                return { ...value, index: value.index - 1 };
              }
              return value;
            });

          return {
            ...row,
            values: updatedValues,
          };
        }
        return row;
      }),
    );

    setContractData((prevContractData) => {
      let updatedContractData = prevContractData.filter(
        (entry) => !removedCompIDs.includes(entry.compID) || entry.index !== deleteIndex,
      );

      updatedContractData = updatedContractData.map((entry) => {
        if (removedCompIDs.includes(entry.compID) && entry.index > deleteIndex) {
          return { ...entry, index: entry.index - 1 };
        }
        return entry;
      });

      return updatedContractData;
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
      {formData
        .sort((a, b) => a.rowNum - b.rowNum)
        .map((row) => (
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
                        <div
                          key={`${row.rowID}-${value.index}-${component.id}-${component.orderInRow}`}
                          className="mb-1"
                        >
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
                    <div className="flex gap-x-2">
                      {value.index !== 1 && (
                        <MinusCircleSolidIcon
                          className="hover:cursor-pointer"
                          onClick={() => handleDeleteEntry(row.rowID, value.index)}
                        />
                      )}
                      <PlusCircleSolidIcon
                        className="hover:cursor-pointer"
                        onClick={() => handleAddEntry(row.rowID, value.index)}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

export default ContractDetailsTab;

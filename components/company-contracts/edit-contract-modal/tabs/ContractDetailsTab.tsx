import { TemplateFormRow, ContractData, TemplateFormWithValues } from 'components/company-contracts/types';
import { populateValueListWithPlaceholders, populateTemplateWithValues } from '../utils';
import { useState } from 'react';
import { createFormInput } from '../formTypeMap';
import { PlusCircleSolidIcon } from 'components/core-ui-lib/assets/svg';

interface ContractDetailsTabProps {
  templateFormStructure: TemplateFormRow[];
  contractData: ContractData[];
}

const ContractDetailsTab = ({ templateFormStructure, contractData }: ContractDetailsTabProps) => {
  console.log('ContractData:', contractData);

  const populatedValueList = populateValueListWithPlaceholders(templateFormStructure, contractData);
  const templateStructureWithValues = populateTemplateWithValues(templateFormStructure, populatedValueList);
  const [formData, setFormData] = useState<TemplateFormWithValues[]>(templateStructureWithValues);

  console.log(templateStructureWithValues);

  const handleAddEntry = (rowID: number, valueIndex: number) => {
    setFormData((prevStructure) =>
      prevStructure.map((row) => {
        if (row.rowID === rowID) {
          // Create a new entry based on the components of the value at valueIndex
          const newIndex = row.values.length > 0 ? row.values[row.values.length - 1].index + 1 : 1;
          const newComponents =
            row.values[valueIndex]?.components.map((component) => ({
              ...component,
              value: null, // Default value for new entry
            })) || [];

          const newValueEntry = {
            index: newIndex,
            components: newComponents,
          };

          // Add the new entry right after the current valueIndex
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

  return (
    <div>
      {formData.map((row) => (
        <div key={row.rowID} className="mb-10">
          <div className="font-semibold"> {row.rowLabel} </div>
          <div className="w-full h-[1px] bg-slate-300 mb-2" />

          {row.values.map((value, valueIndex) => (
            <div key={valueIndex} className="mb-4 flex items-center">
              <div className="flex gap-x-4">
                {value.components
                  .sort((a, b) => a.orderInRow - b.orderInRow)
                  .map((component) => (
                    <div key={component.id} className="mb-1">
                      {createFormInput(component.type, component.label, component.value)}
                    </div>
                  ))}
              </div>

              {row.isAList && (
                <PlusCircleSolidIcon
                  className="hover:cursor-pointer"
                  onClick={() => handleAddEntry(row.rowID, valueIndex)} // Pass rowID and valueIndex
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

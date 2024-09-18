import { TemplateFormRow, ContractData, TemplateFormWithValues } from 'components/company-contracts/types';
import { createFormInput, populateValueListWithPlaceholders, populateTemplateWithValues } from '../utils';
import { useState } from 'react';

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

  const handleAddEntry = (rowID: number) => {
    setFormData((prevStructure) =>
      prevStructure.map((row) => {
        if (row.rowID === rowID) {
          const newIndex = row.values.length > 0 ? row.values[row.values.length - 1].index + 1 : 1;

          const newComponents =
            row.values[0]?.components.map((component) => ({
              ...component,
              value: null,
            })) || [];

          const newValueEntry = {
            index: newIndex,
            components: newComponents,
          };

          return {
            ...row,
            values: [...row.values, newValueEntry],
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
            <div key={valueIndex} className="mb-4">
              <div className="flex gap-x-4">
                {value.components
                  .sort((a, b) => a.orderInRow - b.orderInRow)
                  .map((component) => (
                    <div key={component.id} className="mb-1">
                      {createFormInput(component.type, component.label, component.value)}
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {row.isAList && (
            <button className="mt-2 bg-blue-500 text-white py-1 px-4 rounded" onClick={() => handleAddEntry(row.rowID)}>
              Add
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContractDetailsTab;

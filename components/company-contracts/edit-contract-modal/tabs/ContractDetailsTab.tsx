import { TemplateFormRowPopulated } from 'components/company-contracts/types';
import { createFormInput } from '../formTypeMap';
import { PlusCircleSolidIcon } from 'components/core-ui-lib/assets/svg';

interface ContractDetailsTabProps {
  formData: TemplateFormRowPopulated[];
  setFormData: React.Dispatch<React.SetStateAction<TemplateFormRowPopulated[]>>;
}

const ContractDetailsTab = ({ formData, setFormData }: ContractDetailsTabProps) => {
  const handleAddEntry = (rowID: number, valueIndex: number) => {
    setFormData((prevStructure) =>
      prevStructure.map((row) => {
        if (row.rowID === rowID) {
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
                  onClick={() => handleAddEntry(row.rowID, valueIndex)}
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

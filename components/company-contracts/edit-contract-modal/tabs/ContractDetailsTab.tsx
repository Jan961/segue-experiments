import { TemplateFormRow, ContractData } from 'components/company-contracts/types';
import { createFormInput, populateValueListWithPlaceholders, populateTemplateWithValues } from '../utils';

interface ContractDetailsTabProps {
  templateFormStructure: TemplateFormRow[];
  contractData: ContractData[];
}

const ContractDetailsTab = ({ templateFormStructure, contractData }: ContractDetailsTabProps) => {
  // const tempContractData = [
  //   {compID: 28, index: 1, value: new Date()},
  //   {compID: 29, index: 1, value: "abc"},
  //   {compID: 28, index: 2, value: "bud"},
  //   {compID: 29, index: 2, value: "dfsdf"}
  // ];

  const populatedValueList = populateValueListWithPlaceholders(templateFormStructure, contractData);
  const templateStructureWithValues = populateTemplateWithValues(templateFormStructure, populatedValueList);

  console.log(templateStructureWithValues);

  return (
    <div>
      {templateFormStructure.map((row) => (
        <div key={row.rowID} className="mb-10">
          <div className="font-semibold"> {row.rowLabel} </div>
          <div className="w-full h-[1px] bg-slate-300 mb-2" />
          <div className="flex gap-x-4">
            {row.components
              .sort((a, b) => a.orderInRow - b.orderInRow)
              .map((component) => (
                <div key={component.id} className="mb-1">
                  {createFormInput(component.type, component.label, 'test value')}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContractDetailsTab;

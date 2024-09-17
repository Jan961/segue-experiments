import { TemplateFormRow, ContractData } from 'components/company-contracts/types';
import { createFormInput } from '../utils';

interface ContractDetailsTabProps {
  templateFormStructure: TemplateFormRow[];
  contractData: ContractData[];
}

const ContractDetailsTab = ({ templateFormStructure }: ContractDetailsTabProps) => {
  console.log(templateFormStructure);

  // const templateStructureWithValues = templateFormStructure.map(row => ({
  //   rowID: row.rowID,
  //   rowNum: row.rowNum,
  //   rowLabel: row.rowLabel,
  //   isAList: row.isAList,
  //   listName: row.listName,
  //   componentValueArray:
  // }))

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

import { TemplateFormStructure } from 'components/company-contracts/types';
interface ContractDetailsTabProps {
  form: TemplateFormStructure;
}

const ContractDetailsTab = ({ form }: ContractDetailsTabProps) => {
  console.log(form);

  return <div />;
};

export default ContractDetailsTab;

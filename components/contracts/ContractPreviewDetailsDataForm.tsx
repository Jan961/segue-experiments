import JendagiContract from './JendagiContract';

interface ContractPreviewDetailsFormProps {
  height: string;
  contractPerson: any;
}
export const ContractPreviewDetailsForm = ({ height, contractPerson }: ContractPreviewDetailsFormProps) => {
  console.log('ContractPerson in contractpreviewdetailsform:', contractPerson);
  return (
    <>
      <div className={`h-[${height}] w-[82vw] justify-center flex`}>
        <JendagiContract contractPerson={contractPerson} />
      </div>
    </>
  );
};

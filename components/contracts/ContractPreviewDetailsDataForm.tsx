import JendagiContract from './JendagiContract';

interface ContractPreviewDetailsFormProps {
  height: string;
}
export const ContractPreviewDetailsForm = ({ height }: ContractPreviewDetailsFormProps) => {
  return (
    <>
      <div className={`h-[${height}] w-[82vw] justify-center flex`}>
        <JendagiContract />
      </div>
    </>
  );
};

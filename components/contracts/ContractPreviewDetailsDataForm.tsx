interface ContractPreviewDetailsFormProps {
  height: string;
}
export const ContractPreviewDetailsForm = ({ height }: ContractPreviewDetailsFormProps) => {
  return (
    <>
      <div className={`h-[${height}] w-[82vw] overflow-y-scroll`}>Contract template with fields completed from DB</div>
    </>
  );
};

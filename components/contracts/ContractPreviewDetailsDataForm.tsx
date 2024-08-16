import JendagiContract from './JendagiContract';
import { IContractSchedule, IContractDetails } from './types';
interface ContractPreviewDetailsFormProps {
  height: string;
  contractPerson: any;
  contractSchedule: Partial<IContractSchedule>;
  contractDetails: Partial<IContractDetails>;
}

export const ContractPreviewDetailsForm = ({
  height,
  contractPerson,
  contractSchedule,
  contractDetails,
}: ContractPreviewDetailsFormProps) => {
  console.log('ContractPerson in contractpreviewdetailsform:', contractPerson);
  return (
    <>
      <div className={`h-[${height}] w-[82vw] justify-center flex`}>
        <JendagiContract
          contractPerson={contractPerson}
          contractSchedule={contractSchedule}
          contractDetails={contractDetails}
        />
      </div>
    </>
  );
};

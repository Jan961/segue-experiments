import { useRef } from 'react';
// import { IContractSchedule, IContractDetails, IScheduleDay } from './types';
// import { ProductionDTO } from 'interfaces';

// interface ContractPreviewDetailsFormProps {
//   height: string;
//   contractPerson: any;
//   production: Partial<ProductionDTO>;
//   contractSchedule: Partial<IContractSchedule>;
//   contractDetails: Partial<IContractDetails>;
//   schedule: IScheduleDay[];
// }

export const ContractPreviewDetailsForm = () => {
  const contractRef = useRef(null);

  return (
    <div className="w-full h-full">
      <div ref={contractRef} className="h-full w-full justify-center flex">
        <iframe className="w-full h-full" src="/segue/contracts/EquityContract.pdf" />
      </div>
    </div>
  );
};

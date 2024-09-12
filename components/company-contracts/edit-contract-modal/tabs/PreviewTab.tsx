import { useRef } from 'react';
import { IContractSchedule, IContractDetails, IScheduleDay } from '../../../contracts/types';
import { ProductionDTO } from 'interfaces';

interface ContractPreviewDetailsFormProps {
  contractPerson: any;
  production: Partial<ProductionDTO>;
  contractSchedule: Partial<IContractSchedule>;
  contractDetails: Partial<IContractDetails>;
  schedule: IScheduleDay[];
}

export const PreviewTab = (_props: ContractPreviewDetailsFormProps) => {
  const contractRef = useRef(null);

  return (
    <div className="w-full h-full">
      <div ref={contractRef} className="h-full w-full justify-center flex" />
    </div>
  );
};

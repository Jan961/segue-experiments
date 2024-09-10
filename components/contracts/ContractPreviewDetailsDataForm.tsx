import { IContractSchedule, IContractDetails, IScheduleDay } from './types';
import { useRef } from 'react';
// import { useMemo } from 'react';
// import { useRecoilValue } from 'recoil';
// import { productionJumpState } from 'state/booking/productionJumpState';
import { ProductionDTO } from 'interfaces';
// import { PDFViewer } from '@react-pdf/renderer';
// import JendagiContractRenderer from 'services/reportPDF/JendagiContractRenderer';

interface ContractPreviewDetailsFormProps {
  height: string;
  contractPerson: any;
  production: Partial<ProductionDTO>;
  contractSchedule: Partial<IContractSchedule>;
  contractDetails: Partial<IContractDetails>;
  schedule: IScheduleDay[];
}

export const ContractPreviewDetailsForm = ({
  height, // contractPerson,
} // production,
// contractSchedule,
// contractDetails,
// schedule,
: ContractPreviewDetailsFormProps) => {
  const contractRef = useRef(null);
  // const { productions = [] } = useRecoilValue(productionJumpState);
  // const productionCompany = useMemo(
  //   () => productions.find((production) => production.Id === contractSchedule.production)?.ProductionCompany,
  //   [productions, contractSchedule],
  // );
  return (
    <div className="w-full relative">
      <div ref={contractRef} className={`h-[${height}] w-full justify-center flex`}>
        {/* <PDFViewer style={{ width: '100%' }}>
          <JendagiContractRenderer
            contractPerson={contractPerson}
            contractSchedule={contractSchedule}
            contractDetails={contractDetails}
            productionCompany={productionCompany}
            showName={production?.ShowName}
            schedule={schedule}
          />
        </PDFViewer> */}
        <iframe className="w-full h-full" src="/segue/contracts/EquityContract.pdf" />
      </div>
    </div>
  );
};

import { IContractSchedule, IContractDetails } from './types';
import { useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { ProductionDTO } from 'interfaces';
import { PDFViewer } from '@react-pdf/renderer';
import JendagiContractRenderer from 'services/reportPDF/JendagiContractRenderer';

interface ContractPreviewDetailsFormProps {
  height: string;
  contractPerson: any;
  production: Partial<ProductionDTO>;
  contractSchedule: Partial<IContractSchedule>;
  contractDetails: Partial<IContractDetails>;
}

export const ContractPreviewDetailsForm = ({
  height,
  contractPerson,
  production,
  contractSchedule,
  contractDetails,
}: ContractPreviewDetailsFormProps) => {
  const contractRef = useRef(null);
  const { productions = [] } = useRecoilValue(productionJumpState);
  const productionCompany = useMemo(
    () => productions.find((production) => production.Id === contractSchedule.production)?.ProductionCompany,
    [productions, contractSchedule],
  );
  return (
    <div className="w-full relative">
      <div ref={contractRef} className={`h-[${height}] w-[82vw] justify-center flex`}>
        <PDFViewer style={{ width: '100%' }}>
          <JendagiContractRenderer
            contractPerson={contractPerson}
            contractSchedule={contractSchedule}
            contractDetails={contractDetails}
            productionCompany={productionCompany}
            showName={production?.ShowName}
          />
        </PDFViewer>
      </div>
    </div>
  );
};

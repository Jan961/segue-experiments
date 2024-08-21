import { Button } from 'components/core-ui-lib';
import JendagiContract from './JendagiContract';
import { IContractSchedule, IContractDetails } from './types';
import { useMemo, useRef, useState } from 'react';
import { toCanvas } from 'html-to-image';
import JsPDF from 'jspdf';
import LoadingOverlay from 'components/shows/LoadingOverlay';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';

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
  const [loading, setLoading] = useState(false);
  const contractRef = useRef(null);
  const { productions = [] } = useRecoilValue(productionJumpState);
  const productionCompany = useMemo(
    () => productions.find((production) => production.Id === contractSchedule.production)?.ProductionCompany,
    [productions, contractSchedule],
  );

  const downloadPdf = async () => {
    setLoading(true);
    const options = {
      pixelRatio: 1,
      quality: 1,
    };
    const canvas = await toCanvas(contractRef.current, options);
    const fileName = 'contract.pdf';
    const pdf = new JsPDF({
      orientation: canvas.width > canvas.height ? 'l' : 'p',
      unit: 'px',
      format: [canvas.width, canvas.height],
      putOnlyUsedFonts: true,
    });

    pdf.addImage({
      imageData: canvas.toDataURL('image/png'),
      format: 'PNG',
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
      compression: 'FAST',
    });
    await pdf.save(fileName, { returnPromise: true });
    setLoading(false);
  };

  return (
    <div className="w-full relative">
      {loading && (
        <div className="absolute left-0 top-0 w-full h-full">
          <LoadingOverlay />
        </div>
      )}
      <Button className="mx-auto" onClick={() => downloadPdf()} text="Print" />
      <div ref={contractRef} className={`h-[${height}] w-[82vw] justify-center flex`}>
        <JendagiContract
          contractPerson={contractPerson}
          contractSchedule={contractSchedule}
          contractDetails={contractDetails}
          productionCompany={productionCompany}
        />
      </div>
      <Button className="mx-auto" onClick={() => downloadPdf()} text="Print" />
    </div>
  );
};

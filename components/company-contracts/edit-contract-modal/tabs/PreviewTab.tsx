import { useState, useEffect, useRef } from 'react';
import { IContractSchedule, IContractDetails, IScheduleDay } from '../../../contracts/types';
import { ProductionDTO } from 'interfaces';
import axios from 'axios';
import { Spinner } from 'components/global/Spinner';

interface ContractPreviewDetailsFormProps {
  contractPerson: any;
  production: Partial<ProductionDTO>;
  contractSchedule: Partial<IContractSchedule>;
  contractDetails: Partial<IContractDetails>;
  schedule: IScheduleDay[];
  templateFile: File;
}

export const PreviewTab = ({ templateFile }: ContractPreviewDetailsFormProps) => {
  const isMounted = useRef(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const fetchPDF = async () => {
    try {
      const tokenresponse = await axios.post('/api/pdfconvert/token/create/');

      const formData = new FormData();
      formData.append('token', String(tokenresponse.data.token));
      formData.append('file', templateFile);

      const response = await axios.post('http://79.99.40.44:3000/api/convertDocxToPDF', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      console.log(pdfUrl);

      setPdfUrl(pdfUrl);
    } catch (err) {
      console.error(err, 'Error - failed to convert DOCX file to PDF');
    }
  };

  useEffect(() => {
    if (!isMounted.current) {
      fetchPDF();
      isMounted.current = true;
    }
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {pdfUrl ? (
        <object data={pdfUrl} type="application/pdf" width="100%" height="100%">
          <p>PDF cannot be displayed.</p>
        </object>
      ) : (
        <Spinner size="lg" className="" />
      )}
    </div>
  );
};

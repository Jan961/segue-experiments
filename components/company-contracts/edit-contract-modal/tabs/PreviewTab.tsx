import { useState } from 'react';
import { IContractSchedule, IContractDetails, IScheduleDay } from '../../../contracts/types';
import { ProductionDTO } from 'interfaces';
import axios from 'axios';
import { Button } from 'components/core-ui-lib';

interface ContractPreviewDetailsFormProps {
  contractPerson: any;
  production: Partial<ProductionDTO>;
  contractSchedule: Partial<IContractSchedule>;
  contractDetails: Partial<IContractDetails>;
  schedule: IScheduleDay[];
  templateFile: File;
}

export const PreviewTab = ({ templateFile }: ContractPreviewDetailsFormProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // State to store the PDF URL

  const fetchPDF = async () => {
    try {
      console.log(templateFile);
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
      const pdfUrl = URL.createObjectURL(pdfBlob); // Create URL for PDF blob
      console.log(pdfUrl);

      setPdfUrl(pdfUrl); // Set the URL in state
    } catch (err) {
      console.error(err, 'Error - failed to convert DOCX file to PDF');
    }
  };

  return (
    <div className="w-full h-full">
      <Button onClick={fetchPDF} />
      {pdfUrl ? (
        <object data={pdfUrl} type="application/pdf" width="100%" height="100%">
          <p>PDF cannot be displayed.</p>
        </object>
      ) : (
        <div>Loading PDF...</div>
      )}
    </div>
  );
};

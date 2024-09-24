import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Spinner } from 'components/global/Spinner';
import { populateDOCX } from '../docx-template/populateDOCX';
import { TemplateFormRowPopulated } from 'components/company-contracts/types';
import { IPerson, IScheduleDay } from 'components/contracts/types';
import { ProductionDTO } from 'interfaces';

interface PreviewTabProps {
  templateFile: File;
  formData: TemplateFormRowPopulated[];
  personDetails: IPerson;
  productionInfo: Partial<ProductionDTO>;
  productionSchedule: IScheduleDay[];
}

export const PreviewTab = ({
  templateFile,
  formData,
  personDetails,
  productionInfo,
  productionSchedule,
}: PreviewTabProps) => {
  const isMounted = useRef(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  console.log(productionSchedule);

  const fetchPDF = async () => {
    try {
      const tokenresponse = await axios.post('/api/pdfconvert/token/create/');

      const populatedDOCX = await populateDOCX(
        templateFile,
        formData,
        personDetails,
        productionInfo,
        productionSchedule,
      );

      const convertFormData = new FormData();
      convertFormData.append('token', String(tokenresponse.data.token));
      convertFormData.append('file', populatedDOCX);

      const response = await axios.post('http://79.99.40.44:3000/api/convertDocxToPDF', convertFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

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

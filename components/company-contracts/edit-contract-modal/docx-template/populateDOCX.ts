import { TemplateHandler } from 'easy-template-x';
import { createResolver } from 'easy-template-x-angular-expressions';
import { TemplateFormRowPopulated } from 'components/company-contracts/types';
import { convertFormData } from './convertFormData';

export const populateDOCX = async (templateFile: File, formData: TemplateFormRowPopulated[]) => {
  const dataList = convertFormData(formData);
  console.log('DATALIST:', dataList);

  const data = {
    ...dataList,
  };

  const handler = new TemplateHandler({
    scopeDataResolver: createResolver({
      angularFilters: {
        upper: (input: string) => (input || '').toUpperCase(),
        lower: (input: string) => (input || '').toLowerCase(),
      },
    }),
  });

  const docx = await handler.process(templateFile, data);

  return docx;
};

import { TemplateHandler } from 'easy-template-x';
import { createResolver } from 'easy-template-x-angular-expressions';
import { TemplateFormRowPopulated } from 'components/company-contracts/types';
import { convertFormData } from './convertFormData';
import { IPerson } from 'components/contracts/types';
import { getPersonDetailsTags } from './persondetails';

export const populateDOCX = async (
  templateFile: File,
  formData: TemplateFormRowPopulated[],
  personDetails: IPerson,
) => {
  const contractDetailsTags = convertFormData(formData);
  const personDetailsTags = getPersonDetailsTags(personDetails);

  console.log(personDetails);

  console.log('DATALIST:', contractDetailsTags);
  console.log('PERSON LIST:', personDetailsTags);

  const data = {
    ...contractDetailsTags,
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

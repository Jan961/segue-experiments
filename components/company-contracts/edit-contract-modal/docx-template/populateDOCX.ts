import { TemplateHandler } from 'easy-template-x';
import { createResolver } from 'easy-template-x-angular-expressions';
import { TemplateFormRowPopulated } from 'components/company-contracts/types';
import { getContractDetailsTags } from './convertFormData';
import { IPerson } from 'components/contracts/types';
import { getPersonDetailsTags } from './persondetails';
import { getStaticDetailsTags } from './staticdetails';

export const populateDOCX = async (
  templateFile: File,
  formData: TemplateFormRowPopulated[],
  personDetails: IPerson,
) => {
  const contractDetailsTags = getContractDetailsTags(formData);
  const personDetailsTags = getPersonDetailsTags(personDetails);
  const staticDetailsTags = getStaticDetailsTags();

  const data = {
    ...contractDetailsTags,
    ...personDetailsTags,
    ...staticDetailsTags,
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

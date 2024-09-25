import { TemplateHandler } from 'easy-template-x';
import { createResolver } from 'easy-template-x-angular-expressions';
import { TemplateFormRowPopulated } from 'components/company-contracts/types';
import { getContractDetailsTags } from './convertFormData';
import { IPerson, IScheduleDay } from 'components/contracts/types';
import { getPersonDetailsTags } from './persondetails';
import { getStaticDetailsTags } from './staticdetails';
import { ProductionDTO } from 'interfaces';

export const populateDOCX = async (
  templateFile: File,
  formData: TemplateFormRowPopulated[],
  personDetails: IPerson,
  productionInfo: Partial<ProductionDTO>,
  productionSchedule: IScheduleDay[],
) => {
  const contractDetailsTags = getContractDetailsTags(formData);
  const personDetailsTags = getPersonDetailsTags(personDetails);
  const staticDetailsTags = getStaticDetailsTags(productionInfo, productionSchedule);

  const data = {
    ...contractDetailsTags,
    ...personDetailsTags,
    ...staticDetailsTags,
  };

  // Need to include this so that Angular Expressions are supported
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

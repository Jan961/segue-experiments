import { TemplateFormRowPopulated } from 'components/company-contracts/types';

// Convert the Form Data object into the object used by easy-template-x for DOCX parsing
export const getContractDetailsTags = (formData: TemplateFormRowPopulated[]) => {
  return formData.reduce((acc, row) => {
    if (row.isAList) {
      acc['CD_' + row.listName] = row.values.map((index) => {
        return index.components.reduce((compAcc, component) => {
          compAcc[component.tag] = component.value;
          return compAcc;
        }, {});
      });
    } else {
      row.values[0].components.forEach((component) => {
        acc['CD_' + component.tag] = component.value;
      });
    }
    return acc;
  }, {});
};

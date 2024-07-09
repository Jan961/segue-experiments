import * as yup from 'yup';

export const productionFormSchema = yup.object().shape({
  currency: yup.string().required('Currency is required'),
  region: yup.array().of(yup.number()).required('Region is required'),
  productionDateBlock: yup
    .object()
    .shape({
      StartDate: yup.date().required('Start date is required'),
      EndDate: yup.date().required('End date is required'),
    })
    .required('Production date block is required'),
  company: yup.number().required('Company is required'),
  prodCode: yup.string().required('Production code is required'),
});

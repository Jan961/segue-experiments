import * as yup from 'yup';

export const productionFormSchema = yup.object().shape({
  currency: yup.string().required('Currency is required').nullable(),
  region: yup.array().of(yup.number()).required('Region is required').nullable(),
  productionDateBlock: yup
    .object()
    .shape({
      StartDate: yup.date().required('Start date is required').nullable().required(),
      EndDate: yup.date().required('End date is required').nullable().required(),
    })
    .nullable()
    .required('Production dates are required'),
  company: yup.number().required('Company is required').nullable(),
  prodCode: yup.string().required('Production code is required').nullable(),
});

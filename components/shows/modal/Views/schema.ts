import * as yup from 'yup';

export const productionFormSchema = yup.object().shape({
  currency: yup.string().required('Currency is a required field').nullable(),
  region: yup.array().of(yup.number()).min(1, 'Region is a required field'),
  productionDateBlock: yup
    .object()
    .shape({
      StartDate: yup.date().required('Start date is a required field').nullable().required(),
      EndDate: yup.date().required('End date is a required field').nullable().required(),
    })
    .nullable()
    .required('Production dates are required'),
  company: yup.number().required('Company is a required field').nullable(),
  prodCode: yup.string().required('Production code is a required field').nullable(),
});

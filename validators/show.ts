import * as yup from 'yup';

export const showSchema = yup.object().shape({
  Code: yup.string().required('Code is a required field'),
  Name: yup.string().required('Name is a required field'),
  Type: yup.string().oneOf(['P', 'N'], 'Type must be one of Panto or Normal').optional(),
  IsArchived: yup.boolean().optional(),
});

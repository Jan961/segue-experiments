import * as Yup from 'yup';

const newAccountSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is a required field.'),
  lastName: Yup.string().required('Last Name is a required field.'),
  companyName: Yup.string().required('Company is a required field.'),
  phoneNumber: Yup.string().required('Phone Number is a required field.'),
  addressLine1: Yup.string().required('Address Line 1 is a required field.'),
  addressLine2: Yup.string().required('Address Line 2 is a required field.'),
  town: Yup.string().required('Town is a required field.'),
  country: Yup.string().required('Country is a required field'),
  postcode: Yup.string().required('Postcode is a required field'),
  email: Yup.string()
    .required('Email is a required field.')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be a valid email'),
  currency: Yup.string().required('Currency is a required field'),
  agreementChecked: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
});

export default newAccountSchema;

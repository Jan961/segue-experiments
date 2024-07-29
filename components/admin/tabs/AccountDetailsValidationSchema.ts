import * as Yup from 'yup';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const accountDetailsSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is a required field.')
    .max(50, 'First name can be at most 50 characters long'),
  lastName: Yup.string()
    .required('Last name is a required field.')
    .max(50, 'Last Name can be at most 50 characters long'),
  companyName: Yup.string()
    .required('Company Name is a required field.')
    .max(50, 'Company name can be at most 50 characters long'),
  phoneNumber: Yup.string().max(30, 'Phone Number can be at most 30 characters long'),
  addressLine1: Yup.string()
    .required('Address Line 1 is a required field')
    .max(50, 'Address Line 1 can be at most 50 characters long'),
  addressLine2: Yup.string().max(50, 'Address Line 2 can be at most 50 characters long'),
  addressLine3: Yup.string().max(50, 'Address Line 3 can be at most 50 characters long'),
  townName: Yup.string().max(50, 'Town Name can be at most 50 characters long'),
  postcode: Yup.string().required('Postcode is a required field').max(20, 'Postcode can be at most 20 characters long'),
  country: Yup.string()
    .required('Country is a required field')
    .max(30, 'Country field can be at most 30 characters long'),
  companyEmail: Yup.string()
    .required('Company Email is a required field.')
    .matches(emailRegex, 'Company Email must be a valid email')
    .max(120, 'Company Email can be at most 120 characters long'),
  currencyForPayment: Yup.string().required('Currency is a required field'),
  vatNumber: Yup.string().max(20, 'VAT Number can be at most 20 characters long'),
  companyNumber: Yup.string().max(20, 'Company Number can be at most 20 characters long'),
  companyWebsite: Yup.string().max(255, 'Company Website can be at most 255 characters long'),
  typeOfCompany: Yup.string().max(30, 'Type of Company can be at most 30 characters long'),
  currency: Yup.string().required('Currency is a required field'),
});

export default accountDetailsSchema;

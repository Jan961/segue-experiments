import { validatePin } from 'utils/authUtils';
import * as yup from 'yup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailSchema = yup.object().shape({
  email: yup.string().required('Email is a required field').matches(emailRegex, 'Email must be a valid email'),
});

const passwordSchmea = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters long')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const passwordResetSchema = yup.object().shape({
  code: yup.string().when('skipVerify', {
    is: true,
    then: yup.string(),
    otherwise: yup.string().required('Code is a required field'),
  }),
  password: passwordSchmea,
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().required('Email is a required field').matches(emailRegex, 'Email must be a valid email'),
  password: passwordSchmea,
});

export const accountLoginSchema = yup.object().shape({
  pin: yup
    .number()
    .transform((cv, ov) => {
      return ov === '' ? undefined : cv;
    })
    .required('PIN is a required field')
    .test({
      name: 'validatePin',
      test: (value) => validatePin(value).valid,
      message: 'PIN does not match the required format.',
    }),
  company: yup.string().required('Company is a required field'),
});

export const userPreSignUpSchema = emailSchema.shape({
  companyName: yup.string().required('Company Name is a required field'),
});

export const userSignUpSchema = yup.object().shape({
  password: passwordSchmea,
  confirmPassword: yup
    .string()
    .required('Repeat Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  firstName: yup.string().required('First Name is a required field'),
  lastName: yup.string().required('Last Name is a required field'),
  pin: yup
    .number()
    .required('PIN is a required field')
    .test({
      name: 'validatePin',
      test: (value) => validatePin(value).valid,
      message: 'PIN does not match the required format.',
    }),
  repeatPin: yup
    .number()
    .required('Repeat PIN is a required field')
    .oneOf([yup.ref('pin'), null], 'PINs must match'),
});

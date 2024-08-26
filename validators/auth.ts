import * as yup from 'yup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = yup.object().shape({
  email: yup.string().required('Email is a required field').matches(emailRegex, 'Email must be a valid email'),
  password: yup.string().required('Password is a required field'),
});

export const accountLoginSchema = yup.object().shape({
  pin: yup.string().required('PIN is a required field'),
  company: yup.string().required('Company is a required field'),
});

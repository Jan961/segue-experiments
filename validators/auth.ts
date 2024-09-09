import * as yup from 'yup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const emailSchema = yup.object().shape({
  email: yup.string().required('Email is a required field').matches(emailRegex, 'Email must be a valid email'),
});

export const passwordResetSchema = yup.object().shape({
  code: yup.string().required('Code is a required field'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().required('Email is a required field').matches(emailRegex, 'Email must be a valid email'),
  password: yup
    .string()
    .required('Password is a required field')
    .matches(passwordRegex, 'Password must be at least 8 characters long'),
});

export const accountLoginSchema = yup.object().shape({
  pin: yup.string().required('PIN is a required field'),
  company: yup.string().required('Company is a required field'),
});

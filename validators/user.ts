import { emailRegex } from 'config/global';
import * as yup from 'yup';

export const newUserSchema = yup.object().shape({
  firstName: yup.string().required('First Name is a required field'),
  lastName: yup.string().required('Last Name is a required field'),
  email: yup.string().required('Email is a required field').matches(emailRegex, 'Email must be a valid email'),
  password: yup.string().required('Password is a required field'),
  pin: yup.string().required('PIN is a required field'),
});

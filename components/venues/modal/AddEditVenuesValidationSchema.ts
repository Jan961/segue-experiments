import * as Yup from 'yup';

const venueSchema = Yup.object().shape({
  venueCode: Yup.string()
    .matches(/^[A-Za-z]{6}$/, 'Venue Code must be exactly 6 letters and only contain letters.')
    .required('Venue Code is a required field.')
    .uppercase('Venue Code must be in uppercase.'), // Note: `.uppercase()` is not a built-in Yup method. This is pseudo-code to indicate the transformation requirement.
  venueName: Yup.string().required('Venue Name is a required field.'),
  venueStatus: Yup.string()
    .oneOf(['O', 'C', 'W'], "Venue Status must be 'Open', 'Closed', or 'Warning'.")
    .required('Venue Status is a required field.'),
  venueFamily: Yup.number().required('Venue Family is a required field.'),
  currency: Yup.string().required('Currency is a required field.'),
  excludeFromChecks: Yup.boolean(),
  techSpecsUrl: Yup.mixed().required('Venue Tech Spec is a required field.'),
  preShow: Yup.number().typeError('Pre Show Weeks must be a number.').required('Pre Show Weeks is a required field.'),
  postShow: Yup.number()
    .typeError('Post Show Weeks must be a number.')
    .required('Post Show Weeks is a required field.'),
  barringMiles: Yup.number().typeError('Miles must be a number.').required('Miles is a required field.'),
});

export default venueSchema;

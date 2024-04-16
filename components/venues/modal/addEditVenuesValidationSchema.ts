import * as Yup from 'yup';

const venueSchema = Yup.object().shape({
  venueCode: Yup.string()
    .matches(/^[A-Za-z]{6}$/, 'Venue Code must be exactly 6 letters and only contain letters.')
    .required('Venue Code is a required field.')
    .uppercase('Venue Code must be in uppercase.'), // Note: `.uppercase()` is not a built-in Yup method. This is pseudo-code to indicate the transformation requirement.
  venueName: Yup.string().required('Venue Name is a required field.'),
  primaryCountry: Yup.number()
    .typeError('Primary Address Country is a required field')
    .required('Primary Address Country is a required field'),
  primaryAddress1: Yup.string().required('Primary Address 1 is a required field'),
});

export default venueSchema;

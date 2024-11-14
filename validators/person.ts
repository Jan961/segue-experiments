import { omit } from 'radash';
import * as yup from 'yup';

export const personShape = {
  firstName: yup.string().nullable().required(),
  lastName: yup.string().nullable(),
  email: yup.string().email().nullable(),
  landline: yup.string().nullable(),
  addressId: yup.number().nullable(),
  address1: yup.string().nullable(),
  address2: yup.string().nullable(),
  address3: yup.string().nullable(),
  town: yup.string().nullable(),
  mobileNumber: yup.string().nullable(),
  passportName: yup.string().nullable(),
  passportNumber: yup.string().nullable(),
  hasUKWorkPermit: yup.boolean().nullable(),
  passportExpiryDate: yup.string().nullable(),
  postcode: yup.string().nullable(),
  checkedBy: yup.number().integer().nullable(),
  country: yup.number().integer().nullable(),
  isFEURequired: yup.boolean().nullable(),
  workType: yup.array().of(yup.number().integer()).nullable(),
  advisoryNotes: yup.string().nullable(),
  generalNotes: yup.string().nullable(),
  healthDetails: yup.string().nullable(),
  otherWorkTypes: yup
    .array()
    .of(yup.object().shape({ id: yup.number().nullable(), name: yup.string().nullable() }))
    .nullable(),
  notes: yup.string().nullable(),
};

const personFields = {
  id: yup.number().integer().nullable(),
  firstName: yup.string().nullable(),
  lastName: yup.string().nullable(),
  email: yup.string().email('Invalid email').nullable(),
  landline: yup.string().nullable(),
  addressId: yup.number().nullable(),
  address1: yup.string().nullable(),
  address2: yup.string().nullable(),
  address3: yup.string().nullable(),
  town: yup.string().nullable(),
  postcode: yup.string().nullable(),
  country: yup.number().integer().nullable(),
  mobileNumber: yup.string().nullable(),
};

// Common contact fields that extend personFields
const contactFields = {
  ...personFields,
  passportName: yup.string().nullable(),
  passportNumber: yup.string().nullable(),
  hasUKWorkPermit: yup.boolean().nullable(),
  passportExpiryDate: yup.date().nullable(),
  checkedBy: yup.number().integer().nullable(),
  isFEURequired: yup.boolean().nullable(),
  advisoryNotes: yup.string().nullable(),
  generalNotes: yup.string().nullable(),
  healthDetails: yup.string().nullable(),
  notes: yup.string().nullable(),
};

// Account details schema
const accountDetailsShape = {
  paidTo: yup.string().nullable(),
  accountName: yup.string().nullable(),
  accountNumber: yup.string().nullable(),
  sortCode: yup.string().nullable(),
  swift: yup.string().nullable(),
  iban: yup.string().nullable(),
  country: yup.number().integer().nullable(),
};

// Agency details specific fields
const agencyRelevantFields = [
  'lastName',
  'email',
  'mobileNumber',
  'landline',
  'website',
  'address1',
  'address2',
  'address3',
  'town',
  'postcode',
  'country',
];
const agencyFields = {
  ...omit(personFields, ['firstName']),
  agencyPersonId: yup.number().integer().nullable(),
  website: yup.string().url().nullable(),
  agencyName: yup.string().nullable(),
  landlineNumber: yup.string().nullable(),
};

const hasNonEmptyValues = (obj, fields) => {
  return fields.some((field) => {
    const value = obj?.[field];
    return value !== null && value !== undefined && value !== '';
  });
};

// Helper function to create emergency contact validation
const createEmergencyContactShape = (contactNumber) => {
  // Define emergency contact specific fields to check
  const emergencyContactFields = [
    'lastName',
    'email',
    'mobileNumber',
    'landline',
    'address1',
    'address2',
    'address3',
    'town',
    'postcode',
    'country',
  ];

  return yup
    .object()
    .shape({
      ...contactFields,
      firstName: yup
        .string()
        .nullable()
        .when(['id', ...emergencyContactFields], {
          is: (id: number, ...values) => {
            return !id && values.some((value) => !!value);
          },
          then: (schema) => schema.required(`Emergency Contact ${contactNumber} First Name is required`),
          otherwise: (schema) => schema.nullable(),
        }),
    })
    .nullable()
    .transform((value, originalValue) => {
      if (!value || !originalValue) return null;

      const allFieldsEmpty = ['firstName', ...emergencyContactFields].every((field) => {
        const fieldValue = originalValue[field];
        return fieldValue === null || fieldValue === undefined || fieldValue === '';
      });

      return allFieldsEmpty ? null : value;
    });
};

const transformAgencyDetails = (value, originalValue) => {
  if (originalValue?.id) return value;
  if (!value || !originalValue || (!originalValue.hasAgent && !originalValue.id)) return null;

  const allFieldsEmpty = Object.keys(agencyFields).every((field) => {
    const fieldValue = originalValue[field];
    return fieldValue === null || fieldValue === undefined || fieldValue === '';
  });

  return allFieldsEmpty ? null : value;
};

export const updatePersonSchema = yup.object().shape({
  personDetails: yup
    .object()
    .shape({ id: yup.number().integer().required(), ...personShape })
    .required(),

  agencyDetails: yup
    .object()
    .shape({
      ...agencyFields,
      firstName: yup.string().nullable(),
      name: yup.string().nullable(),
    })
    .nullable()
    .test({
      name: 'agency-required-fields',
      test: function (value) {
        if (!value) return true;

        // First check hasAgent
        if (!value.hasAgent) return true;

        const hasValues = hasNonEmptyValues(value, ['firstName', 'name', ...agencyRelevantFields]);

        if (!hasValues) return true;

        const errors = [];
        if (!value.firstName) {
          errors.push(
            this.createError({
              path: `${this.path}.firstName`,
              message: 'Agency Contact First Name is required',
            }),
          );
        }
        if (!value.name) {
          errors.push(
            this.createError({
              path: `${this.path}.name`,
              message: 'Agency Name is required',
            }),
          );
        }

        if (errors.length > 0) {
          throw new yup.ValidationError(errors);
        }

        return true;
      },
    })
    .transform(transformAgencyDetails),

  salaryAccountDetails: yup.object().shape(accountDetailsShape).nullable(),

  expenseAccountDetails: yup.object().shape(accountDetailsShape).nullable(),

  emergencyContact1: createEmergencyContactShape(1),
  emergencyContact2: createEmergencyContactShape(2),
});

export const createPersonSchema = yup.object().shape({
  personDetails: yup
    .object()
    .shape({
      ...personShape,
      firstName: yup.string().required('Person First name is required'),
      lastName: yup.string().required('Person Last name is required'),
      otherWorkTypes: yup
        .array()
        .of(
          yup
            .string()
            .required('Name is required for other work types')
            .max(30, 'Name must be at most 30 characters long'),
        )
        .transform((value) => {
          if (!Array.isArray(value)) return [];
          return value.filter?.((item) => item?.name)?.map((item) => item.name);
        }),
    })
    .required('Person Details are required'),
  agencyDetails: yup.object().nullable(),
  emergencyContact1: createEmergencyContactShape(1),
  emergencyContact2: createEmergencyContactShape(2),
});

import * as yup from 'yup';

export const updatePersonSchema = yup.object().shape({
  personDetails: yup
    .object()
    .shape({
      id: yup.number().integer().required(),
      firstName: yup.string().nullable(),
      lastName: yup.string().nullable(),
      email: yup.string().email().nullable(),
      landline: yup.string().nullable(),
      address1: yup.string().nullable(),
      address2: yup.string().nullable(),
      address3: yup.string().nullable(),
      town: yup.string().nullable(),
      mobileNumber: yup.string().nullable(),
      passportName: yup.string().nullable(),
      passportNumber: yup.string().nullable(),
      hasUKWorkPermit: yup.boolean().nullable(),
      passportExpiryDate: yup.date().nullable(),
      postcode: yup.string().nullable(),
      checkedBy: yup.number().integer().nullable(),
      country: yup.number().integer().nullable(),
      isFEURequired: yup.boolean().nullable(),
      workType: yup.array().of(yup.number().integer()).nullable(),
      advisoryNotes: yup.string().nullable(),
      generalNotes: yup.string().nullable(),
      healthDetails: yup.string().nullable(),
      otherWorkTypes: yup.array().of(yup.string()).nullable(),
      notes: yup.string().nullable(),
    })
    .required(),

  agencyDetails: yup
    .object()
    .shape({
      agencyPersonId: yup.number().integer().nullable(),
      firstName: yup.string().nullable(),
      lastName: yup.string().nullable(),
      email: yup.string().email().nullable(),
      landline: yup.string().nullable(),
      address1: yup.string().nullable(),
      address2: yup.string().nullable(),
      address3: yup.string().nullable(),
      name: yup.string().nullable(),
      mobileNumber: yup.string().nullable(),
      website: yup.string().url().nullable(),
      town: yup.string().nullable(),
      postcode: yup.string().nullable(),
      country: yup.number().integer().nullable(),
      agencyName: yup.string().nullable(),
      landlineNumber: yup.string().nullable(),
    })
    .nullable(),

  salaryAccountDetails: yup
    .object()
    .shape({
      paidTo: yup.string().nullable(),
      accountName: yup.string().nullable(),
      accountNumber: yup.string().nullable(),
      sortCode: yup.string().nullable(),
      swift: yup.string().nullable(),
      iban: yup.string().nullable(),
      country: yup.number().integer().nullable(),
    })
    .nullable(),

  expenseAccountDetails: yup
    .object()
    .shape({
      paidTo: yup.string().nullable(),
      accountName: yup.string().nullable(),
      accountNumber: yup.string().nullable(),
      sortCode: yup.string().nullable(),
      swift: yup.string().nullable(),
      iban: yup.string().nullable(),
      country: yup.number().integer().nullable(),
    })
    .nullable(),

  emergencyContact1: yup
    .object()
    .shape({
      id: yup.number().integer().nullable(),
      firstName: yup.string().nullable(),
      lastName: yup.string().nullable(),
      email: yup.string().email().nullable(),
      landline: yup.string().nullable(),
      address1: yup.string().nullable(),
      address2: yup.string().nullable(),
      address3: yup.string().nullable(),
      town: yup.string().nullable(),
      mobileNumber: yup.string().nullable(),
      passportName: yup.string().nullable(),
      passportNumber: yup.string().nullable(),
      hasUKWorkPermit: yup.boolean().nullable(),
      passportExpiryDate: yup.date().nullable(),
      postcode: yup.string().nullable(),
      checkedBy: yup.number().integer().nullable(),
      country: yup.number().integer().nullable(),
      isFEURequired: yup.boolean().nullable(),
      advisoryNotes: yup.string().nullable(),
      generalNotes: yup.string().nullable(),
      healthDetails: yup.string().nullable(),
      notes: yup.string().nullable(),
    })
    .nullable(),

  emergencyContact2: yup
    .object()
    .shape({
      id: yup.number().integer().nullable(),
      firstName: yup.string().nullable(),
      lastName: yup.string().nullable(),
      email: yup.string().email().nullable(),
      landline: yup.string().nullable(),
      address1: yup.string().nullable(),
      address2: yup.string().nullable(),
      address3: yup.string().nullable(),
      town: yup.string().nullable(),
      mobileNumber: yup.string().nullable(),
      passportName: yup.string().nullable(),
      passportNumber: yup.string().nullable(),
      hasUKWorkPermit: yup.boolean().nullable(),
      passportExpiryDate: yup.date().nullable(),
      postcode: yup.string().nullable(),
      checkedBy: yup.number().integer().nullable(),
      country: yup.number().integer().nullable(),
      isFEURequired: yup.boolean().nullable(),
      advisoryNotes: yup.string().nullable(),
      generalNotes: yup.string().nullable(),
      healthDetails: yup.string().nullable(),
      notes: yup.string().nullable(),
    })
    .nullable(),
});

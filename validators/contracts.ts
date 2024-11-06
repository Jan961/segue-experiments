import * as yup from 'yup';

export const scheduleDaySchema = yup.object().shape({
  productionCode: yup.string().required('Production code is required'),
  day: yup.string().required('Day is required'),
  date: yup.string().required('Date is required'),
  // .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in the format YYYY-MM-DD'),
  week: yup.number().required('Week is required').integer('Week must be an integer'),
  venue: yup.string().nullable(),
  isOtherDay: yup.boolean().nullable(),
  isCancelled: yup.boolean().nullable(),
  location: yup.string().nullable(),
  type: yup.string().nullable(),
  status: yup.string().nullable(),
  capacity: yup.number().integer('Capacity must be an integer').nullable(),
  performancesPerDay: yup.number().integer('Performances per day must be an integer').nullable(),
  performance1: yup.string().nullable(),
  performance2: yup.string().nullable(),
  mileage: yup.number().min(0, 'Mileage must be a positive number').nullable(),
  time: yup
    .string()
    // .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in the format HH:mm')
    .nullable(),
});

export const contractDataSchema = yup.array().of(
  yup.object().shape({
    compID: yup
      .number()
      .required('Component ID is required')
      .integer('Component ID must be an integer')
      .positive('Component ID must be positive'),
    index: yup
      .number()
      .required('Index is required')
      .integer('Index must be an integer')
      .min(0, 'Index cannot be negative'),
  }),
);

export const contractSchemaCreate = yup.object().shape({
  production: yup.number().integer().required(),
  department: yup.number().required(),
  role: yup.string().required(),
  personId: yup.number().integer().required(),
  templateId: yup.number().integer().required(),
  contractData: contractDataSchema.required(),
  accScheduleJson: yup.array().nullable(),
});

export const contractSchemaUpdate = yup.object().shape({
  contractId: yup.number().integer().required(),
  contractData: contractDataSchema.required(),
});

export const updateContractSchema = yup.object().shape({
  roleName: yup.string().nullable(),
  contractStatus: yup.string().nullable(),
  completedByAccUserId: yup.number().integer().nullable(),
  checkedByAccUserId: yup.number().integer().nullable(),
  dateIssued: yup.date().nullable(),
  dateReturned: yup.date().nullable(),
  notes: yup.string().nullable(),
  currencyCode: yup.string().nullable(),
  firstDay: yup.date().nullable(),
  lastDay: yup.date().nullable(),
  availability: yup.string().nullable(),
  rehearsalLocation: yup.string().nullable(),
  rehearsalVenueId: yup.number().integer().nullable(),
  rehearsalVenueNotes: yup.string().nullable(),
  isAccomProvided: yup.boolean().nullable(),
  accomNotes: yup.string().nullable(),
  isTransportProvided: yup.boolean().nullable(),
  transportNotes: yup.string().nullable(),
  isNominatedDriver: yup.boolean().nullable(),
  nominatedDriverNotes: yup.string().nullable(),
  paymentType: yup.string().nullable(),
  weeklyRehFee: yup.number().nullable(),
  weeklyRehHolPay: yup.number().nullable(),
  weeklyPerfFee: yup.number().nullable(),
  weeklyPerfHolPay: yup.number().nullable(),
  weeklySubs: yup.number().nullable(),
  weeklySubsNotes: yup.string().nullable(),
  totalFee: yup.number().nullable(),
  totalHolPay: yup.number().nullable(),
  totalFeeNotes: yup.string().nullable(),
  cancelFee: yup.number().nullable(),
  productionId: yup.number().integer().nullable(),
  departmentId: yup.number().integer().nullable(),
  personId: yup.number().integer().nullable(),
  currency: yup.string().length(3).nullable(),
  venueId: yup.number().integer().nullable(),
  accScheduleJson: yup.array().nullable(),
});

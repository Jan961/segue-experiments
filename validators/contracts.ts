import * as yup from 'yup';

export const contractDetailsSchema = yup.object().shape({
  currency: yup.string().length(3).required(),
  firstDayOfWork: yup.date().nullable(),
  lastDayOfWork: yup.date().nullable(),
  specificAvailabilityNotes: yup.string().nullable(),
  publicityEventList: yup
    .array()
    .of(
      yup.object().shape({
        isRequired: yup.boolean().required(),
        date: yup.date().nullable(),
        notes: yup.string().nullable(),
      }),
    )
    .nullable(),
  rehearsalVenue: yup
    .object()
    .shape({
      townCity: yup.string().nullable(),
      venue: yup.number().integer().nullable(),
      notes: yup.string().nullable(),
    })
    .nullable(),
  isAccomodationProvided: yup.boolean().nullable(),
  accomodationNotes: yup.string().nullable(),
  isTransportProvided: yup.boolean().nullable(),
  transportNotes: yup.string().nullable(),
  isNominatedDriver: yup.boolean().nullable(),
  nominatedDriverNotes: yup.string().nullable(),
  paymentType: yup.string().nullable(),
  weeklyPayDetails: yup
    .object()
    .shape({
      rehearsalFee: yup.number().nullable(),
      rehearsalHolidayPay: yup.number().nullable(),
      performanceFee: yup.number().nullable(),
      performanceHolidayPay: yup.number().nullable(),
      touringAllowance: yup.number().nullable(),
      subsNotes: yup.string().nullable(),
    })
    .nullable(),
  totalPayDetails: yup
    .object()
    .shape({
      totalFee: yup.number().nullable(),
      totalHolidayPay: yup.number().nullable(),
      feeNotes: yup.string().nullable(),
    })
    .nullable(),
  paymentBreakdownList: yup
    .array()
    .of(
      yup.object().shape({
        date: yup.date().required(),
        amount: yup.number().required(),
        notes: yup.string().nullable(),
      }),
    )
    .nullable(),
  cancellationFee: yup.number().nullable(),
  cancellationFeeNotes: yup.string().nullable(),
  includeAdditionalClauses: yup.boolean().nullable(),
  additionalClause: yup.array().of(yup.number().integer()).nullable(),
  customClauseList: yup.array().of(yup.string()).nullable(),
  includeClauses: yup.boolean().nullable(),
});

export const contractSchema = yup.object().shape({
  production: yup.number().integer().required(),
  department: yup.string().required(),
  role: yup.string().required(),
  personId: yup.number().integer().required(),
  templateId: yup.number().integer().required(),
  contractDetails: contractDetailsSchema.required(),
});

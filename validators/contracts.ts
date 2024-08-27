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
        date: yup.date().nullable(),
        amount: yup.number().nullable(),
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
  department: yup.number().required(),
  role: yup.string().required(),
  personId: yup.number().integer().required(),
  templateId: yup.number().integer().required(),
  contractDetails: contractDetailsSchema.required(),
});

export const updateContractSchema = yup.object().shape({
  roleName: yup.string().nullable(),
  contractStatus: yup.string().length(4).nullable(),
  completedByAccUserId: yup.number().integer().nullable(),
  checkedByAccUserId: yup.number().integer().nullable(),
  dateIssued: yup.date().nullable(),
  dateReturned: yup.date().nullable(),
  notes: yup.string().nullable(),
  currencyCode: yup.string().length(3).nullable(),
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
});

import * as yup from 'yup';

export const productionSchema = (isCreate = false) =>
  yup.object().shape({
    ...(!isCreate && { id: yup.number().required() }),
    showId: yup.number().optional(),
    code: yup.string().optional(),
    isArchived: yup.boolean().optional(),
    image: yup
      .object()
      .shape({
        id: yup.number().optional(),
        imageUrl: yup.string().optional(),
        name: yup.string().optional(),
      })
      .nullable()
      .optional(),
    company: yup.number().required(),
    runningTime: yup.string().nullable().optional(),
    runningTimeNote: yup.string().nullable().optional(),
    currency: yup.string().optional(),
    salesEmail: yup.string().email().nullable().optional(),
    salesFrequency: yup.string().optional(),
    regionList: yup.array().of(yup.number()).optional(),
    dateBlockList: yup
      .array()
      .of(
        yup.object().shape({
          name: yup.string().optional(),
          startDate: yup.string().optional(),
          endDate: yup.string().optional(),
          isPrimary: yup.boolean().optional(),
        }),
      )
      .optional(),
  });

import * as yup from 'yup';

export const productionTaskSchema = yup.object().shape({
  ProductionId: yup.number().required('Id is a required field'),
  Code: yup.string().required('Code is a required field'),
  Name: yup.string().required('Name is a required field'),
  CopiedFrom: yup.number(),
  CopiedId: yup.number(),
  Priority: yup.number().optional(),
  Notes: yup.boolean().optional(),
  Progress: yup.number().required('Progress is a required field'),
  StartByWeekNum: yup.number(),
  CompleteByWeekNum: yup.number(),
  TaskCompletedDate: yup.date(),
  PRTId: yup.number(),
});

export const recurringProductionTaskSchema = yup.object().shape({
  PRTId: yup.number(),
  Interval: yup.string().required('RepeatInterval is a required field'),
  FromWeekNum: yup.number().required('TaskRepeatFromWeekNum is a required field'),
  ToWeekNum: yup.number().required('TaskRepeatToWeekNum is a required field'),
  FromWeekNumIsPostProduction: yup.bool().required('FromWeekNumIsPostProduction'),
  ToWeekNumIsPostProduction: yup.bool().required('ToWeekNumIsPostProduction'),
});

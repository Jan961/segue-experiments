import * as yup from 'yup';

export const productionTaskSchema = yup.object().shape({
  ProductionId: yup.number().required('Id is a required field'),
  Code: yup.string().required('Code is a required field'),
  Name: yup.string().required('Name is a required field'),
  CopiedFrom: yup.number().nullable(),
  CopiedId: yup.number().optional().nullable(),
  Priority: yup.number().optional().nullable(),
  Notes: yup.string().optional().nullable(),
  Progress: yup.number().required('Progress is a required field'),
  StartByWeekNum: yup.number().nullable(),
  CompleteByWeekNum: yup.number().nullable(),
  TaskCompletedDate: yup.date().nullable(),
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

export const masterTaskSchema = yup.object().shape({
  Code: yup.string().required('Code is a required field'),
  Name: yup.string().required('Name is a required field'),
  CopiedFrom: yup.string().nullable(),
  CopiedId: yup.number().optional().nullable(),
  Priority: yup.number().optional().nullable(),
  Notes: yup.string().optional().nullable(),
  TaskAssignedToAccUserId: yup.number().optional().nullable(),
  StartByWeekNum: yup.number().nullable(),
  CompleteByWeekNum: yup.number().nullable(),
  TaskCompletedDate: yup.date().nullable(),
  MRTId: yup.number().optional().nullable(),
});

export const recurringMasterTaskSchema = yup.object().shape({
  Interval: yup.string().required('RepeatInterval is a required field'),
  FromWeekNum: yup.number().required('TaskRepeatFromWeekNum is a required field'),
  ToWeekNum: yup.number().required('TaskRepeatToWeekNum is a required field'),
  FromWeekNumIsPostProduction: yup.bool().required('FromWeekNumIsPostProduction'),
  ToWeekNumIsPostProduction: yup.bool().required('ToWeekNumIsPostProduction'),
});

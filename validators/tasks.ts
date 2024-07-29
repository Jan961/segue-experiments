import * as yup from 'yup';

export const productionTaskSchema = yup.object().shape({
  Id: yup.number().required('Id is a required field'),
  ProductionId: yup.number().required('Id is a required field'),
  Code: yup.string().required('Code is a required field'),
  Name: yup.string().required('Name is a required field'),
  CopiedFrom: yup.number(),
  CopiedId: yup.number(),
  Priority: yup.number(),
  Notes: yup.boolean().optional(),
  Progress: yup.number().required('Progress is a required field'),
  AssignedToUserId: yup.number().required('AssignedToUserId is a required field'),
  CompleteByIsPostProduction: yup.boolean().required('CompleteByIsPostProduction is a required field'),
  StartByWeekNum: yup.number(),
  CompleteByWeekNum: yup.number(),
  TaskCompletedDate: yup.date(),
  PRTId: yup.number(),
});

export const recurringProductionTaskSchema = yup.object().shape({
  Id: yup.number().required('Id is a required field'),
  ProductionId: yup.number().required('Id is a required field'),
  Code: yup.string().required('Code is a required field'),
  Name: yup.string().required('Name is a required field'),
  CopiedFrom: yup.number(),
  CopiedId: yup.number(),
  Priority: yup.number(),
  Notes: yup.boolean().optional(),
  Progress: yup.number().required('Progress is a required field'),
  StartByWeekNum: yup.number(),
  CompleteByWeekNum: yup.number(),
  TaskCompletedDate: yup.date(),
  PRTId: yup.number(),
  RepeatInterval: yup.string().required('Name is a required field'),
  TaskRepeatFromWeekNum: yup.number().required('Progress is a required field'),
  TaskRepeatToWeekNum: yup.number().required('Progress is a required field'),
});

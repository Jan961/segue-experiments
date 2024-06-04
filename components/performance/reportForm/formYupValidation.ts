import * as Yup from 'yup';
import { isAfter, isEqual } from 'date-fns';

export const formSchema = Yup.object({
  actOneUpTime: Yup.string()
    .required('Act one UP time cannot be empty')
    .test('is-greater', 'Act one UP time should be equal or greater than performance time', function (value) {
      const { performanceTime } = this.parent as { performanceTime: string };
      return (
        isEqual(new Date(`2023-01-01 ${value ?? '00:00'}`), new Date(`2023-01-01 ${performanceTime}`)) ||
        isAfter(new Date(`2023-01-01 ${value ?? '00:00'}`), new Date(`2023-01-01 ${performanceTime}`))
      );
    }),
  actOneDownTime: Yup.string()
    .required('Act one DOWN time cannot be empty')
    .test('is-greater', 'Act one DOWN time should be greater than Act one UP time', function (value) {
      const { actOneUpTime } = this.parent as { actOneUpTime: string };
      return isAfter(new Date(`2023-01-01 ${value ?? '00:00'}`), new Date(`2023-01-01 ${actOneUpTime}`));
    }),
  intervalDownTime: Yup.string()
    .required('Interval DOWN time cannot be empty')
    .test('is-greater', 'Interval DOWN time should be greater than Act one DOWN time', function (value) {
      const { actOneDownTime } = this.parent as { actOneDownTime: string };
      return isAfter(new Date(`2023-01-01 ${value ?? '00:00'}`), new Date(`2023-01-01 ${actOneDownTime}`));
    }),
  actTwoDownTime: Yup.string()
    .required('Act two DOWN time cannot be empty')
    .test('is-greater', 'Act two DOWN time should be greater than Act two UP time', function (value) {
      const { intervalDownTime } = this.parent as { intervalDownTime: string };
      return isAfter(new Date(`2023-01-01 ${value ?? '00:00'}`), new Date(`2023-01-01 ${intervalDownTime}`));
    }),
  // getOutTime: Yup.string()
  //   .required('Get out time cannot be empty')
  //   .test('is-greater', 'Get out time should be greater than Act two DOWN time', function (value) {
  //     const { actTwoDownTime } = this.parent as { actTwoDownTime: string };
  //     return isAfter(new Date(`2023-01-01 ${value ?? '00:00'}`), new Date(`2023-01-01 ${actTwoDownTime}`));
  // }),
  // dutyTechnician: Yup.string().required('Duty Technician cannot be empty'),
  castCrewInjury: Yup.string(),
  castCrewAbsence: Yup.string(),
  technicalNote: Yup.string(),
  performanceNote: Yup.string(),
  setPropCustumeNote: Yup.string(),
  audienceNote: Yup.string(),
  merchandiseNote: Yup.string(),
  generalRemarks: Yup.string(),
  distributionList: Yup.string(),
  performanceTime: Yup.string(),
});

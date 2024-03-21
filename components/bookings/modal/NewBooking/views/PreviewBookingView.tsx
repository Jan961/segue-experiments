import Button from 'components/core-ui-lib/Button';
import { useWizard } from 'react-use-wizard';
import { steps } from 'config/AddBooking';
import { useEffect, useMemo } from 'react';
import PreviewBookingDetails, { PreviewBookingDetailsProps } from './PreviewBookingDetails';
import { isNullOrEmpty } from 'utils';

type PreviewBookingViewProps = PreviewBookingDetailsProps & {
  onSaveBooking: () => void;
  updateModalTitle: (title: string) => void;
};
export default function PreviewBookingView(props: PreviewBookingViewProps) {
  const { goToStep } = useWizard();
  const { formData, data = [] } = props;
  useEffect(() => {
    props.updateModalTitle('Preview New Booking');
  }, []);

  const previousStepFunc = () => {
    goToStep(steps.indexOf('New Booking Details'));
  };

  const areInputFieldsValid = useMemo(() => {
    if (formData.isRunOfDates) {
      const rowsWithNoDayType = data.filter(({ dayType }) => isNullOrEmpty(dayType));
      return isNullOrEmpty(rowsWithNoDayType);
    } else {
      return true;
    }
  }, [data, formData]);

  return (
    <>
      <PreviewBookingDetails {...props} />
      <div className="pt-8 w-full flex justify-end  gap-3 float-right">
        <div className="flex gap-4">
          <Button className="w-33" variant="secondary" text="Back" onClick={previousStepFunc} />
          <Button className="w-33" text="Accept" onClick={props.onSaveBooking} disabled={!areInputFieldsValid} />
        </div>
      </div>
    </>
  );
}

import Button from 'components/core-ui-lib/Button';
import { useWizard } from 'react-use-wizard';
import { getStepIndex } from 'config/AddBooking';
import { useEffect, useMemo } from 'react';
import PreviewBookingDetails, { PreviewBookingDetailsProps } from './PreviewBookingDetails';
import { isNullOrEmpty } from 'utils';

type PreviewBookingViewProps = PreviewBookingDetailsProps & {
  onSaveBooking: () => void;
  updateModalTitle: (title: string) => void;
};
export default function PreviewBookingView(props: PreviewBookingViewProps) {
  const { goToStep } = useWizard();
  const { formData, originalRows, updatedRows = [], isNewBooking } = props;

  const rows = isNewBooking ? originalRows : updatedRows;

  useEffect(() => {
    props.updateModalTitle('Preview New Booking');
  }, []);

  const previousStepFunc = () => {
    goToStep(getStepIndex(isNewBooking, 'New Booking Details'));
  };

  const areInputFieldsValid = useMemo(() => {
    if (rows && formData.isRunOfDates) {
      const rowsWithNoDayType = rows.filter(({ dayType }) => isNullOrEmpty(dayType));
      return isNullOrEmpty(rowsWithNoDayType);
    } else {
      return true;
    }
  }, [rows, formData]);

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

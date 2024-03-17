import Button from 'components/core-ui-lib/Button';
import { useWizard } from 'react-use-wizard';
import { steps } from 'config/AddBooking';
import { useEffect } from 'react';
import PreviewBookingDetails, { PreviewBookingDetailsProps } from './PreviewBookingDetails';

type PreviewBookingViewProps = PreviewBookingDetailsProps & {
  onSaveBooking: () => void;
  updateModalTitle: (title: string) => void;
};
export default function PreviewBookingView(props: PreviewBookingViewProps) {
  const { goToStep } = useWizard();

  useEffect(() => {
    props.updateModalTitle('Preview New Booking');
  }, []);

  const previousStepFunc = () => {
    goToStep(steps.indexOf('New Booking Details'));
  };

  return (
    <>
      <PreviewBookingDetails {...props} />
      <div className="pt-8 w-full flex justify-end  gap-3 float-right">
        <div className="flex gap-4">
          <Button className="w-33" variant="secondary" text="Back" onClick={previousStepFunc} />
          <Button className="w-33" text="Accept" onClick={props.onSaveBooking} />
        </div>
      </div>
    </>
  );
}

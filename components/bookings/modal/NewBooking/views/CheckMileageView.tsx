import Button from 'components/core-ui-lib/Button';
import { useWizard } from 'react-use-wizard';
import { getStepIndex } from 'config/AddBooking';
import { useEffect, useState } from 'react';
import PreviewBookingDetails, { PreviewBookingDetailsProps } from './PreviewBookingDetails';

type CheckMileageViewProps = PreviewBookingDetailsProps & {
  updateModalTitle: (title: string) => void;
  previousView: string;
};
export default function CheckMileageView(props: CheckMileageViewProps) {
  const { goToStep } = useWizard();
  const [previousView, setPreviousView] = useState<string>('');

  useEffect(() => {
    // Set previous view before updating the modal title. This will be used on back button click
    setPreviousView(props.previousView);
    props.updateModalTitle('Check Mileage');
  }, []);

  const handleCloseClick = () => {
    goToStep(getStepIndex(props.isNewBooking, previousView));
  };
  return (
    <>
      <PreviewBookingDetails {...props} />
      <div className="pt-8 w-full flex justify-end  gap-3 float-right">
        <div className="flex gap-4">
          <Button className=" w-33  " text="Close" onClick={handleCloseClick} />
        </div>
      </div>
    </>
  );
}

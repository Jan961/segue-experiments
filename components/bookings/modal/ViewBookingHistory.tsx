import React from 'react';
import { GetServerSideProps } from 'next';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import { StyledDialog } from 'components/global/StyledDialog';

interface ViewBookingHistoryProps {
  venueId: number;
}

export default function ViewBookingHistory({ venueId }: ViewBookingHistoryProps) {
  const [showModal, setShowModal] = React.useState(false);

  /*

  // Previous Code. Was just copy and paste from other modal
  const [venueData, setVenueData] = useState([])

  useEffect(() => {
    if (showModal) {
      fetch(`/api/venue/${venueId}`)
        .then(res => res.json())
        .then(venueData => {
          setVenueData(venueData)
        })
    }
  }, [VenueId, showModal])
  */

  return (
    <>
      <FormInputButton text="History" disabled className="w-full block" onClick={() => setShowModal(true)} />
      {showModal && (
        <StyledDialog title="Venue Information" width="lg" open={showModal} onClose={() => setShowModal(false)}>
          <p>Not Implimented</p>
        </StyledDialog>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

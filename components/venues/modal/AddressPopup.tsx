import { Button, PopupModal } from '../../core-ui-lib';

export interface AddressPopupProps {
  show: boolean;
  onYesClick: () => void;
  closeModal: () => void;
  message: string;
}

export const AddressPopup = ({ show, onYesClick, message, closeModal }: AddressPopupProps) => {
  let popupMessage;

  switch (message) {
    case 'Located': {
      popupMessage =
        'Venue address located. Mileage and Travel Times will be added to your system as soon as they are available';
      break;
    }
    case 'NotFound': {
      popupMessage = 'Venue address not found. Please check address details.';
      break;
    }
    case 'UsingWhat3Words': {
      popupMessage =
        'Venue address not found. Location will be calculated using What3Words. Mileage and Travel Times will be added to your system as soon as they are available';
      break;
    }
    case 'NotUsingWhat3Words': {
      popupMessage = 'Venue address not found. Please complete the Venue Entrance What3Words field to continue';
      break;
    }

    default: {
      popupMessage = message;
    }
  }

  return (
    <PopupModal show={show} title="Venue Address">
      <p>{popupMessage}</p>
      <Button
        onClick={() => {
          onYesClick();
          if (message === 'Located' || message === 'UsingWhat3Words') closeModal();
        }}
      >
        OK
      </Button>
    </PopupModal>
  );
};

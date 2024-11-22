import { UiTransformedVenue } from 'utils/venue';
import axios from 'axios';
import { getFastHostServerUrl } from 'utils';

export const addVenueToMilageCalculator = async (venueInfo: UiTransformedVenue) => {
  const {
    primaryAddress1,
    primaryAddress2,
    primaryAddress3,
    primaryPostCode,
    primaryTown,
    primaryCountry,
    primaryCoordinates,
  } = venueInfo;

  const endpoint = getFastHostServerUrl('/addVenue');

  await axios.post(endpoint, [
    {
      VenueAddress1: primaryAddress1,
      VenueAddress2: primaryAddress2,
      VenueAddress3: primaryAddress3,
      VenueAddressTown: primaryTown,
      VenueAddressCountryId: primaryCountry,
      VenueAddressPostcode: primaryPostCode,
      coordinates: primaryCoordinates,
    },
  ]);
};

import { UiTransformedVenue } from 'utils/venue';
import axios from 'axios';

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
  //  This address is my personal server running the Routing for GB + Ireland
  await axios.post(process.env.EUROPE_ROUTING_SERVER_BASE_URL, [
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

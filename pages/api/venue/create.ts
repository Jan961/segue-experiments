import type { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { getAccountId, getEmailFromReq } from 'services/userService';
import { createVenue } from 'services/venueService';
import { mapVenueContactToPrisma } from 'utils/venue';
import { addVenueToMilageCalculator } from 'services/addVenueToMilageCalculator';
import { formatCoords } from 'utils/formatCoords';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const email = await getEmailFromReq(req);
    const accountId = await getAccountId(email);
    const {
      venueCode: Code,
      venueName: Name,
      venueStatus: StatusCode,
      vatIndicator: VATIndicator,
      culturallyExempt: CulturallyExempt,
      venueFamily: FamilyId,
      venueCapacity: Seats,
      townPopulation: TownPopulation,
      venueWebsite: Website,
      notes: VenueNotes,
      barringMiles: BarringMiles,
      postShow: BarringWeeksPost,
      preShow: BarringWeeksPre,
      barringClause: BarringClause,
      confidentialNotes: VenueWarningNotes,
      soundDesk: SoundDesk,
      soundNotes: SoundNotes,
      techLXDesk: LXDesk,
      techLXNotes: LXNotes,
      stageSize: StageSize,
      gridHeight: GridHeight,
      techSpecsUrl: TechSpecsURL,
      what3WordsStage: AddressStageDoorW3W,
      what3WordsLoading: AddressLoadingW3W,
      flags: VenueFlags,
      excludeFromChecks: ExcludeFromChecks,
      primaryAddress1,
      primaryAddress2,
      primaryAddress3,
      primaryPostCode,
      primaryTown,
      primaryCountry,
      primaryPhoneNumber,
      primaryEMail,
      primaryCoordinates,
      deliveryAddress1,
      deliveryAddress2,
      deliveryAddress3,
      deliveryPostCode,
      deliveryCountry,
      deliveryTown,
      deliveryPhoneNumber,
      deliveryEMail,
      barredVenues,
      venueContacts,
    } = req.body;
    const { latitude, longitude } = formatCoords(primaryCoordinates);
    const primaryAddress = {
      Line1: primaryAddress1,
      Line2: primaryAddress2,
      Line3: primaryAddress3,
      Town: primaryTown,
      CountryId: primaryCountry,
      Postcode: primaryPostCode,
      TypeName: 'Main',
      Phone: primaryPhoneNumber,
      Email: primaryEMail,
      Latitude: latitude,
      Longitude: longitude,
    };

    const deliveryAddress = {
      Line1: deliveryAddress1,
      Line2: deliveryAddress2,
      Line3: deliveryAddress3,
      Town: deliveryTown,
      CountryId: deliveryCountry,
      Postcode: deliveryPostCode,
      TypeName: 'Delivery',
      Phone: deliveryPhoneNumber,
      Email: deliveryEMail,
    };
    try {
      const prisma = await getPrismaClient(req);
      const venue = await prisma.$transaction(async (tx) => {
        return createVenue(
          tx,
          {
            Code,
            Name,
            StatusCode,
            VATIndicator,
            CulturallyExempt,
            FamilyId,
            Seats,
            TownPopulation,
            Website,
            VenueNotes,
            BarringWeeksPost,
            BarringWeeksPre,
            BarringMiles,
            BarringClause,
            VenueWarningNotes,
            LXDesk,
            LXNotes,
            SoundDesk,
            SoundNotes,
            StageSize,
            GridHeight,
            TechSpecsURL,
            VenueFlags,
            ExcludeFromChecks,
            VenueAccountId: accountId,
            AddressLoadingW3W,
            AddressStageDoorW3W,
          },
          [primaryAddress, deliveryAddress],
          venueContacts.map(mapVenueContactToPrisma),
          barredVenues.map(({ id: Id, barredVenueId: BarredVenueId }) => ({
            Id,
            BarredVenueId,
          })),
        );
      });
      await addVenueToMilageCalculator(req.body);

      res.status(200).json(venue);
    } catch (error) {
      console.error('Request error', error);
      res.status(500).json({ message: 'Error creating venue' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

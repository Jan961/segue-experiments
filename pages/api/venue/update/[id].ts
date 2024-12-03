import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import { updateVenue } from 'services/venueService';
import { mapVenueContactToPrisma } from 'utils/venue';
import { all } from 'radash';
import { addVenueToMilageCalculator } from 'services/addVenueToMilageCalculator';
import { formatCoords } from 'utils/formatCoords';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    const prisma = await getPrismaClient(req);
    const VenueId = parseInt(req.query.id as string, 10);
    if (!VenueId) {
      return res.status(400).json({ error: 'missing required params' });
    }
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
      what3WordsEntrance: AddressEntranceW3W,
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
      primaryAddressId,
      primaryCoordinates,
      deliveryAddressId,
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
    const addresses = [];
    if (
      primaryAddressId ||
      primaryAddress1 ||
      primaryAddress2 ||
      primaryAddress3 ||
      primaryPostCode ||
      primaryTown ||
      primaryCountry ||
      primaryCoordinates
    ) {
      addresses.push({
        Id: primaryAddressId,
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
      });
    }
    if (
      deliveryAddress1 ||
      deliveryAddress2 ||
      deliveryAddress3 ||
      deliveryAddressId ||
      deliveryTown ||
      deliveryCountry ||
      deliveryPostCode
    ) {
      addresses.push({
        Id: deliveryAddressId,
        Line1: deliveryAddress1,
        Line2: deliveryAddress2,
        Line3: deliveryAddress3,
        Town: deliveryTown,
        CountryId: deliveryCountry,
        Postcode: deliveryPostCode,
        TypeName: 'Delivery',
        Phone: deliveryPhoneNumber,
        Email: deliveryEMail,
      });
    }
    const updatedData = {
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
      AddressStageDoorW3W,
      AddressLoadingW3W,
      AddressEntranceW3W,
    };
    let updatedVenue;
    const barredVenueIds = barredVenues.map(({ barredVenueId }) => barredVenueId).filter((x: number) => x);
    const venueContactIds = venueContacts.map(({ id }) => id).filter((x: number) => x);
    await prisma.$transaction(async (tx) => {
      const deleteBarredRecordsPromise = tx.venueBarredVenue.deleteMany({
        where: {
          AND: [
            {
              VenueId,
            },
            {
              BarredVenueId: {
                not: {
                  in: barredVenueIds,
                },
              },
            },
          ],
        },
      });
      const deleteVenueContactsPromise = tx.venueContact.deleteMany({
        where: {
          AND: [
            {
              VenueId,
            },
            {
              Id: {
                not: {
                  in: venueContactIds,
                },
              },
            },
          ],
        },
      });
      const updateVenuePromise = updateVenue(
        tx,
        VenueId,
        updatedData,
        addresses,
        barredVenues.map(({ id: Id, barredVenueId: BarredVenueId }) => ({
          Id,
          BarredVenueId,
        })),
        venueContacts.map(mapVenueContactToPrisma),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, __, updatedVenueData] = await all([
        deleteVenueContactsPromise,
        deleteBarredRecordsPromise,
        updateVenuePromise,
      ]);
      updatedVenue = updatedVenueData;
    });

    await addVenueToMilageCalculator(req.body);

    res.status(200).json(updatedVenue);
  } catch (error) {
    console.error('Error updating Venue:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

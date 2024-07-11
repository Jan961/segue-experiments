import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import { updateVenue } from 'services/venueService';
import { mapVenueContactToPrisma } from 'utils/venue';
import { all } from 'radash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
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
      currency: CurrencyCode,
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
      flags: VenueFlags,
      excludeFromChecks: ExcludeFromChecks,
      what3WordsStage: AddressStageDoorW3W,
      what3WordsLoading: AddressLoadingW3W,
      primaryAddressId,
      primaryAddress1,
      primaryAddress2,
      primaryAddress3,
      primaryPostCode,
      primaryTown,
      primaryCountry,
      deliveryAddressId,
      deliveryAddress1,
      deliveryAddress2,
      deliveryAddress3,
      deliveryPostCode,
      deliveryCountry,
      deliveryTown,
      barredVenues,
      venueContacts,
    } = req.body;
    const addresses = [];
    if (
      primaryAddressId ||
      primaryAddress1 ||
      primaryAddress2 ||
      primaryAddress3 ||
      primaryPostCode ||
      primaryTown ||
      primaryCountry
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
      });
    }
    const updatedData = {
      Code,
      Name,
      StatusCode,
      VATIndicator,
      CulturallyExempt,
      FamilyId,
      CurrencyCode,
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
    };
    let updatedVenue;
    const barredVenueIds = barredVenues.map(({ barredVenueId }) => barredVenueId).filter((x: number) => x);
    const venueContactIds = venueContacts.map(({ id }) => id).filter((x: number) => x);
    await prisma.$transaction(async (tx) => {
      const deleteBarredRecordsPromise = tx.VenueBarredVenue.deleteMany({
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
      const deleteVenueContactsPromise = tx.VenueContact.deleteMany({
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

    res.status(200).json(updatedVenue);
  } catch (error) {
    console.error('Error updating Venue:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import { createVenue } from 'services/venueService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const email = await getEmailFromReq(req);
    const accountId = await getAccountId(email);
    const {
      venueCode: Code,
      venueName: Name,
      venueStatus: statusCode,
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
      primaryAddress1,
      primaryAddress2,
      primaryAddress3,
      primaryPostCode,
      primaryTown,
      primaryCountry,
      deliveryAddress1,
      deliveryAddress2,
      deliveryAddress3,
      deliveryPostCode,
      deliveryCountry,
      deliveryTown,
    } = req.body;
    const primaryAddress = {
      Line1: primaryAddress1,
      Line2: primaryAddress2,
      Line3: primaryAddress3,
      Town: primaryTown,
      Country: primaryCountry,
      Postcode: primaryPostCode,
      TypeName: 'Main',
    };

    const deliveryAddress = {
      Line1: deliveryAddress1,
      Line2: deliveryAddress2,
      Line3: deliveryAddress3,
      Town: deliveryTown,
      Country: deliveryCountry,
      Postcode: deliveryPostCode,
      TypeName: 'Delivery',
    };

    try {
      const venue = await createVenue(
        {
          Code,
          Name,
          StatusCode: statusCode,
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
          VenueAccountId: accountId,
        },
        [primaryAddress, deliveryAddress],
      );
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

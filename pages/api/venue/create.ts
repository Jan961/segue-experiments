import type { NextApiRequest, NextApiResponse } from 'next';
import { createVenue } from 'services/venueService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
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
    } = req.body;

    try {
      const venue = await createVenue({
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
      });
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

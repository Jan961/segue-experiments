import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const VenueId: number = parseInt(req.query.venueID as string);
  //    console.log(JSON.stringify(req.body))
  try {
    await prisma.venue.update({
      where: {
        VenueId,
      },
      data: {
        Code: req.body.Code,
        Name: req.body.Name,
        Address1: req.body.Address1,
        // VATIndicator: req.body.VATIndicator,
        Address2: req.body.Address2,
        Address3: req.body.Address3,
        Seats: parseInt(req.body.Seats),
        Town: req.body.Town,
        Notes: req.body.Notes,
        Postcode: req.body.Postcode,
        County: req.body.County,
        Country: req.body.Country,
        DeliveryAddress1: req.body.DeliveryAddress1,
        DeliveryAddress2: req.body.DeliveryAddress2,
        DeliveryAddress3: req.body.DeliveryAddress3,
        DeliveryTown: req.body.DeliveryTown,
        DeliveryCounty: req.body.DeliveryCounty,
        DeliveryPostcode: req.body.DeliveryPostcode,
        DeliveryCountry: req.body.DeliveryCountry,
        Latitude: req.body.Latitude,
        Longitude: req.body.Longitude,
      },
    });
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(501).end();
  }

  return res;
}

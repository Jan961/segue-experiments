import prisma from 'lib/prisma';

/**
 *
 *

SELECT FullTourCode,
    ShowName,
    ShowDate,
    VenueCode,
    VenueName,
    Town,
    BookingStatus,
    OnSale,
    OnSaleDate,
    MarketingPlanReceived,
    ContactInfoReceived,
    PrintReqsReceived
FROM TourVenueView
WHERE(NOT VenueId IS NULL)
AND TourId =  17

AND OnSale
AND NOT OnSale
AND MarketingPlanReceived
AND NOT MarketingPlanReceived
AND ContactInfoReceived
AND NOT ContactInfoReceived
AND PrintReqsReceived
AND NOT PrintReqsReceived

 */

export default async function handle(req, res) {
  let query =
    'SELECT FullTourCode, ShowName,  ShowDate,  VenueCode,  VenueName, Town, BookingStatus, OnSale, OnSaleDate, MarketingPlanReceived,  ContactInfoReceived,  PrintReqsReceived  FROM TourVenueView  WHERE (NOT VenueId IS NULL) ';

  if (req.query.TourId != 'ALL') {
    query = query + ' AND TourId = ' + parseInt(req.query.TourId);
  }

  if (req.query.Options != 'ALL') {
    switch (req.query.Options.toUpperCase()) {
      case 'ON SALE': {
        query = query + ' AND OnSale ';
        break;
      }
      case 'NOT ON SALE': {
        query = query + ' AND NOT OnSale ';
        break;
      }
      case 'MARKETING PLANS RECEIVED': {
        query = query + ' AND MarketingPlanReceived ';
        break;
      }
      case 'MARKETING PLANS NOT RECEIVED': {
        query = query + ' AND NOT MarketingPlanReceived ';
        break;
      }

      case 'CONTACT INFO RECEIVED': {
        query = query + ' AND ContactInfoReceived ';
        break;
      }
      case 'CONTACT INFO NOT RECEIVED': {
        query = query + ' AND NOT ContactInfoReceived ';
        break;
      }

      case 'PRINT REQUIREMENTS RECEIVED': {
        query = query + ' AND PrintReqsReceived ';
        break;
      }
      case 'PRINT REQUIREMENTS NOT RECEIVED': {
        query = query + ' AND NOT PrintReqsReceived ';
        break;
      }

      default: {
        //statements;
        break;
      }
    }
  }
  if (req.query.TourId != 'ALL') {
    query = query + ' ORDER BY ShowDate ';
  } else {
    query = query + ' ORDER BY TourStartDate, ShowDate ';
  }

  try {
    let result = await prisma.$queryRawUnsafe(`${query}`);
    res.json(result);
  } catch (e) {
    throw e;
    res.statusCode(400);
  }
}

SELECT
  `frtxigoo_Sachin`.`VenueBarredVenue`.`VBVId` AS `VenueId`,
  `frtxigoo_Sachin`.`VenueBarredVenue`.`VBVBarredVenueId` AS `BarredVenueId`,
  'Barring' AS `BarType`
FROM
  `frtxigoo_Sachin`.`VenueBarredVenue`
UNION
SELECT
  `frtxigoo_Sachin`.`VenueBarredVenue`.`VBVBarredVenueId` AS `VenueId`,
  `frtxigoo_Sachin`.`VenueBarredVenue`.`VBVId` AS `BarredVenueId`,
  'Barred' AS `BarType`
FROM
  `frtxigoo_Sachin`.`VenueBarredVenue`
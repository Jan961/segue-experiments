SELECT
  `frtxigoo_dev2`.`VenueBarredVenue`.`VBVId` AS `VenueId`,
  `frtxigoo_dev2`.`VenueBarredVenue`.`VBVBarredVenueId` AS `BarredVenueId`,
  'Barring' AS `BarType`
FROM
  `frtxigoo_dev2`.`VenueBarredVenue`
UNION
SELECT
  `frtxigoo_dev2`.`VenueBarredVenue`.`VBVBarredVenueId` AS `VenueId`,
  `frtxigoo_dev2`.`VenueBarredVenue`.`VBVId` AS `BarredVenueId`,
  'Barred' AS `BarType`
FROM
  `frtxigoo_dev2`.`VenueBarredVenue`
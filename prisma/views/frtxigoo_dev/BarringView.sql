SELECT
  `frtxigoo_dev`.`VenueBarredVenue`.`VBVId` AS `VenueId`,
  `frtxigoo_dev`.`VenueBarredVenue`.`VBVBarredVenueId` AS `BarredVenueId`,
  'Barring' AS `BarType`
FROM
  `frtxigoo_dev`.`VenueBarredVenue`
UNION
SELECT
  `frtxigoo_dev`.`VenueBarredVenue`.`VBVBarredVenueId` AS `VenueId`,
  `frtxigoo_dev`.`VenueBarredVenue`.`VBVId` AS `BarredVenueId`,
  'Barred' AS `BarType`
FROM
  `frtxigoo_dev`.`VenueBarredVenue`
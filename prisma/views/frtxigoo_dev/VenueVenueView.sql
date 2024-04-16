SELECT
  `frtxigoo_dev`.`VenueVenue`.`VVVenue1Id` AS `FromVenueId`,
  `frtxigoo_dev`.`VenueVenue`.`VVVenue2Id` AS `ToVenueId`,
  `frtxigoo_dev`.`VenueVenue`.`VVMileage` AS `Mileage`,
  `frtxigoo_dev`.`VenueVenue`.`VVTimeMins` AS `TimeMins`
FROM
  `frtxigoo_dev`.`VenueVenue`
UNION
SELECT
  `frtxigoo_dev`.`VenueVenue`.`VVVenue2Id` AS `FromVenueId`,
  `frtxigoo_dev`.`VenueVenue`.`VVVenue1Id` AS `ToVenueId`,
  `frtxigoo_dev`.`VenueVenue`.`VVMileage` AS `Mileage`,
  `frtxigoo_dev`.`VenueVenue`.`VVTimeMins` AS `TimeMins`
FROM
  `frtxigoo_dev`.`VenueVenue`
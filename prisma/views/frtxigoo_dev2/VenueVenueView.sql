SELECT
  `frtxigoo_dev2`.`VenueVenue`.`VVVenue1Id` AS `FromVenueId`,
  `frtxigoo_dev2`.`VenueVenue`.`VVVenue2Id` AS `ToVenueId`,
  `frtxigoo_dev2`.`VenueVenue`.`VVMileage` AS `Mileage`,
  `frtxigoo_dev2`.`VenueVenue`.`VVTimeMins` AS `TimeMins`
FROM
  `frtxigoo_dev2`.`VenueVenue`
UNION
SELECT
  `frtxigoo_dev2`.`VenueVenue`.`VVVenue2Id` AS `FromVenueId`,
  `frtxigoo_dev2`.`VenueVenue`.`VVVenue1Id` AS `ToVenueId`,
  `frtxigoo_dev2`.`VenueVenue`.`VVMileage` AS `Mileage`,
  `frtxigoo_dev2`.`VenueVenue`.`VVTimeMins` AS `TimeMins`
FROM
  `frtxigoo_dev2`.`VenueVenue`
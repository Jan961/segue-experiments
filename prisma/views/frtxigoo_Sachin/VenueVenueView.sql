SELECT
  `frtxigoo_Sachin`.`VenueVenue`.`VVVenue1Id` AS `FromVenueId`,
  `frtxigoo_Sachin`.`VenueVenue`.`VVVenue2Id` AS `ToVenueId`,
  `frtxigoo_Sachin`.`VenueVenue`.`VVMileage` AS `Mileage`,
  `frtxigoo_Sachin`.`VenueVenue`.`VVTimeMins` AS `TimeMins`
FROM
  `frtxigoo_Sachin`.`VenueVenue`
UNION
SELECT
  `frtxigoo_Sachin`.`VenueVenue`.`VVVenue2Id` AS `FromVenueId`,
  `frtxigoo_Sachin`.`VenueVenue`.`VVVenue1Id` AS `ToVenueId`,
  `frtxigoo_Sachin`.`VenueVenue`.`VVMileage` AS `Mileage`,
  `frtxigoo_Sachin`.`VenueVenue`.`VVTimeMins` AS `TimeMins`
FROM
  `frtxigoo_Sachin`.`VenueVenue`
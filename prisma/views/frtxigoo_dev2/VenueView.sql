SELECT
  `frtxigoo_dev2`.`Venue`.`VenueId` AS `VenueId`,
  `frtxigoo_dev2`.`Venue`.`VenueCode` AS `VenueCode`,
  `frtxigoo_dev2`.`Venue`.`VenueName` AS `VenueName`,
  `frtxigoo_dev2`.`Venue`.`VenueStatusCode` AS `VenueStatusCode`,
  `frtxigoo_dev2`.`Venue`.`VenueWebsite` AS `VenueWebsite`,
  `frtxigoo_dev2`.`Venue`.`VenueFamily` AS `VenueFamily`,
  `frtxigoo_dev2`.`Venue`.`VenueCurrencyCode` AS `VenueCurrencyCode`,
  `frtxigoo_dev2`.`Venue`.`VenueVATIndicator` AS `VenueVATIndicator`,
  `frtxigoo_dev2`.`Venue`.`VenueTechSpecsURL` AS `VenueTechSpecsURL`,
  `frtxigoo_dev2`.`Venue`.`VenueSeats` AS `VenueSeats`,
  `frtxigoo_dev2`.`Venue`.`VenueBarringClause` AS `VenueBarringClause`,
  `frtxigoo_dev2`.`Venue`.`VenueTownPopulation` AS `VenueTownPopulation`,
  `frtxigoo_dev2`.`Venue`.`VenueLXDesk` AS `VenueLXDesk`,
  `frtxigoo_dev2`.`Venue`.`VenueLXNotes` AS `VenueLXNotes`,
  `frtxigoo_dev2`.`Venue`.`VenueSoundDesk` AS `VenueSoundDesk`,
  `frtxigoo_dev2`.`Venue`.`VenueSoundNotes` AS `VenueSoundNotes`,
  `frtxigoo_dev2`.`Venue`.`VenueStageSize` AS `VenueStageSize`,
  `frtxigoo_dev2`.`Venue`.`VenueGridHeight` AS `VenueGridHeight`,
  `frtxigoo_dev2`.`Venue`.`VenueVenueFlags` AS `VenueVenueFlags`,
  `frtxigoo_dev2`.`Venue`.`VenueBarringWeeksPre` AS `VenueBarringWeeksPre`,
  `frtxigoo_dev2`.`Venue`.`VenueBarringWeeksPost` AS `VenueBarringWeeksPost`,
  `frtxigoo_dev2`.`Venue`.`VenueBarringMiles` AS `VenueBarringMiles`,
  `frtxigoo_dev2`.`Venue`.`VenueCulturallyExempt` AS `VenueCulturallyExempt`,
  `frtxigoo_dev2`.`Venue`.`VenueAccountId` AS `VenueAccountId`,
  `frtxigoo_dev2`.`Venue`.`VenueIsDeleted` AS `VenueIsDeleted`,
  `MainAddress`.`VenueAddress1` AS `VenueMainAddress1`,
  `MainAddress`.`VenueAddress2` AS `VenueMainAddress2`,
  `MainAddress`.`VenueAddress3` AS `VenueMainAddress3`,
  `MainAddress`.`VenueAddressTown` AS `VenueMainAddressTown`,
  `MainAddress`.`VenueAddressCounty` AS `VenueMainAddressCounty`,
  `MainAddress`.`VenueAddressPostcode` AS `VenueMainAddressPostcode`,
  `MainAddress`.`VenueAddressCountry` AS `VenueMainAddressCountry`,
  `DeliveryAddress`.`VenueAddress1` AS `VenueDeliveryAddress1`,
  `DeliveryAddress`.`VenueAddress2` AS `VenueDeliveryAddress2`,
  `DeliveryAddress`.`VenueAddress3` AS `VenueDeliveryAddress3`,
  `DeliveryAddress`.`VenueAddressTown` AS `VenueDeliveryAddressTown`,
  `DeliveryAddress`.`VenueAddressCounty` AS `VenueDeliveryAddressCounty`,
  `DeliveryAddress`.`VenueAddressPostcode` AS `VenueDeliveryAddressPostcode`,
  `DeliveryAddress`.`VenueAddressCountry` AS `VenueDeliveryAddressCountry`,
  `frtxigoo_dev2`.`Venue`.`VenueNotes` AS `VenueMainNoteText`,
  `frtxigoo_dev2`.`Venue`.`VenueWarningNotes` AS `VenueWarningNoteText`
FROM
  (
    (
      `frtxigoo_dev2`.`Venue`
      LEFT JOIN `frtxigoo_dev2`.`VenueAddress` `MainAddress` ON(
        `frtxigoo_dev2`.`Venue`.`VenueId` = `MainAddress`.`VenueAddressVenueId`
        AND `MainAddress`.`VenueAddressTypeName` = 'Main'
      )
    )
    LEFT JOIN `frtxigoo_dev2`.`VenueAddress` `DeliveryAddress` ON(
      `frtxigoo_dev2`.`Venue`.`VenueId` = `DeliveryAddress`.`VenueAddressVenueId`
      AND `DeliveryAddress`.`VenueAddressTypeName` = 'Delivery'
    )
  )
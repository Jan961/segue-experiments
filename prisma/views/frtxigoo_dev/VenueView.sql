SELECT
  `frtxigoo_dev`.`Venue`.`VenueId` AS `VenueId`,
  `frtxigoo_dev`.`Venue`.`VenueCode` AS `VenueCode`,
  `frtxigoo_dev`.`Venue`.`VenueName` AS `VenueName`,
  `frtxigoo_dev`.`Venue`.`VenueStatusCode` AS `VenueStatusCode`,
  `frtxigoo_dev`.`Venue`.`VenueWebsite` AS `VenueWebsite`,
  `frtxigoo_dev`.`VenueFamily`.`VenueFamilyName` AS `VenueFamily`,
  `frtxigoo_dev`.`Venue`.`VenueCurrencyCode` AS `VenueCurrencyCode`,
  `frtxigoo_dev`.`Venue`.`VenueVATIndicator` AS `VenueVATIndicator`,
  `frtxigoo_dev`.`Venue`.`VenueTechSpecsURL` AS `VenueTechSpecsURL`,
  `frtxigoo_dev`.`Venue`.`VenueSeats` AS `VenueSeats`,
  `frtxigoo_dev`.`Venue`.`VenueBarringClause` AS `VenueBarringClause`,
  `frtxigoo_dev`.`Venue`.`VenueTownPopulation` AS `VenueTownPopulation`,
  `frtxigoo_dev`.`Venue`.`VenueLXDesk` AS `VenueLXDesk`,
  `frtxigoo_dev`.`Venue`.`VenueLXNotes` AS `VenueLXNotes`,
  `frtxigoo_dev`.`Venue`.`VenueSoundDesk` AS `VenueSoundDesk`,
  `frtxigoo_dev`.`Venue`.`VenueSoundNotes` AS `VenueSoundNotes`,
  `frtxigoo_dev`.`Venue`.`VenueStageSize` AS `VenueStageSize`,
  `frtxigoo_dev`.`Venue`.`VenueGridHeight` AS `VenueGridHeight`,
  `frtxigoo_dev`.`Venue`.`VenueVenueFlags` AS `VenueVenueFlags`,
  `frtxigoo_dev`.`Venue`.`VenueBarringWeeksPre` AS `VenueBarringWeeksPre`,
  `frtxigoo_dev`.`Venue`.`VenueBarringWeeksPost` AS `VenueBarringWeeksPost`,
  `frtxigoo_dev`.`Venue`.`VenueBarringMiles` AS `VenueBarringMiles`,
  `frtxigoo_dev`.`Venue`.`VenueCulturallyExempt` AS `VenueCulturallyExempt`,
  `frtxigoo_dev`.`Venue`.`VenueAccountId` AS `VenueAccountId`,
  `frtxigoo_dev`.`Venue`.`VenueIsDeleted` AS `VenueIsDeleted`,
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
  `frtxigoo_dev`.`Venue`.`VenueNotes` AS `VenueMainNoteText`,
  `frtxigoo_dev`.`Venue`.`VenueWarningNotes` AS `VenueWarningNoteText`
FROM
  (
    (
      (
        `frtxigoo_dev`.`Venue`
        LEFT JOIN `frtxigoo_dev`.`VenueAddress` `MainAddress` ON(
          `frtxigoo_dev`.`Venue`.`VenueId` = `MainAddress`.`VenueAddressVenueId`
          AND `MainAddress`.`VenueAddressTypeName` = 'Main'
        )
      )
      LEFT JOIN `frtxigoo_dev`.`VenueAddress` `DeliveryAddress` ON(
        `frtxigoo_dev`.`Venue`.`VenueId` = `DeliveryAddress`.`VenueAddressVenueId`
        AND `DeliveryAddress`.`VenueAddressTypeName` = 'Delivery'
      )
    )
    LEFT JOIN `frtxigoo_dev`.`VenueFamily` ON(
      `frtxigoo_dev`.`Venue`.`VenueVenueFamilyId` = `frtxigoo_dev`.`VenueFamily`.`VenueFamilyId`
    )
  )
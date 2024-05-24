SELECT
  `frtxigoo_Sachin`.`Venue`.`VenueId` AS `VenueId`,
  `frtxigoo_Sachin`.`Venue`.`VenueCode` AS `VenueCode`,
  `frtxigoo_Sachin`.`Venue`.`VenueName` AS `VenueName`,
  `frtxigoo_Sachin`.`Venue`.`VenueStatusCode` AS `VenueStatusCode`,
  `frtxigoo_Sachin`.`Venue`.`VenueWebsite` AS `VenueWebsite`,
  `frtxigoo_Sachin`.`VenueFamily`.`VenueFamilyName` AS `VenueFamily`,
  `frtxigoo_Sachin`.`Venue`.`VenueCurrencyCode` AS `VenueCurrencyCode`,
  `frtxigoo_Sachin`.`Venue`.`VenueVATIndicator` AS `VenueVATIndicator`,
  `frtxigoo_Sachin`.`Venue`.`VenueTechSpecsURL` AS `VenueTechSpecsURL`,
  `frtxigoo_Sachin`.`Venue`.`VenueSeats` AS `VenueSeats`,
  `frtxigoo_Sachin`.`Venue`.`VenueBarringClause` AS `VenueBarringClause`,
  `frtxigoo_Sachin`.`Venue`.`VenueTownPopulation` AS `VenueTownPopulation`,
  `frtxigoo_Sachin`.`Venue`.`VenueLXDesk` AS `VenueLXDesk`,
  `frtxigoo_Sachin`.`Venue`.`VenueLXNotes` AS `VenueLXNotes`,
  `frtxigoo_Sachin`.`Venue`.`VenueSoundDesk` AS `VenueSoundDesk`,
  `frtxigoo_Sachin`.`Venue`.`VenueSoundNotes` AS `VenueSoundNotes`,
  `frtxigoo_Sachin`.`Venue`.`VenueStageSize` AS `VenueStageSize`,
  `frtxigoo_Sachin`.`Venue`.`VenueGridHeight` AS `VenueGridHeight`,
  `frtxigoo_Sachin`.`Venue`.`VenueVenueFlags` AS `VenueVenueFlags`,
  `frtxigoo_Sachin`.`Venue`.`VenueBarringWeeksPre` AS `VenueBarringWeeksPre`,
  `frtxigoo_Sachin`.`Venue`.`VenueBarringWeeksPost` AS `VenueBarringWeeksPost`,
  `frtxigoo_Sachin`.`Venue`.`VenueBarringMiles` AS `VenueBarringMiles`,
  `frtxigoo_Sachin`.`Venue`.`VenueCulturallyExempt` AS `VenueCulturallyExempt`,
  `frtxigoo_Sachin`.`Venue`.`VenueAccountId` AS `VenueAccountId`,
  `frtxigoo_Sachin`.`Venue`.`VenueIsDeleted` AS `VenueIsDeleted`,
  `MainAddress`.`VenueAddress1` AS `VenueMainAddress1`,
  `MainAddress`.`VenueAddress2` AS `VenueMainAddress2`,
  `MainAddress`.`VenueAddress3` AS `VenueMainAddress3`,
  `MainAddress`.`VenueAddressTown` AS `VenueMainAddressTown`,
  `MainAddress`.`VenueAddressCounty` AS `VenueMainAddressCounty`,
  `MainAddress`.`VenueAddressPostcode` AS `VenueMainAddressPostcode`,
  `MainCountry`.`CountryName` AS `VenueMainAddressCountry`,
  `DeliveryAddress`.`VenueAddress1` AS `VenueDeliveryAddress1`,
  `DeliveryAddress`.`VenueAddress2` AS `VenueDeliveryAddress2`,
  `DeliveryAddress`.`VenueAddress3` AS `VenueDeliveryAddress3`,
  `DeliveryAddress`.`VenueAddressTown` AS `VenueDeliveryAddressTown`,
  `DeliveryAddress`.`VenueAddressCounty` AS `VenueDeliveryAddressCounty`,
  `DeliveryAddress`.`VenueAddressPostcode` AS `VenueDeliveryAddressPostcode`,
  `DeliveryCountry`.`CountryName` AS `VenueDeliveryAddressCountry`,
  `frtxigoo_Sachin`.`Venue`.`VenueNotes` AS `VenueMainNoteText`,
  `frtxigoo_Sachin`.`Venue`.`VenueWarningNotes` AS `VenueWarningNoteText`
FROM
  (
    (
      (
        (
          (
            `frtxigoo_Sachin`.`Venue`
            LEFT JOIN `frtxigoo_Sachin`.`VenueAddress` `MainAddress` ON(
              `frtxigoo_Sachin`.`Venue`.`VenueId` = `MainAddress`.`VenueAddressVenueId`
              AND `MainAddress`.`VenueAddressTypeName` = 'Main'
            )
          )
          LEFT JOIN `frtxigoo_Sachin`.`VenueAddress` `DeliveryAddress` ON(
            `frtxigoo_Sachin`.`Venue`.`VenueId` = `DeliveryAddress`.`VenueAddressVenueId`
            AND `DeliveryAddress`.`VenueAddressTypeName` = 'Delivery'
          )
        )
        LEFT JOIN `frtxigoo_Sachin`.`VenueFamily` ON(
          `frtxigoo_Sachin`.`Venue`.`VenueVenueFamilyId` = `frtxigoo_Sachin`.`VenueFamily`.`VenueFamilyId`
        )
      )
      LEFT JOIN `frtxigoo_Sachin`.`Country` `MainCountry` ON(
        `MainAddress`.`VenueAddressCountryId` = `MainCountry`.`CountryId`
      )
    )
    LEFT JOIN `frtxigoo_Sachin`.`Country` `DeliveryCountry` ON(
      `DeliveryAddress`.`VenueAddressCountryId` = `DeliveryCountry`.`CountryId`
    )
  )
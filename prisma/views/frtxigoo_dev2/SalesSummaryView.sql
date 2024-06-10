SELECT
  `ScheduleView`.`ProductionId` AS `ProductionId`,
  `ScheduleView`.`FullProductionCode` AS `FullProductionCode`,
  `ScheduleView`.`ShowName` AS `ShowName`,
  `ScheduleView`.`ProductionStartDate` AS `ProductionStartDate`,
  `ScheduleView`.`ProductionEndDate` AS `ProductionEndDate`,
  `ScheduleView`.`ProductionWeekNum` AS `ProductionWeekNum`,
  `ScheduleView`.`EntryDate` AS `EntryDate`,
  `ScheduleView`.`Location` AS `Location`,
  `ScheduleView`.`EntryId` AS `EntryId`,
  `ScheduleView`.`EntryName` AS `EntryName`,
  `ScheduleView`.`EntryType` AS `EntryType`,
  `ScheduleView`.`EntryStatusCode` AS `EntryStatusCode`,
  `SalesSetTotalsView`.`Value` AS `Value`,
  `frtxigoo_dev2`.`Currency`.`CurrencyCode` AS `VenueCurrencyCode`,
  `frtxigoo_dev2`.`ConversionRate`.`ConversionRate` AS `ConversionRate`,
  `frtxigoo_dev2`.`ConversionRate`.`ConversionToCurrencyCode` AS `ConversionToCurrencyCode`,
  `SalesSetTotalsView`.`SaleTypeName` AS `SaleTypeName`,
  `SalesSetTotalsView`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  IF(
    `ScheduleView`.`EntryType` = 'Booking',
(
      SELECT
        max(`frtxigoo_dev2`.`SalesSet`.`SetSalesFiguresDate`)
      FROM
        `frtxigoo_dev2`.`SalesSet`
      WHERE
        `frtxigoo_dev2`.`SalesSet`.`SetBookingId` = `ScheduleView`.`EntryId`
        AND `frtxigoo_dev2`.`SalesSet`.`SetIsFinalFigures` = 1
    ),
    NULL
  ) AS `FinalSetSalesFiguresDate`
FROM
  (
    (
      (
        (
          (
            (
              `frtxigoo_dev2`.`ScheduleView`
              LEFT JOIN `frtxigoo_dev2`.`SalesSetTotalsView` ON(
                `ScheduleView`.`EntryId` = `SalesSetTotalsView`.`SetBookingId`
                AND `SalesSetTotalsView`.`SetSalesFiguresDate` = (
                  SELECT
                    max(`LatestTotals`.`SetSalesFiguresDate`)
                  FROM
                    `frtxigoo_dev2`.`SalesSetTotalsView` `LatestTotals`
                  WHERE
                    `LatestTotals`.`SetBookingId` = `ScheduleView`.`EntryId`
                )
              )
            )
            LEFT JOIN `frtxigoo_dev2`.`Venue` ON(
              `ScheduleView`.`VenueId` = `frtxigoo_dev2`.`Venue`.`VenueId`
            )
          )
          LEFT JOIN `frtxigoo_dev2`.`VenueAddress` `MainAddress` ON(
            `frtxigoo_dev2`.`Venue`.`VenueId` = `MainAddress`.`VenueAddressVenueId`
            AND `MainAddress`.`VenueAddressTypeName` = 'Main'
          )
        )
        LEFT JOIN `frtxigoo_dev2`.`Country` `MainCountry` ON(
          `MainAddress`.`VenueAddressCountryId` = `MainCountry`.`CountryId`
        )
      )
      LEFT JOIN `frtxigoo_dev2`.`Currency` ON(
        `MainCountry`.`CountryCurrencyCode` = `frtxigoo_dev2`.`Currency`.`CurrencyCode`
      )
    )
    LEFT JOIN `frtxigoo_dev2`.`ConversionRate` ON(
      `ScheduleView`.`ProductionId` = `frtxigoo_dev2`.`ConversionRate`.`ConversionProductionId`
      AND `frtxigoo_dev2`.`Currency`.`CurrencyCode` = `frtxigoo_dev2`.`ConversionRate`.`ConversionFromCurrencyCode`
    )
  )
WHERE
  `ScheduleView`.`EntryDate` >= `ScheduleView`.`ProductionStartDate`
  AND `ScheduleView`.`EntryType` = 'Booking'
ORDER BY
  `ScheduleView`.`EntryDate`
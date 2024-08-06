SELECT
  `frtxigoo_dev2`.`ScheduleView`.`ProductionId` AS `ProductionId`,
  `frtxigoo_dev2`.`ScheduleView`.`FullProductionCode` AS `FullProductionCode`,
  `frtxigoo_dev2`.`ScheduleView`.`ShowName` AS `ShowName`,
  `frtxigoo_dev2`.`ScheduleView`.`ProductionStartDate` AS `ProductionStartDate`,
  `frtxigoo_dev2`.`ScheduleView`.`ProductionEndDate` AS `ProductionEndDate`,
  `frtxigoo_dev2`.`ScheduleView`.`ProductionWeekNum` AS `ProductionWeekNum`,
  `frtxigoo_dev2`.`ScheduleView`.`EntryDate` AS `EntryDate`,
  `frtxigoo_dev2`.`ScheduleView`.`Location` AS `Location`,
  `frtxigoo_dev2`.`ScheduleView`.`EntryId` AS `EntryId`,
  `frtxigoo_dev2`.`ScheduleView`.`EntryName` AS `EntryName`,
  `frtxigoo_dev2`.`ScheduleView`.`EntryType` AS `EntryType`,
  `frtxigoo_dev2`.`ScheduleView`.`EntryStatusCode` AS `EntryStatusCode`,
  `SalesSetTotalsView`.`Value` AS `Value`,
  `frtxigoo_dev2`.`Currency`.`CurrencyCode` AS `VenueCurrencyCode`,
  `frtxigoo_dev2`.`Currency`.`CurrencySymbolUnicode` AS `VenueCurrencySymbolUnicode`,
  `frtxigoo_dev2`.`ConversionRate`.`ConversionRate` AS `ConversionRate`,
  `frtxigoo_dev2`.`ConversionRate`.`ConversionToCurrencyCode` AS `ConversionToCurrencyCode`,
  `SalesSetTotalsView`.`SaleTypeName` AS `SaleTypeName`,
  `SalesSetTotalsView`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  IF(
    `frtxigoo_dev2`.`ScheduleView`.`EntryType` = 'Booking',
(
      SELECT
        max(`frtxigoo_dev2`.`SalesSet`.`SetSalesFiguresDate`)
      FROM
        `frtxigoo_dev2`.`SalesSet`
      WHERE
        `frtxigoo_dev2`.`SalesSet`.`SetBookingId` = `frtxigoo_dev2`.`ScheduleView`.`EntryId`
        AND `frtxigoo_dev2`.`SalesSet`.`SetIsFinalFigures` = 1
    ),
    NULL
  ) AS `FinalSetSalesFiguresDate`,
  `NotOnSaleSet`.`SetSalesFiguresDate` AS `NotOnSaleDate`
FROM
  (
    (
      (
        (
          (
            (
              (
                `frtxigoo_dev2`.`ScheduleView`
                LEFT JOIN `frtxigoo_dev2`.`SalesSetTotalsView` ON(
                  `frtxigoo_dev2`.`ScheduleView`.`EntryId` = `SalesSetTotalsView`.`SetBookingId`
                  AND `SalesSetTotalsView`.`SetSalesFiguresDate` = (
                    SELECT
                      max(`LatestTotals`.`SetSalesFiguresDate`)
                    FROM
                      `frtxigoo_dev2`.`SalesSetTotalsView` `LatestTotals`
                    WHERE
                      `LatestTotals`.`SetBookingId` = `frtxigoo_dev2`.`ScheduleView`.`EntryId`
                  )
                )
              )
              LEFT JOIN `frtxigoo_dev2`.`Venue` ON(
                `frtxigoo_dev2`.`ScheduleView`.`VenueId` = `frtxigoo_dev2`.`Venue`.`VenueId`
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
        `frtxigoo_dev2`.`ScheduleView`.`ProductionId` = `frtxigoo_dev2`.`ConversionRate`.`ConversionProductionId`
        AND `frtxigoo_dev2`.`Currency`.`CurrencyCode` = `frtxigoo_dev2`.`ConversionRate`.`ConversionFromCurrencyCode`
      )
    )
    LEFT JOIN `frtxigoo_dev2`.`SalesSet` `NotOnSaleSet` ON(
      `frtxigoo_dev2`.`ScheduleView`.`EntryId` = `NotOnSaleSet`.`SetBookingId`
      AND `NotOnSaleSet`.`SetNotOnSale` = 1
    )
  )
WHERE
  `frtxigoo_dev2`.`ScheduleView`.`EntryDate` >= `frtxigoo_dev2`.`ScheduleView`.`ProductionStartDate`
  AND `frtxigoo_dev2`.`ScheduleView`.`EntryType` = 'Booking'
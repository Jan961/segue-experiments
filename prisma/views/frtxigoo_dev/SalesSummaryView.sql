SELECT
  `frtxigoo_dev`.`ScheduleView`.`ProductionId` AS `ProductionId`,
  `frtxigoo_dev`.`ScheduleView`.`FullProductionCode` AS `FullProductionCode`,
  `frtxigoo_dev`.`ScheduleView`.`ShowName` AS `ShowName`,
  `frtxigoo_dev`.`ScheduleView`.`ProductionStartDate` AS `ProductionStartDate`,
  `frtxigoo_dev`.`ScheduleView`.`ProductionEndDate` AS `ProductionEndDate`,
  `frtxigoo_dev`.`ScheduleView`.`ProductionWeekNum` AS `ProductionWeekNum`,
  `frtxigoo_dev`.`ScheduleView`.`EntryDate` AS `EntryDate`,
  `frtxigoo_dev`.`ScheduleView`.`Location` AS `Location`,
  `frtxigoo_dev`.`ScheduleView`.`EntryId` AS `EntryId`,
  `frtxigoo_dev`.`ScheduleView`.`EntryName` AS `EntryName`,
  `frtxigoo_dev`.`ScheduleView`.`EntryType` AS `EntryType`,
  `frtxigoo_dev`.`ScheduleView`.`EntryStatusCode` AS `EntryStatusCode`,
  `SalesSetTotalsView`.`Value` AS `Value`,
  `frtxigoo_dev`.`Currency`.`CurrencyCode` AS `VenueCurrencyCode`,
  `frtxigoo_dev`.`Currency`.`CurrencySymbolUnicode` AS `VenueCurrencySymbolUnicode`,
  `frtxigoo_dev`.`ConversionRate`.`ConversionRate` AS `ConversionRate`,
  `frtxigoo_dev`.`ConversionRate`.`ConversionToCurrencyCode` AS `ConversionToCurrencyCode`,
  `SalesSetTotalsView`.`SaleTypeName` AS `SaleTypeName`,
  `SalesSetTotalsView`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  IF(
    `frtxigoo_dev`.`ScheduleView`.`EntryType` = 'Booking',
(
      SELECT
        max(`frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate`)
      FROM
        `frtxigoo_dev`.`SalesSet`
      WHERE
        `frtxigoo_dev`.`SalesSet`.`SetBookingId` = `frtxigoo_dev`.`ScheduleView`.`EntryId`
        AND `frtxigoo_dev`.`SalesSet`.`SetIsFinalFigures` = 1
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
                `frtxigoo_dev`.`ScheduleView`
                LEFT JOIN `frtxigoo_dev`.`SalesSetTotalsView` ON(
                  `frtxigoo_dev`.`ScheduleView`.`EntryId` = `SalesSetTotalsView`.`SetBookingId`
                  AND `SalesSetTotalsView`.`SetSalesFiguresDate` = (
                    SELECT
                      max(`LatestTotals`.`SetSalesFiguresDate`)
                    FROM
                      `frtxigoo_dev`.`SalesSetTotalsView` `LatestTotals`
                    WHERE
                      `LatestTotals`.`SetBookingId` = `frtxigoo_dev`.`ScheduleView`.`EntryId`
                  )
                )
              )
              LEFT JOIN `frtxigoo_dev`.`Venue` ON(
                `frtxigoo_dev`.`ScheduleView`.`VenueId` = `frtxigoo_dev`.`Venue`.`VenueId`
              )
            )
            LEFT JOIN `frtxigoo_dev`.`VenueAddress` `MainAddress` ON(
              `frtxigoo_dev`.`Venue`.`VenueId` = `MainAddress`.`VenueAddressVenueId`
              AND `MainAddress`.`VenueAddressTypeName` = 'Main'
            )
          )
          LEFT JOIN `frtxigoo_dev`.`Country` `MainCountry` ON(
            `MainAddress`.`VenueAddressCountryId` = `MainCountry`.`CountryId`
          )
        )
        LEFT JOIN `frtxigoo_dev`.`Currency` ON(
          `MainCountry`.`CountryCurrencyCode` = `frtxigoo_dev`.`Currency`.`CurrencyCode`
        )
      )
      LEFT JOIN `frtxigoo_dev`.`ConversionRate` ON(
        `frtxigoo_dev`.`ScheduleView`.`ProductionId` = `frtxigoo_dev`.`ConversionRate`.`ConversionProductionId`
        AND `frtxigoo_dev`.`Currency`.`CurrencyCode` = `frtxigoo_dev`.`ConversionRate`.`ConversionFromCurrencyCode`
      )
    )
    LEFT JOIN `frtxigoo_dev`.`SalesSet` `NotOnSaleSet` ON(
      `frtxigoo_dev`.`ScheduleView`.`EntryId` = `NotOnSaleSet`.`SetBookingId`
      AND `NotOnSaleSet`.`SetNotOnSale` = 1
    )
  )
WHERE
  `frtxigoo_dev`.`ScheduleView`.`EntryDate` >= `frtxigoo_dev`.`ScheduleView`.`ProductionStartDate`
  AND `frtxigoo_dev`.`ScheduleView`.`EntryType` = 'Booking'
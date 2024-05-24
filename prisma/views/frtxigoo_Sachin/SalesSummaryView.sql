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
  `frtxigoo_Sachin`.`Currency`.`CurrencyCode` AS `VenueCurrencyCode`,
  `frtxigoo_Sachin`.`ConversionRate`.`ConversionRate` AS `ConversionRate`,
  `frtxigoo_Sachin`.`ConversionRate`.`ConversionToCurrencyCode` AS `ConversionToCurrencyCode`,
  `SalesSetTotalsView`.`SaleTypeName` AS `SaleTypeName`,
  `SalesSetTotalsView`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  IF(
    `ScheduleView`.`EntryType` = 'Booking',
(
      SELECT
        `frtxigoo_Sachin`.`SalesSet`.`SetSalesFiguresDate`
      FROM
        `frtxigoo_Sachin`.`SalesSet`
      WHERE
        `frtxigoo_Sachin`.`SalesSet`.`SetBookingId` = `ScheduleView`.`EntryId`
        AND `frtxigoo_Sachin`.`SalesSet`.`SetIsFinalFigures` = 1
    ),
    NULL
  ) AS `FinalSetSalesFiguresDate`
FROM
  (
    (
      (
        (
          `frtxigoo_Sachin`.`ScheduleView`
          LEFT JOIN `frtxigoo_Sachin`.`SalesSetTotalsView` ON(
            `ScheduleView`.`EntryType` = 'Booking'
            AND `ScheduleView`.`EntryId` = `SalesSetTotalsView`.`SetBookingId`
            AND `SalesSetTotalsView`.`SetSalesFiguresDate` = (
              SELECT
                max(`LatestTotals`.`SetSalesFiguresDate`)
              FROM
                `frtxigoo_Sachin`.`SalesSetTotalsView` `LatestTotals`
              WHERE
                `LatestTotals`.`SetBookingId` = `ScheduleView`.`EntryId`
            )
          )
        )
        LEFT JOIN `frtxigoo_Sachin`.`Venue` ON(
          `ScheduleView`.`VenueId` = `frtxigoo_Sachin`.`Venue`.`VenueId`
        )
      )
      LEFT JOIN `frtxigoo_Sachin`.`Currency` ON(
        `frtxigoo_Sachin`.`Venue`.`VenueCurrencyCode` = `frtxigoo_Sachin`.`Currency`.`CurrencyCode`
      )
    )
    LEFT JOIN `frtxigoo_Sachin`.`ConversionRate` ON(
      `ScheduleView`.`ProductionId` = `frtxigoo_Sachin`.`ConversionRate`.`ConversionProductionId`
      AND `frtxigoo_Sachin`.`Currency`.`CurrencyCode` = `frtxigoo_Sachin`.`ConversionRate`.`ConversionFromCurrencyCode`
    )
  )
WHERE
  `ScheduleView`.`EntryDate` >= `ScheduleView`.`ProductionStartDate`
ORDER BY
  `ScheduleView`.`EntryDate`
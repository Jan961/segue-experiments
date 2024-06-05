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
  `frtxigoo_dev`.`Currency`.`CurrencyCode` AS `VenueCurrencyCode`,
  `frtxigoo_dev`.`ConversionRate`.`ConversionRate` AS `ConversionRate`,
  `frtxigoo_dev`.`ConversionRate`.`ConversionToCurrencyCode` AS `ConversionToCurrencyCode`,
  `SalesSetTotalsView`.`SaleTypeName` AS `SaleTypeName`,
  `SalesSetTotalsView`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  IF(
    `ScheduleView`.`EntryType` = 'Booking',
(
      SELECT
        `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate`
      FROM
        `frtxigoo_dev`.`SalesSet`
      WHERE
        `frtxigoo_dev`.`SalesSet`.`SetBookingId` = `ScheduleView`.`EntryId`
        AND `frtxigoo_dev`.`SalesSet`.`SetIsFinalFigures` = 1
    ),
    NULL
  ) AS `FinalSetSalesFiguresDate`
FROM
  (
    (
      (
        (
          `frtxigoo_dev`.`ScheduleView`
          LEFT JOIN `frtxigoo_dev`.`SalesSetTotalsView` ON(
            `ScheduleView`.`EntryType` = 'Booking'
            AND `ScheduleView`.`EntryId` = `SalesSetTotalsView`.`SetBookingId`
            AND `SalesSetTotalsView`.`SetSalesFiguresDate` = (
              SELECT
                max(`LatestTotals`.`SetSalesFiguresDate`)
              FROM
                `frtxigoo_dev`.`SalesSetTotalsView` `LatestTotals`
              WHERE
                `LatestTotals`.`SetBookingId` = `ScheduleView`.`EntryId`
            )
          )
        )
        LEFT JOIN `frtxigoo_dev`.`Venue` ON(
          `ScheduleView`.`VenueId` = `frtxigoo_dev`.`Venue`.`VenueId`
        )
      )
      LEFT JOIN `frtxigoo_dev`.`Currency` ON(
        `frtxigoo_dev`.`Venue`.`VenueCurrencyCode` = `frtxigoo_dev`.`Currency`.`CurrencyCode`
      )
    )
    LEFT JOIN `frtxigoo_dev`.`ConversionRate` ON(
      `ScheduleView`.`ProductionId` = `frtxigoo_dev`.`ConversionRate`.`ConversionProductionId`
      AND `frtxigoo_dev`.`Currency`.`CurrencyCode` = `frtxigoo_dev`.`ConversionRate`.`ConversionFromCurrencyCode`
    )
  )
WHERE
  `ScheduleView`.`EntryDate` >= `ScheduleView`.`ProductionStartDate`
ORDER BY
  `ScheduleView`.`EntryDate`
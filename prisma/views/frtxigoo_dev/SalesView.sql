SELECT
  `ProductionView`.`ShowName` AS `ShowName`,
  `ProductionView`.`ProductionId` AS `ProductionId`,
  `ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `ProductionView`.`ProductionStartDate` AS `ProductionStartDate`,
  `ProductionView`.`ProductionEndDate` AS `ProductionEndDate`,
  `frtxigoo_dev`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_dev`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
  `frtxigoo_dev`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `CalculateWeekNum`(
    `frtxigoo_dev`.`Booking`.`BookingFirstDate`,
    `ProductionView`.`ProductionStartDate`
  ) AS `BookingProductionWeekNum`,
  `VenueView`.`VenueMainAddressTown` AS `VenueTown`,
  `VenueView`.`VenueCode` AS `VenueCode`,
  `VenueView`.`VenueName` AS `VenueName`,
  `VenueView`.`VenueCurrencyCode` AS `VenueCurrencyCode`,
  `frtxigoo_dev`.`Currency`.`CurrencySymbolUnicode` AS `VenueCurrencySymbolUnicode`,
  `frtxigoo_dev`.`ConversionRate`.`ConversionToCurrencyCode` AS `ConversionToCurrencyCode`,
  `frtxigoo_dev`.`ConversionRate`.`ConversionRate` AS `ConversionRate`,
  `frtxigoo_dev`.`SalesSet`.`SetId` AS `SetId`,
  `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  `CalculateWeekNum`(
    `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate`,
    `frtxigoo_dev`.`Booking`.`BookingFirstDate`
  ) AS `SetBookingWeekNum`,
  `CalculateWeekDate`(`frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate`) AS `SetProductionWeekDate`,
  `CalculateWeekNum`(
    `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate`,
    `ProductionView`.`ProductionStartDate`
  ) AS `SetProductionWeekNum`,
  `frtxigoo_dev`.`SalesSet`.`SetNotOnSale` AS `SetNotOnSale`,
  `frtxigoo_dev`.`SalesSet`.`SetIsFinalFigures` AS `SetIsFinalFigures`,
  `frtxigoo_dev`.`SalesSet`.`SetFinalSalesApprovedByUser` AS `SetFinalSalesApprovedByUser`,
  `frtxigoo_dev`.`SalesSet`.`SetSingleSeats` AS `SetSingleSeats`,
  `frtxigoo_dev`.`SalesSet`.`SetBrochureReleased` AS `SetBrochureReleased`,
  `frtxigoo_dev`.`SalesSet`.`SetIsCopy` AS `SetIsCopy`,
  `SalesSetTotalsView`.`SaleTypeName` AS `SaleTypeName`,
  `SalesSetTotalsView`.`Seats` AS `Seats`,
  `SalesSetTotalsView`.`Value` AS `Value`,
(
    SELECT
      count(0)
    FROM
      `frtxigoo_dev`.`Performance`
    WHERE
      `frtxigoo_dev`.`Performance`.`PerformanceBookingId` = `frtxigoo_dev`.`Booking`.`BookingId`
  ) * `VenueView`.`VenueSeats` AS `TotalCapacity`,
  `FinalFiguresSet`.`SetSalesFiguresDate` AS `FinalFiguresDate`,
  `FinalFiguresTotals`.`Seats` AS `FinalFiguresSeats`,
  `FinalFiguresTotals`.`Value` AS `FinalFiguresValue`,
  `NotOnSaleSet`.`SetSalesFiguresDate` AS `NotOnSaleDate`,
(
    SELECT
      sum(`frtxigoo_dev`.`SetHold`.`SetHoldSeats`)
    FROM
      `frtxigoo_dev`.`SetHold`
    WHERE
      `frtxigoo_dev`.`SetHold`.`SetHoldSetId` = `frtxigoo_dev`.`SalesSet`.`SetId`
  ) AS `TotalHoldSeats`,
  `LatestTotals`.`SetSalesFiguresDate` AS `LastFiguresDate`,
  `LatestTotals`.`Seats` AS `LastFiguresSeats`,
  `LatestTotals`.`Value` AS `LastFiguresValue`
FROM
  (
    (
      (
        (
          (
            (
              (
                (
                  (
                    (
                      (
                        `frtxigoo_dev`.`ProductionView`
                        JOIN `frtxigoo_dev`.`DateBlock` ON(
                          `ProductionView`.`ProductionId` = `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId`
                        )
                      )
                      JOIN `frtxigoo_dev`.`Booking` ON(
                        `frtxigoo_dev`.`DateBlock`.`DateBlockId` = `frtxigoo_dev`.`Booking`.`BookingDateBlockId`
                      )
                    )
                    JOIN `frtxigoo_dev`.`VenueView` ON(
                      `frtxigoo_dev`.`Booking`.`BookingVenueId` = `VenueView`.`VenueId`
                    )
                  )
                  JOIN `frtxigoo_dev`.`Currency` ON(
                    `VenueView`.`VenueCurrencyCode` = `frtxigoo_dev`.`Currency`.`CurrencyCode`
                  )
                )
                LEFT JOIN `frtxigoo_dev`.`ConversionRate` ON(
                  `VenueView`.`VenueCurrencyCode` = `frtxigoo_dev`.`ConversionRate`.`ConversionFromCurrencyCode`
                  AND `ProductionView`.`ProductionId` = `frtxigoo_dev`.`ConversionRate`.`ConversionProductionId`
                )
              )
              LEFT JOIN `frtxigoo_dev`.`SalesSet` ON(
                `frtxigoo_dev`.`Booking`.`BookingId` = `frtxigoo_dev`.`SalesSet`.`SetBookingId`
              )
            )
            LEFT JOIN `frtxigoo_dev`.`SalesSetTotalsView` ON(
              `frtxigoo_dev`.`SalesSet`.`SetBookingId` = `SalesSetTotalsView`.`SetBookingId`
              AND `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate` = `SalesSetTotalsView`.`SetSalesFiguresDate`
            )
          )
          LEFT JOIN `frtxigoo_dev`.`SalesSet` `FinalFiguresSet` ON(
            `frtxigoo_dev`.`Booking`.`BookingId` = `FinalFiguresSet`.`SetBookingId`
            AND `FinalFiguresSet`.`SetIsFinalFigures` = 1
          )
        )
        LEFT JOIN `frtxigoo_dev`.`SalesSetTotalsView` `FinalFiguresTotals` ON(
          `frtxigoo_dev`.`Booking`.`BookingId` = `FinalFiguresTotals`.`SetBookingId`
          AND `FinalFiguresSet`.`SetSalesFiguresDate` = `FinalFiguresTotals`.`SetSalesFiguresDate`
          AND `SalesSetTotalsView`.`SaleTypeName` = `FinalFiguresTotals`.`SaleTypeName`
        )
      )
      LEFT JOIN `frtxigoo_dev`.`SalesSet` `NotOnSaleSet` ON(
        `frtxigoo_dev`.`Booking`.`BookingId` = `NotOnSaleSet`.`SetBookingId`
        AND `NotOnSaleSet`.`SetNotOnSale` = 1
      )
    )
    LEFT JOIN `frtxigoo_dev`.`SalesSetTotalsView` `LatestTotals` ON(
      `frtxigoo_dev`.`Booking`.`BookingId` = `LatestTotals`.`SetBookingId`
      AND `LatestTotals`.`SetSalesFiguresDate` = (
        SELECT
          max(`LatestTotal`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_dev`.`SalesSetTotalsView` `LatestTotal`
        WHERE
          `LatestTotal`.`SetBookingId` = `frtxigoo_dev`.`Booking`.`BookingId`
          AND `LatestTotal`.`Seats` > 0
      )
      AND `LatestTotals`.`SaleTypeName` = `SalesSetTotalsView`.`SaleTypeName`
    )
  )
WHERE
  `frtxigoo_dev`.`SalesSet`.`SetId` IS NOT NULL
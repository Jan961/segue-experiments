SELECT
  `ProductionView`.`ShowName` AS `ShowName`,
  `ProductionView`.`ProductionId` AS `ProductionId`,
  `ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `ProductionView`.`ProductionStartDate` AS `ProductionStartDate`,
  `ProductionView`.`ProductionEndDate` AS `ProductionEndDate`,
  `frtxigoo_dev2`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_dev2`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
  `frtxigoo_dev2`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `CalculateWeekNum`(
    `frtxigoo_dev2`.`Booking`.`BookingFirstDate`,
    `ProductionView`.`ProductionStartDate`
  ) AS `BookingProductionWeekNum`,
  `VenueView`.`VenueMainAddressTown` AS `VenueTown`,
  `VenueView`.`VenueCode` AS `VenueCode`,
  `VenueView`.`VenueName` AS `VenueName`,
  `VenueView`.`VenueCurrencyCode` AS `VenueCurrencyCode`,
  `frtxigoo_dev2`.`ConversionRate`.`ConversionToCurrencyCode` AS `ConversionToCurrencyCode`,
  `frtxigoo_dev2`.`ConversionRate`.`ConversionRate` AS `ConversionRate`,
  `frtxigoo_dev2`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  `CalculateWeekNum`(
    `frtxigoo_dev2`.`SalesSet`.`SetSalesFiguresDate`,
    `frtxigoo_dev2`.`Booking`.`BookingFirstDate`
  ) AS `SetBookingWeekNum`,
  `CalculateWeekDate`(`frtxigoo_dev2`.`SalesSet`.`SetSalesFiguresDate`) AS `SetProductionWeekDate`,
  `CalculateWeekNum`(
    `frtxigoo_dev2`.`SalesSet`.`SetSalesFiguresDate`,
    `ProductionView`.`ProductionStartDate`
  ) AS `SetProductionWeekNum`,
  `frtxigoo_dev2`.`SalesSet`.`SetNotOnSale` AS `SetNotOnSale`,
  `frtxigoo_dev2`.`SalesSet`.`SetIsFinalFigures` AS `SetIsFinalFigures`,
  `frtxigoo_dev2`.`SalesSet`.`SetFinalSalesApprovedByUser` AS `SetFinalSalesApprovedByUser`,
  `frtxigoo_dev2`.`SalesSet`.`SetSingleSeats` AS `SetSingleSeats`,
  `frtxigoo_dev2`.`SalesSet`.`SetBrochureReleased` AS `SetBrochureReleased`,
  `frtxigoo_dev2`.`SalesSet`.`SetIsCopy` AS `SetIsCopy`,
  `SalesSetTotalsView`.`SaleTypeName` AS `SaleTypeName`,
  `SalesSetTotalsView`.`Seats` AS `Seats`,
  `SalesSetTotalsView`.`Value` AS `Value`,
(
    SELECT
      count(0)
    FROM
      `frtxigoo_dev2`.`Performance`
    WHERE
      `frtxigoo_dev2`.`Performance`.`PerformanceBookingId` = `frtxigoo_dev2`.`Booking`.`BookingId`
  ) * `VenueView`.`VenueSeats` AS `TotalCapacity`,
  `FinalFiguresSet`.`SetSalesFiguresDate` AS `FinalFiguresDate`,
  `FinalFiguresTotals`.`Seats` AS `FinalFiguresSeats`,
  `FinalFiguresTotals`.`Value` AS `FinalFiguresValue`,
  `NotOnSaleSet`.`SetSalesFiguresDate` AS `NotOnSaleDate`,
(
    SELECT
      sum(`frtxigoo_dev2`.`SetHold`.`SetHoldSeats`)
    FROM
      `frtxigoo_dev2`.`SetHold`
    WHERE
      `frtxigoo_dev2`.`SetHold`.`SetHoldSetId` = `frtxigoo_dev2`.`SalesSet`.`SetId`
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
                        `frtxigoo_dev2`.`ProductionView`
                        JOIN `frtxigoo_dev2`.`DateBlock` ON(
                          `ProductionView`.`ProductionId` = `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId`
                        )
                      )
                      JOIN `frtxigoo_dev2`.`Booking` ON(
                        `frtxigoo_dev2`.`DateBlock`.`DateBlockId` = `frtxigoo_dev2`.`Booking`.`BookingDateBlockId`
                      )
                    )
                    JOIN `frtxigoo_dev2`.`VenueView` ON(
                      `frtxigoo_dev2`.`Booking`.`BookingVenueId` = `VenueView`.`VenueId`
                    )
                  )
                  JOIN `frtxigoo_dev2`.`Currency` ON(
                    `VenueView`.`VenueCurrencyCode` = `frtxigoo_dev2`.`Currency`.`CurrencyCode`
                  )
                )
                LEFT JOIN `frtxigoo_dev2`.`ConversionRate` ON(
                  `VenueView`.`VenueCurrencyCode` = `frtxigoo_dev2`.`ConversionRate`.`ConversionFromCurrencyCode`
                  AND `ProductionView`.`ProductionId` = `frtxigoo_dev2`.`ConversionRate`.`ConversionProductionId`
                )
              )
              LEFT JOIN `frtxigoo_dev2`.`SalesSet` ON(
                `frtxigoo_dev2`.`Booking`.`BookingId` = `frtxigoo_dev2`.`SalesSet`.`SetBookingId`
              )
            )
            LEFT JOIN `frtxigoo_dev2`.`SalesSetTotalsView` ON(
              `frtxigoo_dev2`.`SalesSet`.`SetBookingId` = `SalesSetTotalsView`.`SetBookingId`
              AND `frtxigoo_dev2`.`SalesSet`.`SetSalesFiguresDate` = `SalesSetTotalsView`.`SetSalesFiguresDate`
            )
          )
          LEFT JOIN `frtxigoo_dev2`.`SalesSet` `FinalFiguresSet` ON(
            `frtxigoo_dev2`.`Booking`.`BookingId` = `FinalFiguresSet`.`SetBookingId`
            AND `FinalFiguresSet`.`SetIsFinalFigures` = 1
          )
        )
        LEFT JOIN `frtxigoo_dev2`.`SalesSetTotalsView` `FinalFiguresTotals` ON(
          `frtxigoo_dev2`.`Booking`.`BookingId` = `FinalFiguresTotals`.`SetBookingId`
          AND `FinalFiguresSet`.`SetSalesFiguresDate` = `FinalFiguresTotals`.`SetSalesFiguresDate`
          AND `SalesSetTotalsView`.`SaleTypeName` = `FinalFiguresTotals`.`SaleTypeName`
        )
      )
      LEFT JOIN `frtxigoo_dev2`.`SalesSet` `NotOnSaleSet` ON(
        `frtxigoo_dev2`.`Booking`.`BookingId` = `NotOnSaleSet`.`SetBookingId`
        AND `NotOnSaleSet`.`SetNotOnSale` = 1
      )
    )
    LEFT JOIN `frtxigoo_dev2`.`SalesSetTotalsView` `LatestTotals` ON(
      `frtxigoo_dev2`.`Booking`.`BookingId` = `LatestTotals`.`SetBookingId`
      AND `LatestTotals`.`SetSalesFiguresDate` = (
        SELECT
          max(`LatestTotal`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_dev2`.`SalesSetTotalsView` `LatestTotal`
        WHERE
          `LatestTotal`.`SetBookingId` = `frtxigoo_dev2`.`Booking`.`BookingId`
          AND `LatestTotal`.`Seats` > 0
      )
      AND `LatestTotals`.`SaleTypeName` = `SalesSetTotalsView`.`SaleTypeName`
    )
  )
WHERE
  `frtxigoo_dev2`.`SalesSet`.`SetId` IS NOT NULL
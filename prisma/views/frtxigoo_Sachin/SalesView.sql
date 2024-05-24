SELECT
  `ProductionView`.`ShowName` AS `ShowName`,
  `ProductionView`.`ProductionId` AS `ProductionId`,
  `ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `ProductionView`.`ProductionStartDate` AS `ProductionStartDate`,
  `ProductionView`.`ProductionEndDate` AS `ProductionEndDate`,
  `frtxigoo_Sachin`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_Sachin`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
  `frtxigoo_Sachin`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `CalculateWeekNum`(
    `frtxigoo_Sachin`.`Booking`.`BookingFirstDate`,
    `ProductionView`.`ProductionStartDate`
  ) AS `BookingProductionWeekNum`,
  `VenueView`.`VenueMainAddressTown` AS `VenueTown`,
  `VenueView`.`VenueCode` AS `VenueCode`,
  `VenueView`.`VenueName` AS `VenueName`,
  `VenueView`.`VenueCurrencyCode` AS `VenueCurrencyCode`,
  `frtxigoo_Sachin`.`ConversionRate`.`ConversionToCurrencyCode` AS `ConversionToCurrencyCode`,
  `frtxigoo_Sachin`.`ConversionRate`.`ConversionRate` AS `ConversionRate`,
  `frtxigoo_Sachin`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  `CalculateWeekNum`(
    `frtxigoo_Sachin`.`SalesSet`.`SetSalesFiguresDate`,
    `frtxigoo_Sachin`.`Booking`.`BookingFirstDate`
  ) AS `SetBookingWeekNum`,
  `CalculateWeekDate`(
    `frtxigoo_Sachin`.`SalesSet`.`SetSalesFiguresDate`
  ) AS `SetProductionWeekDate`,
  `CalculateWeekNum`(
    `frtxigoo_Sachin`.`SalesSet`.`SetSalesFiguresDate`,
    `ProductionView`.`ProductionStartDate`
  ) AS `SetProductionWeekNum`,
  `frtxigoo_Sachin`.`SalesSet`.`SetNotOnSale` AS `SetNotOnSale`,
  `frtxigoo_Sachin`.`SalesSet`.`SetIsFinalFigures` AS `SetIsFinalFigures`,
  `frtxigoo_Sachin`.`SalesSet`.`SetSingleSeats` AS `SetSingleSeats`,
  `frtxigoo_Sachin`.`SalesSet`.`SetBrochureReleased` AS `SetBrochureReleased`,
  `frtxigoo_Sachin`.`SalesSet`.`SetIsCopy` AS `SetIsCopy`,
  `SalesSetTotalsView`.`SaleTypeName` AS `SaleTypeName`,
  `SalesSetTotalsView`.`Seats` AS `Seats`,
  `SalesSetTotalsView`.`Value` AS `Value`,
(
    SELECT
      count(0)
    FROM
      `frtxigoo_Sachin`.`Performance`
    WHERE
      `frtxigoo_Sachin`.`Performance`.`PerformanceBookingId` = `frtxigoo_Sachin`.`Booking`.`BookingId`
  ) * `VenueView`.`VenueSeats` AS `TotalCapacity`,
  `FinalFiguresSet`.`SetSalesFiguresDate` AS `FinalFiguresDate`,
  `FinalFiguresTotals`.`Seats` AS `FinalFiguresSeats`,
  `FinalFiguresTotals`.`Value` AS `FinalFiguresValue`,
  `NotOnSaleSet`.`SetSalesFiguresDate` AS `NotOnSaleDate`,
(
    SELECT
      sum(`frtxigoo_Sachin`.`SetHold`.`SetHoldSeats`)
    FROM
      `frtxigoo_Sachin`.`SetHold`
    WHERE
      `frtxigoo_Sachin`.`SetHold`.`SetHoldSetId` = `frtxigoo_Sachin`.`SalesSet`.`SetId`
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
                        `frtxigoo_Sachin`.`ProductionView`
                        JOIN `frtxigoo_Sachin`.`DateBlock` ON(
                          `ProductionView`.`ProductionId` = `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId`
                        )
                      )
                      JOIN `frtxigoo_Sachin`.`Booking` ON(
                        `frtxigoo_Sachin`.`DateBlock`.`DateBlockId` = `frtxigoo_Sachin`.`Booking`.`BookingDateBlockId`
                      )
                    )
                    JOIN `frtxigoo_Sachin`.`VenueView` ON(
                      `frtxigoo_Sachin`.`Booking`.`BookingVenueId` = `VenueView`.`VenueId`
                    )
                  )
                  JOIN `frtxigoo_Sachin`.`Currency` ON(
                    `VenueView`.`VenueCurrencyCode` = `frtxigoo_Sachin`.`Currency`.`CurrencyCode`
                  )
                )
                LEFT JOIN `frtxigoo_Sachin`.`ConversionRate` ON(
                  `VenueView`.`VenueCurrencyCode` = `frtxigoo_Sachin`.`ConversionRate`.`ConversionFromCurrencyCode`
                  AND `ProductionView`.`ProductionId` = `frtxigoo_Sachin`.`ConversionRate`.`ConversionProductionId`
                )
              )
              LEFT JOIN `frtxigoo_Sachin`.`SalesSet` ON(
                `frtxigoo_Sachin`.`Booking`.`BookingId` = `frtxigoo_Sachin`.`SalesSet`.`SetBookingId`
              )
            )
            LEFT JOIN `frtxigoo_Sachin`.`SalesSetTotalsView` ON(
              `frtxigoo_Sachin`.`SalesSet`.`SetBookingId` = `SalesSetTotalsView`.`SetBookingId`
              AND `frtxigoo_Sachin`.`SalesSet`.`SetSalesFiguresDate` = `SalesSetTotalsView`.`SetSalesFiguresDate`
            )
          )
          LEFT JOIN `frtxigoo_Sachin`.`SalesSet` `FinalFiguresSet` ON(
            `frtxigoo_Sachin`.`Booking`.`BookingId` = `FinalFiguresSet`.`SetBookingId`
            AND `FinalFiguresSet`.`SetIsFinalFigures` = 1
          )
        )
        LEFT JOIN `frtxigoo_Sachin`.`SalesSetTotalsView` `FinalFiguresTotals` ON(
          `FinalFiguresSet`.`SetBookingId` = `FinalFiguresTotals`.`SetBookingId`
          AND `FinalFiguresSet`.`SetSalesFiguresDate` = `FinalFiguresTotals`.`SetSalesFiguresDate`
        )
      )
      LEFT JOIN `frtxigoo_Sachin`.`SalesSet` `NotOnSaleSet` ON(
        `frtxigoo_Sachin`.`Booking`.`BookingId` = `NotOnSaleSet`.`SetBookingId`
        AND `NotOnSaleSet`.`SetNotOnSale` = 1
      )
    )
    LEFT JOIN `frtxigoo_Sachin`.`SalesSetTotalsView` `LatestTotals` ON(
      `frtxigoo_Sachin`.`Booking`.`BookingId` = `LatestTotals`.`SetBookingId`
      AND `LatestTotals`.`SetSalesFiguresDate` = (
        SELECT
          max(`LatestTotal`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_Sachin`.`SalesSetTotalsView` `LatestTotal`
        WHERE
          `LatestTotal`.`SetBookingId` = `frtxigoo_Sachin`.`Booking`.`BookingId`
          AND `LatestTotal`.`Seats` > 0
      )
    )
  )
WHERE
  `frtxigoo_Sachin`.`SalesSet`.`SetId` IS NOT NULL
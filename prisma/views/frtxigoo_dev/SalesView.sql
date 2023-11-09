SELECT
  `TourView`.`ShowName` AS `ShowName`,
  `TourView`.`TourId` AS `TourId`,
  `TourView`.`FullTourCode` AS `FullTourCode`,
  `TourView`.`TourStartDate` AS `TourStartDate`,
  `TourView`.`TourEndDate` AS `TourEndDate`,
  `frtxigoo_dev`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_dev`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
  `frtxigoo_dev`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `CalculateWeekNum`(
    `frtxigoo_dev`.`Booking`.`BookingFirstDate`,
    `TourView`.`TourStartDate`
  ) AS `BookingTourWeekNum`,
  `VenueView`.`VenueMainAddressTown` AS `VenueTown`,
  `VenueView`.`VenueCode` AS `VenueCode`,
  `VenueView`.`VenueName` AS `VenueName`,
  `VenueView`.`VenueCurrencyCode` AS `VenueCurrencyCode`,
  `frtxigoo_dev`.`Currency`.`CurrencySymbol` AS `VenueCurrencySymbol`,
  `frtxigoo_dev`.`ConversionRate`.`ConversionToCurrencyCode` AS `ConversionToCurrencyCode`,
  `frtxigoo_dev`.`ConversionRate`.`ConversionRate` AS `ConversionRate`,
  `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  `CalculateWeekNum`(
    `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate`,
    `frtxigoo_dev`.`Booking`.`BookingFirstDate`
  ) AS `SetBookingWeekNum`,
  `CalculateWeekDate`(`frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate`) AS `SetTourWeekDate`,
  `CalculateWeekNum`(
    `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate`,
    `TourView`.`TourStartDate`
  ) AS `SetTourWeekNum`,
  `frtxigoo_dev`.`SalesSet`.`SetNotOnSale` AS `SetNotOnSale`,
  `frtxigoo_dev`.`SalesSet`.`SetIsFinalFigures` AS `SetIsFinalFigures`,
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
                        `frtxigoo_dev`.`TourView`
                        JOIN `frtxigoo_dev`.`DateBlock` ON(
                          `TourView`.`TourId` = `frtxigoo_dev`.`DateBlock`.`DateBlockTourId`
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
                  AND `TourView`.`TourId` = `frtxigoo_dev`.`ConversionRate`.`ConversionTourId`
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
          `FinalFiguresSet`.`SetBookingId` = `FinalFiguresTotals`.`SetBookingId`
          AND `FinalFiguresSet`.`SetSalesFiguresDate` = `FinalFiguresTotals`.`SetSalesFiguresDate`
        )
      )
      LEFT JOIN `frtxigoo_dev`.`SalesSet` `NotOnSaleSet` ON(
        `frtxigoo_dev`.`Booking`.`BookingId` = `NotOnSaleSet`.`SetBookingId`
        AND `NotOnSaleSet`.`SetNotOnSale` = 1
      )
    )
    LEFT JOIN `frtxigoo_dev`.`SalesSetTotalsView` `LatestTotals` ON(
      `frtxigoo_dev`.`Booking`.`BookingId` = `LatestTotals`.`SetBookingId`
      AND `FinalFiguresSet`.`SetSalesFiguresDate` = (
        SELECT
          max(`LatestTotal`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_dev`.`SalesSetTotalsView` `LatestTotal`
        WHERE
          `LatestTotal`.`SetBookingId` = `frtxigoo_dev`.`Booking`.`BookingId`
          AND `LatestTotal`.`Seats` > 0
      )
    )
  )
WHERE
  `frtxigoo_dev`.`SalesSet`.`SetId` IS NOT NULL
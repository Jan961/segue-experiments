SELECT
  `ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `frtxigoo_Sachin`.`Venue`.`VenueCode` AS `VenueCode`,
  `frtxigoo_Sachin`.`Venue`.`VenueName` AS `VenueName`,
  `frtxigoo_Sachin`.`Venue`.`VenueSeats` AS `VenueSeats`,
  `frtxigoo_Sachin`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
  `frtxigoo_Sachin`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `BookingHoldCompUnionView`.`HoldOrComp` AS `HoldOrComp`,
  `BookingHoldCompUnionView`.`Code` AS `Code`,
  `BookingHoldCompUnionView`.`Name` AS `Name`,
  sum(`BookingHoldCompUnionView`.`Seats`) AS `Seats`,
(
    SELECT
      `SalesSetTotalsView`.`Seats`
    FROM
      `frtxigoo_Sachin`.`SalesSetTotalsView`
    WHERE
      `SalesSetTotalsView`.`SetBookingId` = `frtxigoo_Sachin`.`Booking`.`BookingId`
      AND `SalesSetTotalsView`.`SaleTypeName` = 'General Sales'
      AND `SalesSetTotalsView`.`SetSalesFiguresDate` = (
        SELECT
          max(`SS1`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_Sachin`.`SalesSet` `SS1`
        WHERE
          `SS1`.`SetBookingId` = `SalesSetTotalsView`.`SetBookingId`
      )
  ) AS `SoldSeats`,
(
    SELECT
      `SalesSetTotalsView`.`Seats`
    FROM
      `frtxigoo_Sachin`.`SalesSetTotalsView`
    WHERE
      `SalesSetTotalsView`.`SetBookingId` = `frtxigoo_Sachin`.`Booking`.`BookingId`
      AND `SalesSetTotalsView`.`SaleTypeName` = 'General Reserved'
      AND `SalesSetTotalsView`.`SetSalesFiguresDate` = (
        SELECT
          max(`SS1`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_Sachin`.`SalesSet` `SS1`
        WHERE
          `SS1`.`SetBookingId` = `SalesSetTotalsView`.`SetBookingId`
      )
  ) AS `ReservedSeats`
FROM
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
      JOIN `frtxigoo_Sachin`.`Venue` ON(
        `frtxigoo_Sachin`.`Booking`.`BookingVenueId` = `frtxigoo_Sachin`.`Venue`.`VenueId`
      )
    )
    JOIN `frtxigoo_Sachin`.`BookingHoldCompUnionView` ON(
      `BookingHoldCompUnionView`.`SetBookingId` = `frtxigoo_Sachin`.`Booking`.`BookingId`
      AND `BookingHoldCompUnionView`.`SetSalesFiguresDate` = (
        SELECT
          max(`SS2`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_Sachin`.`SalesSet` `SS2`
        WHERE
          `SS2`.`SetBookingId` = `BookingHoldCompUnionView`.`SetBookingId`
      )
    )
  )
GROUP BY
  `ProductionView`.`FullProductionCode`,
  `frtxigoo_Sachin`.`Venue`.`VenueCode`,
  `frtxigoo_Sachin`.`Venue`.`VenueName`,
  `frtxigoo_Sachin`.`Venue`.`VenueSeats`,
  `frtxigoo_Sachin`.`Booking`.`BookingFirstDate`,
  `BookingHoldCompUnionView`.`HoldOrComp`,
  `BookingHoldCompUnionView`.`Code`,
  `BookingHoldCompUnionView`.`Name`
SELECT
  `ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `frtxigoo_dev2`.`Venue`.`VenueCode` AS `VenueCode`,
  `frtxigoo_dev2`.`Venue`.`VenueName` AS `VenueName`,
  `frtxigoo_dev2`.`Venue`.`VenueSeats` AS `VenueSeats`,
  `frtxigoo_dev2`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
  `frtxigoo_dev2`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `BookingHoldCompUnionView`.`HoldOrComp` AS `HoldOrComp`,
  `BookingHoldCompUnionView`.`Code` AS `Code`,
  `BookingHoldCompUnionView`.`Name` AS `Name`,
  sum(`BookingHoldCompUnionView`.`Seats`) AS `Seats`,
(
    SELECT
      `SalesSetTotalsView`.`Seats`
    FROM
      `frtxigoo_dev2`.`SalesSetTotalsView`
    WHERE
      `SalesSetTotalsView`.`SetBookingId` = `frtxigoo_dev2`.`Booking`.`BookingId`
      AND `SalesSetTotalsView`.`SaleTypeName` = 'General Sales'
      AND `SalesSetTotalsView`.`SetSalesFiguresDate` = (
        SELECT
          max(`SS1`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_dev2`.`SalesSet` `SS1`
        WHERE
          `SS1`.`SetBookingId` = `SalesSetTotalsView`.`SetBookingId`
      )
  ) AS `SoldSeats`,
(
    SELECT
      `SalesSetTotalsView`.`Seats`
    FROM
      `frtxigoo_dev2`.`SalesSetTotalsView`
    WHERE
      `SalesSetTotalsView`.`SetBookingId` = `frtxigoo_dev2`.`Booking`.`BookingId`
      AND `SalesSetTotalsView`.`SaleTypeName` = 'General Reserved'
      AND `SalesSetTotalsView`.`SetSalesFiguresDate` = (
        SELECT
          max(`SS1`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_dev2`.`SalesSet` `SS1`
        WHERE
          `SS1`.`SetBookingId` = `SalesSetTotalsView`.`SetBookingId`
      )
  ) AS `ReservedSeats`
FROM
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
      JOIN `frtxigoo_dev2`.`Venue` ON(
        `frtxigoo_dev2`.`Booking`.`BookingVenueId` = `frtxigoo_dev2`.`Venue`.`VenueId`
      )
    )
    JOIN `frtxigoo_dev2`.`BookingHoldCompUnionView` ON(
      `BookingHoldCompUnionView`.`SetBookingId` = `frtxigoo_dev2`.`Booking`.`BookingId`
      AND `BookingHoldCompUnionView`.`SetSalesFiguresDate` = (
        SELECT
          max(`SS2`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_dev2`.`SalesSet` `SS2`
        WHERE
          `SS2`.`SetBookingId` = `BookingHoldCompUnionView`.`SetBookingId`
      )
    )
  )
GROUP BY
  `ProductionView`.`FullProductionCode`,
  `frtxigoo_dev2`.`Venue`.`VenueCode`,
  `frtxigoo_dev2`.`Venue`.`VenueName`,
  `frtxigoo_dev2`.`Venue`.`VenueSeats`,
  `frtxigoo_dev2`.`Booking`.`BookingFirstDate`,
  `BookingHoldCompUnionView`.`HoldOrComp`,
  `BookingHoldCompUnionView`.`Code`,
  `BookingHoldCompUnionView`.`Name`
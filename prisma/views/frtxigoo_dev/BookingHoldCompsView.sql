SELECT
  `ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `frtxigoo_dev`.`Venue`.`VenueCode` AS `VenueCode`,
  `frtxigoo_dev`.`Venue`.`VenueName` AS `VenueName`,
  `frtxigoo_dev`.`Venue`.`VenueSeats` AS `VenueSeats`,
  `frtxigoo_dev`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
  `frtxigoo_dev`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `BookingHoldCompUnionView`.`HoldOrComp` AS `HoldOrComp`,
  `BookingHoldCompUnionView`.`Code` AS `Code`,
  `BookingHoldCompUnionView`.`Name` AS `Name`,
  sum(`BookingHoldCompUnionView`.`Seats`) AS `Seats`,
(
    SELECT
      `SalesSetTotalsView`.`Seats`
    FROM
      `frtxigoo_dev`.`SalesSetTotalsView`
    WHERE
      `SalesSetTotalsView`.`SetBookingId` = `frtxigoo_dev`.`Booking`.`BookingId`
      AND `SalesSetTotalsView`.`SaleTypeName` = 'General Sales'
      AND `SalesSetTotalsView`.`SetSalesFiguresDate` = (
        SELECT
          max(`SS1`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_dev`.`SalesSet` `SS1`
        WHERE
          `SS1`.`SetBookingId` = `SalesSetTotalsView`.`SetBookingId`
      )
  ) AS `SoldSeats`,
(
    SELECT
      `SalesSetTotalsView`.`Seats`
    FROM
      `frtxigoo_dev`.`SalesSetTotalsView`
    WHERE
      `SalesSetTotalsView`.`SetBookingId` = `frtxigoo_dev`.`Booking`.`BookingId`
      AND `SalesSetTotalsView`.`SaleTypeName` = 'General Reserved'
      AND `SalesSetTotalsView`.`SetSalesFiguresDate` = (
        SELECT
          max(`SS1`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_dev`.`SalesSet` `SS1`
        WHERE
          `SS1`.`SetBookingId` = `SalesSetTotalsView`.`SetBookingId`
      )
  ) AS `ReservedSeats`
FROM
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
      JOIN `frtxigoo_dev`.`Venue` ON(
        `frtxigoo_dev`.`Booking`.`BookingVenueId` = `frtxigoo_dev`.`Venue`.`VenueId`
      )
    )
    JOIN `frtxigoo_dev`.`BookingHoldCompUnionView` ON(
      `BookingHoldCompUnionView`.`SetBookingId` = `frtxigoo_dev`.`Booking`.`BookingId`
      AND `BookingHoldCompUnionView`.`SetSalesFiguresDate` = (
        SELECT
          max(`SS2`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_dev`.`SalesSet` `SS2`
        WHERE
          `SS2`.`SetBookingId` = `BookingHoldCompUnionView`.`SetBookingId`
      )
    )
  )
GROUP BY
  `ProductionView`.`FullProductionCode`,
  `frtxigoo_dev`.`Venue`.`VenueCode`,
  `frtxigoo_dev`.`Venue`.`VenueName`,
  `frtxigoo_dev`.`Venue`.`VenueSeats`,
  `frtxigoo_dev`.`Booking`.`BookingFirstDate`,
  `BookingHoldCompUnionView`.`HoldOrComp`,
  `BookingHoldCompUnionView`.`Code`,
  `BookingHoldCompUnionView`.`Name`
SELECT
  `frtxigoo_dev`.`TourView`.`FullTourCode` AS `FullTourCode`,
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
      `frtxigoo_dev`.`SalesSetTotalsView`.`Seats`
    FROM
      `frtxigoo_dev`.`SalesSetTotalsView`
    WHERE
      `frtxigoo_dev`.`SalesSetTotalsView`.`SetBookingId` = `frtxigoo_dev`.`Booking`.`BookingId`
      AND `frtxigoo_dev`.`SalesSetTotalsView`.`SaleTypeName` = 'General Sales'
      AND `frtxigoo_dev`.`SalesSetTotalsView`.`SetSalesFiguresDate` = (
        SELECT
          max(`SS1`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_dev`.`SalesSet` `SS1`
        WHERE
          `SS1`.`SetBookingId` = `frtxigoo_dev`.`SalesSetTotalsView`.`SetBookingId`
      )
  ) AS `SoldSeats`,
(
    SELECT
      `frtxigoo_dev`.`SalesSetTotalsView`.`Seats`
    FROM
      `frtxigoo_dev`.`SalesSetTotalsView`
    WHERE
      `frtxigoo_dev`.`SalesSetTotalsView`.`SetBookingId` = `frtxigoo_dev`.`Booking`.`BookingId`
      AND `frtxigoo_dev`.`SalesSetTotalsView`.`SaleTypeName` = 'General Reserved'
      AND `frtxigoo_dev`.`SalesSetTotalsView`.`SetSalesFiguresDate` = (
        SELECT
          max(`SS1`.`SetSalesFiguresDate`)
        FROM
          `frtxigoo_dev`.`SalesSet` `SS1`
        WHERE
          `SS1`.`SetBookingId` = `frtxigoo_dev`.`SalesSetTotalsView`.`SetBookingId`
      )
  ) AS `ReservedSeats`
FROM
  (
    (
      (
        (
          `frtxigoo_dev`.`TourView`
          JOIN `frtxigoo_dev`.`DateBlock` ON(
            `frtxigoo_dev`.`TourView`.`TourId` = `frtxigoo_dev`.`DateBlock`.`DateBlockTourId`
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
  `frtxigoo_dev`.`TourView`.`FullTourCode`,
  `frtxigoo_dev`.`Venue`.`VenueCode`,
  `frtxigoo_dev`.`Venue`.`VenueName`,
  `frtxigoo_dev`.`Venue`.`VenueSeats`,
  `frtxigoo_dev`.`Booking`.`BookingFirstDate`,
  `BookingHoldCompUnionView`.`HoldOrComp`,
  `BookingHoldCompUnionView`.`Code`,
  `BookingHoldCompUnionView`.`Name`
SELECT
  `frtxigoo_dev`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_dev`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `frtxigoo_dev`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
  `frtxigoo_dev`.`VenueView`.`VenueId` AS `VenueId`,
  `frtxigoo_dev`.`VenueView`.`VenueCode` AS `VenueCode`,
  `frtxigoo_dev`.`VenueView`.`VenueMainAddressTown` AS `VenueMainAddressTown`,
  `frtxigoo_dev`.`TourView`.`TourId` AS `TourId`,
  `frtxigoo_dev`.`TourView`.`FullTourCode` AS `FullTourCode`,
  `CalculateWeekNum`(
    `frtxigoo_dev`.`TourView`.`TourEndDate`,
    `frtxigoo_dev`.`TourView`.`TourStartDate`
  ) AS `TourLengthWeeks`
FROM
  (
    (
      (
        `frtxigoo_dev`.`Booking`
        JOIN `frtxigoo_dev`.`VenueView` ON(
          `frtxigoo_dev`.`Booking`.`BookingVenueId` = `frtxigoo_dev`.`VenueView`.`VenueId`
        )
      )
      JOIN `frtxigoo_dev`.`DateBlock` ON(
        `frtxigoo_dev`.`Booking`.`BookingDateBlockId` = `frtxigoo_dev`.`DateBlock`.`DateBlockId`
      )
    )
    JOIN `frtxigoo_dev`.`TourView` ON(
      `frtxigoo_dev`.`TourView`.`TourId` = `frtxigoo_dev`.`DateBlock`.`DateBlockTourId`
    )
  )
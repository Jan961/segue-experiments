SELECT
  `frtxigoo_dev2`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_dev2`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `frtxigoo_dev2`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
  `frtxigoo_dev2`.`VenueView`.`VenueId` AS `VenueId`,
  `frtxigoo_dev2`.`VenueView`.`VenueCode` AS `VenueCode`,
  `frtxigoo_dev2`.`VenueView`.`VenueMainAddressTown` AS `VenueMainAddressTown`,
  `frtxigoo_dev2`.`ProductionView`.`ProductionId` AS `ProductionId`,
  `frtxigoo_dev2`.`ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `CalculateWeekNum`(
    `frtxigoo_dev2`.`ProductionView`.`ProductionEndDate`,
    `frtxigoo_dev2`.`ProductionView`.`ProductionStartDate`
  ) AS `ProductionLengthWeeks`
FROM
  (
    (
      (
        `frtxigoo_dev2`.`Booking`
        JOIN `frtxigoo_dev2`.`VenueView` ON(
          `frtxigoo_dev2`.`Booking`.`BookingVenueId` = `frtxigoo_dev2`.`VenueView`.`VenueId`
        )
      )
      JOIN `frtxigoo_dev2`.`DateBlock` ON(
        `frtxigoo_dev2`.`Booking`.`BookingDateBlockId` = `frtxigoo_dev2`.`DateBlock`.`DateBlockId`
      )
    )
    JOIN `frtxigoo_dev2`.`ProductionView` ON(
      `frtxigoo_dev2`.`ProductionView`.`ProductionId` = `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId`
    )
  )
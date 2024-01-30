SELECT
  `frtxigoo_dev2`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_dev2`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `frtxigoo_dev2`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
  `VenueView`.`VenueId` AS `VenueId`,
  `VenueView`.`VenueCode` AS `VenueCode`,
  `VenueView`.`VenueMainAddressTown` AS `VenueMainAddressTown`,
  `ProductionView`.`ProductionId` AS `ProductionId`,
  `ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `CalculateWeekNum`(
    `ProductionView`.`ProductionEndDate`,
    `ProductionView`.`ProductionStartDate`
  ) AS `ProductionLengthWeeks`
FROM
  (
    (
      (
        `frtxigoo_dev2`.`Booking`
        JOIN `frtxigoo_dev2`.`VenueView` ON(
          `frtxigoo_dev2`.`Booking`.`BookingVenueId` = `VenueView`.`VenueId`
        )
      )
      JOIN `frtxigoo_dev2`.`DateBlock` ON(
        `frtxigoo_dev2`.`Booking`.`BookingDateBlockId` = `frtxigoo_dev2`.`DateBlock`.`DateBlockId`
      )
    )
    JOIN `frtxigoo_dev2`.`ProductionView` ON(
      `ProductionView`.`ProductionId` = `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId`
    )
  )
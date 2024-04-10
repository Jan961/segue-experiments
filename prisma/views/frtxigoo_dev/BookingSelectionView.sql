SELECT
  `frtxigoo_dev`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_dev`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `frtxigoo_dev`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
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
        `frtxigoo_dev`.`Booking`
        JOIN `frtxigoo_dev`.`VenueView` ON(
          `frtxigoo_dev`.`Booking`.`BookingVenueId` = `VenueView`.`VenueId`
        )
      )
      JOIN `frtxigoo_dev`.`DateBlock` ON(
        `frtxigoo_dev`.`Booking`.`BookingDateBlockId` = `frtxigoo_dev`.`DateBlock`.`DateBlockId`
      )
    )
    JOIN `frtxigoo_dev`.`ProductionView` ON(
      `ProductionView`.`ProductionId` = `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId`
    )
  )
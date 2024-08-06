SELECT
  `frtxigoo_dev`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_dev`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `frtxigoo_dev`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
  `frtxigoo_dev`.`VenueView`.`VenueId` AS `VenueId`,
  `frtxigoo_dev`.`VenueView`.`VenueCode` AS `VenueCode`,
  `frtxigoo_dev`.`VenueView`.`VenueMainAddressTown` AS `VenueMainAddressTown`,
  `frtxigoo_dev`.`ProductionView`.`ProductionId` AS `ProductionId`,
  `frtxigoo_dev`.`ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `CalculateWeekNum`(
    `frtxigoo_dev`.`ProductionView`.`ProductionEndDate`,
    `frtxigoo_dev`.`ProductionView`.`ProductionStartDate`
  ) AS `ProductionLengthWeeks`
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
    JOIN `frtxigoo_dev`.`ProductionView` ON(
      `frtxigoo_dev`.`ProductionView`.`ProductionId` = `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId`
    )
  )
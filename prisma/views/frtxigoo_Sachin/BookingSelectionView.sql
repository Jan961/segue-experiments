SELECT
  `frtxigoo_Sachin`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_Sachin`.`Booking`.`BookingStatusCode` AS `BookingStatusCode`,
  `frtxigoo_Sachin`.`Booking`.`BookingFirstDate` AS `BookingFirstDate`,
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
        `frtxigoo_Sachin`.`Booking`
        JOIN `frtxigoo_Sachin`.`VenueView` ON(
          `frtxigoo_Sachin`.`Booking`.`BookingVenueId` = `VenueView`.`VenueId`
        )
      )
      JOIN `frtxigoo_Sachin`.`DateBlock` ON(
        `frtxigoo_Sachin`.`Booking`.`BookingDateBlockId` = `frtxigoo_Sachin`.`DateBlock`.`DateBlockId`
      )
    )
    JOIN `frtxigoo_Sachin`.`ProductionView` ON(
      `ProductionView`.`ProductionId` = `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId`
    )
  )
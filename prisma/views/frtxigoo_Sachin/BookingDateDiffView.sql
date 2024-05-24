SELECT
  `B1`.`BookingDateBlockId` AS `BookingDateBlockId`,
  `B1`.`BookingId` AS `FromBookingId`,
  `B2`.`BookingId` AS `ToBookingId`,
  to_days(`B2`.`BookingFirstDate`) - to_days(`B1`.`BookingFirstDate`) AS `DaysDifference`,
  `B1`.`BookingVenueId` AS `FromVenueId`,
  `B2`.`BookingVenueId` AS `ToVenueId`
FROM
  (
    `frtxigoo_Sachin`.`Booking` `B1`
    JOIN `frtxigoo_Sachin`.`Booking` `B2` ON(
      `B1`.`BookingDateBlockId` = `B2`.`BookingDateBlockId`
      AND `B1`.`BookingFirstDate` < `B2`.`BookingFirstDate`
    )
  )
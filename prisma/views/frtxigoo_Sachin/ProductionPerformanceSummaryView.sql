SELECT
  `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  `frtxigoo_Sachin`.`Booking`.`BookingStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    (
      `frtxigoo_Sachin`.`Performance`
      JOIN `frtxigoo_Sachin`.`Booking` ON(
        `frtxigoo_Sachin`.`Performance`.`PerformanceBookingId` = `frtxigoo_Sachin`.`Booking`.`BookingId`
      )
    )
    JOIN `frtxigoo_Sachin`.`DateBlock` ON(
      `frtxigoo_Sachin`.`Booking`.`BookingDateBlockId` = `frtxigoo_Sachin`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_Sachin`.`Booking`.`BookingStatusCode`
ORDER BY
  `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_Sachin`.`Booking`.`BookingStatusCode`
SELECT
  `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  `frtxigoo_dev2`.`Booking`.`BookingStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    (
      `frtxigoo_dev2`.`Performance`
      JOIN `frtxigoo_dev2`.`Booking` ON(
        `frtxigoo_dev2`.`Performance`.`PerformanceBookingId` = `frtxigoo_dev2`.`Booking`.`BookingId`
      )
    )
    JOIN `frtxigoo_dev2`.`DateBlock` ON(
      `frtxigoo_dev2`.`Booking`.`BookingDateBlockId` = `frtxigoo_dev2`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_dev2`.`Booking`.`BookingStatusCode`
ORDER BY
  `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_dev2`.`Booking`.`BookingStatusCode`
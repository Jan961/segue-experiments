SELECT
  `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  `frtxigoo_dev`.`Booking`.`BookingStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    (
      `frtxigoo_dev`.`Performance`
      JOIN `frtxigoo_dev`.`Booking` ON(
        `frtxigoo_dev`.`Performance`.`PerformanceBookingId` = `frtxigoo_dev`.`Booking`.`BookingId`
      )
    )
    JOIN `frtxigoo_dev`.`DateBlock` ON(
      `frtxigoo_dev`.`Booking`.`BookingDateBlockId` = `frtxigoo_dev`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_dev`.`Booking`.`BookingStatusCode`
ORDER BY
  `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_dev`.`Booking`.`BookingStatusCode`
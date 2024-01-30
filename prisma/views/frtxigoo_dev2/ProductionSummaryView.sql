SELECT
  `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  NULL AS `DateTypeAffectsAvailability`,
  NULL AS `DateTypeId`,
  NULL AS `DateTypeSeqNo`,
  'Booking' AS `Item`,
  `frtxigoo_dev2`.`Booking`.`BookingStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    `frtxigoo_dev2`.`Booking`
    JOIN `frtxigoo_dev2`.`DateBlock` ON(
      `frtxigoo_dev2`.`Booking`.`BookingDateBlockId` = `frtxigoo_dev2`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_dev2`.`Booking`.`BookingStatusCode`
UNION
SELECT
  `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  NULL AS `DateTypeAffectsAvailability`,
  NULL AS `DateTypeId`,
  NULL AS `DateTypeSeqNo`,
  'Rehearsal' AS `Item`,
  `frtxigoo_dev2`.`Rehearsal`.`RehearsalStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    `frtxigoo_dev2`.`Rehearsal`
    JOIN `frtxigoo_dev2`.`DateBlock` ON(
      `frtxigoo_dev2`.`Rehearsal`.`RehearsalDateBlockId` = `frtxigoo_dev2`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_dev2`.`Rehearsal`.`RehearsalStatusCode`
UNION
SELECT
  `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  NULL AS `DateTypeAffectsAvailability`,
  NULL AS `DateTypeId`,
  NULL AS `DateTypeSeqNo`,
  'Get-In / Fit-Up' AS `Item`,
  `frtxigoo_dev2`.`GetInFitUp`.`GetInFitUpStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    `frtxigoo_dev2`.`GetInFitUp`
    JOIN `frtxigoo_dev2`.`DateBlock` ON(
      `frtxigoo_dev2`.`GetInFitUp`.`GetInFitUpDateBlockId` = `frtxigoo_dev2`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_dev2`.`GetInFitUp`.`GetInFitUpStatusCode`
UNION
SELECT
  `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  `frtxigoo_dev2`.`DateType`.`DateTypeAffectsAvailability` AS `AffectsAvailability`,
  `frtxigoo_dev2`.`DateType`.`DateTypeId` AS `DateTypeId`,
  `frtxigoo_dev2`.`DateType`.`DateTypeSeqNo` AS `DateTypeSeqNo`,
  `frtxigoo_dev2`.`DateType`.`DateTypeName` AS `DateTypeName`,
  `frtxigoo_dev2`.`Other`.`OtherStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    (
      `frtxigoo_dev2`.`Other`
      JOIN `frtxigoo_dev2`.`DateBlock`
    )
    JOIN `frtxigoo_dev2`.`DateType` ON(
      `frtxigoo_dev2`.`Other`.`OtherDateTypeId` = `frtxigoo_dev2`.`DateType`.`DateTypeId`
      AND `frtxigoo_dev2`.`Other`.`OtherDateBlockId` = `frtxigoo_dev2`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_dev2`.`Other`.`OtherStatusCode`
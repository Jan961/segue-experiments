SELECT
  `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  NULL AS `DateTypeAffectsAvailability`,
  NULL AS `DateTypeId`,
  NULL AS `DateTypeSeqNo`,
  'Booking' AS `Item`,
  `frtxigoo_dev`.`Booking`.`BookingStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    `frtxigoo_dev`.`Booking`
    JOIN `frtxigoo_dev`.`DateBlock` ON(
      `frtxigoo_dev`.`Booking`.`BookingDateBlockId` = `frtxigoo_dev`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_dev`.`Booking`.`BookingStatusCode`
UNION
SELECT
  `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  NULL AS `DateTypeAffectsAvailability`,
  NULL AS `DateTypeId`,
  NULL AS `DateTypeSeqNo`,
  'Rehearsal' AS `Item`,
  `frtxigoo_dev`.`Rehearsal`.`RehearsalStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    `frtxigoo_dev`.`Rehearsal`
    JOIN `frtxigoo_dev`.`DateBlock` ON(
      `frtxigoo_dev`.`Rehearsal`.`RehearsalDateBlockId` = `frtxigoo_dev`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_dev`.`Rehearsal`.`RehearsalStatusCode`
UNION
SELECT
  `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  NULL AS `DateTypeAffectsAvailability`,
  NULL AS `DateTypeId`,
  NULL AS `DateTypeSeqNo`,
  'Get-In / Fit-Up' AS `Item`,
  `frtxigoo_dev`.`GetInFitUp`.`GetInFitUpStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    `frtxigoo_dev`.`GetInFitUp`
    JOIN `frtxigoo_dev`.`DateBlock` ON(
      `frtxigoo_dev`.`GetInFitUp`.`GetInFitUpDateBlockId` = `frtxigoo_dev`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_dev`.`GetInFitUp`.`GetInFitUpStatusCode`
UNION
SELECT
  `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  `frtxigoo_dev`.`DateType`.`DateTypeAffectsAvailability` AS `AffectsAvailability`,
  `frtxigoo_dev`.`DateType`.`DateTypeId` AS `DateTypeId`,
  `frtxigoo_dev`.`DateType`.`DateTypeSeqNo` AS `DateTypeSeqNo`,
  `frtxigoo_dev`.`DateType`.`DateTypeName` AS `DateTypeName`,
  `frtxigoo_dev`.`Other`.`OtherStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    (
      `frtxigoo_dev`.`Other`
      JOIN `frtxigoo_dev`.`DateBlock`
    )
    JOIN `frtxigoo_dev`.`DateType` ON(
      `frtxigoo_dev`.`Other`.`OtherDateTypeId` = `frtxigoo_dev`.`DateType`.`DateTypeId`
      AND `frtxigoo_dev`.`Other`.`OtherDateBlockId` = `frtxigoo_dev`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_dev`.`Other`.`OtherStatusCode`
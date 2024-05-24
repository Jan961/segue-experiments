SELECT
  `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  NULL AS `DateTypeAffectsAvailability`,
  NULL AS `DateTypeId`,
  NULL AS `DateTypeSeqNo`,
  'Booking' AS `Item`,
  `frtxigoo_Sachin`.`Booking`.`BookingStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    `frtxigoo_Sachin`.`Booking`
    JOIN `frtxigoo_Sachin`.`DateBlock` ON(
      `frtxigoo_Sachin`.`Booking`.`BookingDateBlockId` = `frtxigoo_Sachin`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_Sachin`.`Booking`.`BookingStatusCode`
UNION
SELECT
  `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  NULL AS `DateTypeAffectsAvailability`,
  NULL AS `DateTypeId`,
  NULL AS `DateTypeSeqNo`,
  'Rehearsal' AS `Item`,
  `frtxigoo_Sachin`.`Rehearsal`.`RehearsalStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    `frtxigoo_Sachin`.`Rehearsal`
    JOIN `frtxigoo_Sachin`.`DateBlock` ON(
      `frtxigoo_Sachin`.`Rehearsal`.`RehearsalDateBlockId` = `frtxigoo_Sachin`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_Sachin`.`Rehearsal`.`RehearsalStatusCode`
UNION
SELECT
  `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  NULL AS `DateTypeAffectsAvailability`,
  NULL AS `DateTypeId`,
  NULL AS `DateTypeSeqNo`,
  'Get-In / Fit-Up' AS `Item`,
  `frtxigoo_Sachin`.`GetInFitUp`.`GetInFitUpStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    `frtxigoo_Sachin`.`GetInFitUp`
    JOIN `frtxigoo_Sachin`.`DateBlock` ON(
      `frtxigoo_Sachin`.`GetInFitUp`.`GetInFitUpDateBlockId` = `frtxigoo_Sachin`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_Sachin`.`GetInFitUp`.`GetInFitUpStatusCode`
UNION
SELECT
  `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId` AS `ProductionId`,
  `frtxigoo_Sachin`.`DateType`.`DateTypeAffectsAvailability` AS `AffectsAvailability`,
  `frtxigoo_Sachin`.`DateType`.`DateTypeId` AS `DateTypeId`,
  `frtxigoo_Sachin`.`DateType`.`DateTypeSeqNo` AS `DateTypeSeqNo`,
  `frtxigoo_Sachin`.`DateType`.`DateTypeName` AS `DateTypeName`,
  `frtxigoo_Sachin`.`Other`.`OtherStatusCode` AS `StatusCode`,
  count(0) AS `Count`
FROM
  (
    (
      `frtxigoo_Sachin`.`Other`
      JOIN `frtxigoo_Sachin`.`DateBlock`
    )
    JOIN `frtxigoo_Sachin`.`DateType` ON(
      `frtxigoo_Sachin`.`Other`.`OtherDateTypeId` = `frtxigoo_Sachin`.`DateType`.`DateTypeId`
      AND `frtxigoo_Sachin`.`Other`.`OtherDateBlockId` = `frtxigoo_Sachin`.`DateBlock`.`DateBlockId`
    )
  )
GROUP BY
  `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId`,
  `frtxigoo_Sachin`.`Other`.`OtherStatusCode`
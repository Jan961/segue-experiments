SELECT
  `ProductionView`.`ProductionId` AS `ProductionId`,
  `ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `ProductionView`.`ShowName` AS `ShowName`,
  `ProductionView`.`RehearsalStartDate` AS `RehearsalStartDate`,
  `ProductionView`.`ProductionStartDate` AS `ProductionStartDate`,
  `ProductionView`.`ProductionEndDate` AS `ProductionEndDate`,
  `DateBlockDatesView`.`EntryDate` AS `EntryDate`,
  `CalculateWeekNum`(
    `DateBlockDatesView`.`EntryDate`,
    `ProductionView`.`ProductionStartDate`
  ) AS `ProductionWeekNum`,
  `DateBlockDatesView`.`EntryType` AS `EntryType`,
  `DateBlockDatesView`.`EntryId` AS `EntryId`,
  `DateBlockDatesView`.`EntryName` AS `EntryName`,
  `DateBlockDatesView`.`StatusCode` AS `EntryStatusCode`,
  `DateBlockDatesView`.`TownName` AS `Location`,
  `DateBlockDatesView`.`PencilNum` AS `PencilNum`,
  `DateBlockDatesView`.`VenueId` AS `VenueId`,
  `DateBlockDatesView`.`VenueSeats` AS `VenueSeats`,
  `DateBlockDatesView`.`Mileage` AS `Mileage`,
  `DateBlockDatesView`.`TimeMins` AS `TimeMins`,
  `DateBlockDatesView`.`DateTypeId` AS `DateTypeId`,
  `DateBlockDatesView`.`DateTypeName` AS `DateTypeName`,
  `DateBlockDatesView`.`AffectsAvailability` AS `AffectsAvailability`,
  `DateBlockDatesView`.`SeqNo` AS `SeqNo`
FROM
  (
    (
      `frtxigoo_Sachin`.`ProductionView`
      JOIN `frtxigoo_Sachin`.`DateBlock` ON(
        `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId` = `ProductionView`.`ProductionId`
      )
    )
    JOIN `frtxigoo_Sachin`.`DateBlockDatesView` ON(
      `frtxigoo_Sachin`.`DateBlock`.`DateBlockId` = `DateBlockDatesView`.`DateBlockId`
    )
  )
ORDER BY
  `DateBlockDatesView`.`EntryDate`
SELECT
  `TourView`.`TourId` AS `TourId`,
  `TourView`.`FullTourCode` AS `FullTourCode`,
  `TourView`.`ShowName` AS `ShowName`,
  `TourView`.`RehearsalStartDate` AS `RehearsalStartDate`,
  `TourView`.`TourStartDate` AS `TourStartDate`,
  `TourView`.`TourEndDate` AS `TourEndDate`,
  `DateBlockDatesView`.`EntryDate` AS `EntryDate`,
  `CalculateWeekNum`(
    `DateBlockDatesView`.`EntryDate`,
    `TourView`.`TourStartDate`
  ) AS `TourWeekNum`,
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
      `frtxigoo_dev`.`TourView`
      JOIN `frtxigoo_dev`.`DateBlock` ON(
        `frtxigoo_dev`.`DateBlock`.`DateBlockTourId` = `TourView`.`TourId`
      )
    )
    JOIN `frtxigoo_dev`.`DateBlockDatesView` ON(
      `frtxigoo_dev`.`DateBlock`.`DateBlockId` = `DateBlockDatesView`.`DateBlockId`
    )
  )
ORDER BY
  `DateBlockDatesView`.`EntryDate`
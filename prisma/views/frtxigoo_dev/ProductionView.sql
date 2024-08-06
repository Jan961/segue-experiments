SELECT
  `frtxigoo_dev`.`Production`.`ProductionId` AS `ProductionId`,
  `frtxigoo_dev`.`Production`.`ProductionCode` AS `ProductionCode`,
  concat(
    `frtxigoo_dev`.`Show`.`ShowCode`,
    `frtxigoo_dev`.`Production`.`ProductionCode`
  ) AS `FullProductionCode`,
  `frtxigoo_dev`.`Production`.`ProductionSalesEmail` AS `ProductionSalesEmail`,
  `frtxigoo_dev`.`Production`.`ProductionIsArchived` AS `ProductionIsArchived`,
  `frtxigoo_dev`.`Production`.`ProductionIsDeleted` AS `ProductionIsDeleted`,
  `frtxigoo_dev`.`Show`.`ShowId` AS `ShowId`,
  `frtxigoo_dev`.`Show`.`ShowCode` AS `ShowCode`,
  `frtxigoo_dev`.`Show`.`ShowName` AS `ShowName`,
  `frtxigoo_dev`.`Show`.`ShowType` AS `ShowType`,
  `frtxigoo_dev`.`Production`.`ProductionLogoFileId` AS `ProductionLogoFileId`,
(
    SELECT
      `frtxigoo_dev`.`DateBlock`.`DateBlockStartDate`
    FROM
      `frtxigoo_dev`.`DateBlock`
    WHERE
      `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId` = `frtxigoo_dev`.`Production`.`ProductionId`
      AND `frtxigoo_dev`.`DateBlock`.`DateBlockName` = 'Rehearsal'
  ) AS `RehearsalStartDate`,
(
    SELECT
      `frtxigoo_dev`.`DateBlock`.`DateBlockEndDate`
    FROM
      `frtxigoo_dev`.`DateBlock`
    WHERE
      `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId` = `frtxigoo_dev`.`Production`.`ProductionId`
      AND `frtxigoo_dev`.`DateBlock`.`DateBlockName` = 'Rehearsal'
  ) AS `RehearsalEndDate`,
(
    SELECT
      `frtxigoo_dev`.`DateBlock`.`DateBlockStartDate`
    FROM
      `frtxigoo_dev`.`DateBlock`
    WHERE
      `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId` = `frtxigoo_dev`.`Production`.`ProductionId`
      AND `frtxigoo_dev`.`DateBlock`.`DateBlockName` = 'Production'
  ) AS `ProductionStartDate`,
(
    SELECT
      `frtxigoo_dev`.`DateBlock`.`DateBlockEndDate`
    FROM
      `frtxigoo_dev`.`DateBlock`
    WHERE
      `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId` = `frtxigoo_dev`.`Production`.`ProductionId`
      AND `frtxigoo_dev`.`DateBlock`.`DateBlockName` = 'Production'
  ) AS `ProductionEndDate`
FROM
  (
    `frtxigoo_dev`.`Production`
    JOIN `frtxigoo_dev`.`Show` ON(
      `frtxigoo_dev`.`Show`.`ShowId` = `frtxigoo_dev`.`Production`.`ProductionShowId`
    )
  )
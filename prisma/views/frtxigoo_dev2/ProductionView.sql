SELECT
  `frtxigoo_dev2`.`Production`.`ProductionId` AS `ProductionId`,
  `frtxigoo_dev2`.`Production`.`ProductionCode` AS `ProductionCode`,
  concat(
    `frtxigoo_dev2`.`Show`.`ShowCode`,
    `frtxigoo_dev2`.`Production`.`ProductionCode`
  ) AS `FullProductionCode`,
  `frtxigoo_dev2`.`Production`.`ProductionSalesEmail` AS `ProductionSalesEmail`,
  `frtxigoo_dev2`.`Production`.`ProductionIsArchived` AS `ProductionIsArchived`,
  `frtxigoo_dev2`.`Production`.`ProductionIsDeleted` AS `ProductionIsDeleted`,
  `frtxigoo_dev2`.`Show`.`ShowId` AS `ShowId`,
  `frtxigoo_dev2`.`Show`.`ShowCode` AS `ShowCode`,
  `frtxigoo_dev2`.`Show`.`ShowName` AS `ShowName`,
  `frtxigoo_dev2`.`Show`.`ShowType` AS `ShowType`,
  `frtxigoo_dev2`.`Production`.`ProductionLogoFileId` AS `ProductionLogoFileId`,
(
    SELECT
      `frtxigoo_dev2`.`DateBlock`.`DateBlockStartDate`
    FROM
      `frtxigoo_dev2`.`DateBlock`
    WHERE
      `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId` = `frtxigoo_dev2`.`Production`.`ProductionId`
      AND `frtxigoo_dev2`.`DateBlock`.`DateBlockName` = 'Rehearsal'
  ) AS `RehearsalStartDate`,
(
    SELECT
      `frtxigoo_dev2`.`DateBlock`.`DateBlockEndDate`
    FROM
      `frtxigoo_dev2`.`DateBlock`
    WHERE
      `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId` = `frtxigoo_dev2`.`Production`.`ProductionId`
      AND `frtxigoo_dev2`.`DateBlock`.`DateBlockName` = 'Rehearsal'
  ) AS `RehearsalEndDate`,
(
    SELECT
      `frtxigoo_dev2`.`DateBlock`.`DateBlockStartDate`
    FROM
      `frtxigoo_dev2`.`DateBlock`
    WHERE
      `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId` = `frtxigoo_dev2`.`Production`.`ProductionId`
      AND `frtxigoo_dev2`.`DateBlock`.`DateBlockName` = 'Production'
  ) AS `ProductionStartDate`,
(
    SELECT
      `frtxigoo_dev2`.`DateBlock`.`DateBlockEndDate`
    FROM
      `frtxigoo_dev2`.`DateBlock`
    WHERE
      `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId` = `frtxigoo_dev2`.`Production`.`ProductionId`
      AND `frtxigoo_dev2`.`DateBlock`.`DateBlockName` = 'Production'
  ) AS `ProductionEndDate`
FROM
  (
    `frtxigoo_dev2`.`Production`
    JOIN `frtxigoo_dev2`.`Show` ON(
      `frtxigoo_dev2`.`Show`.`ShowId` = `frtxigoo_dev2`.`Production`.`ProductionShowId`
    )
  )
SELECT
  `frtxigoo_Sachin`.`Production`.`ProductionId` AS `ProductionId`,
  `frtxigoo_Sachin`.`Production`.`ProductionCode` AS `ProductionCode`,
  concat(
    `frtxigoo_Sachin`.`Show`.`ShowCode`,
    `frtxigoo_Sachin`.`Production`.`ProductionCode`
  ) AS `FullProductionCode`,
  `frtxigoo_Sachin`.`Production`.`ProductionSalesEmail` AS `ProductionSalesEmail`,
  `frtxigoo_Sachin`.`Production`.`ProductionIsArchived` AS `ProductionIsArchived`,
  `frtxigoo_Sachin`.`Production`.`ProductionIsDeleted` AS `ProductionIsDeleted`,
  `frtxigoo_Sachin`.`Show`.`ShowId` AS `ShowId`,
  `frtxigoo_Sachin`.`Show`.`ShowCode` AS `ShowCode`,
  `frtxigoo_Sachin`.`Show`.`ShowName` AS `ShowName`,
  `frtxigoo_Sachin`.`Show`.`ShowType` AS `ShowType`,
  `frtxigoo_Sachin`.`Production`.`ProductionLogo` AS `ProductionLogo`,
(
    SELECT
      `frtxigoo_Sachin`.`DateBlock`.`DateBlockStartDate`
    FROM
      `frtxigoo_Sachin`.`DateBlock`
    WHERE
      `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId` = `frtxigoo_Sachin`.`Production`.`ProductionId`
      AND `frtxigoo_Sachin`.`DateBlock`.`DateBlockName` = 'Rehearsal'
  ) AS `RehearsalStartDate`,
(
    SELECT
      `frtxigoo_Sachin`.`DateBlock`.`DateBlockEndDate`
    FROM
      `frtxigoo_Sachin`.`DateBlock`
    WHERE
      `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId` = `frtxigoo_Sachin`.`Production`.`ProductionId`
      AND `frtxigoo_Sachin`.`DateBlock`.`DateBlockName` = 'Rehearsal'
  ) AS `RehearsalEndDate`,
(
    SELECT
      `frtxigoo_Sachin`.`DateBlock`.`DateBlockStartDate`
    FROM
      `frtxigoo_Sachin`.`DateBlock`
    WHERE
      `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId` = `frtxigoo_Sachin`.`Production`.`ProductionId`
      AND `frtxigoo_Sachin`.`DateBlock`.`DateBlockName` = 'Production'
  ) AS `ProductionStartDate`,
(
    SELECT
      `frtxigoo_Sachin`.`DateBlock`.`DateBlockEndDate`
    FROM
      `frtxigoo_Sachin`.`DateBlock`
    WHERE
      `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId` = `frtxigoo_Sachin`.`Production`.`ProductionId`
      AND `frtxigoo_Sachin`.`DateBlock`.`DateBlockName` = 'Production'
  ) AS `ProductionEndDate`
FROM
  (
    `frtxigoo_Sachin`.`Production`
    JOIN `frtxigoo_Sachin`.`Show` ON(
      `frtxigoo_Sachin`.`Show`.`ShowId` = `frtxigoo_Sachin`.`Production`.`ProductionShowId`
    )
  )
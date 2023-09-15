SELECT
  `frtxigoo_dev`.`Tour`.`TourId` AS `TourId`,
  `frtxigoo_dev`.`Tour`.`TourCode` AS `TourCode`,
  concat(
    `frtxigoo_dev`.`Show`.`ShowCode`,
    `frtxigoo_dev`.`Tour`.`TourCode`
  ) AS `FullTourCode`,
  `frtxigoo_dev`.`Tour`.`TourSalesEmail` AS `TourSalesEmail`,
  `frtxigoo_dev`.`Tour`.`TourIsArchived` AS `TourIsArchived`,
  `frtxigoo_dev`.`Tour`.`TourIsDeleted` AS `TourIsDeleted`,
  `frtxigoo_dev`.`Show`.`ShowId` AS `ShowId`,
  `frtxigoo_dev`.`Show`.`ShowCode` AS `ShowCode`,
  `frtxigoo_dev`.`Show`.`ShowName` AS `ShowName`,
  `frtxigoo_dev`.`Show`.`ShowType` AS `ShowType`,
  `frtxigoo_dev`.`Show`.`ShowLogo` AS `ShowLogo`,
(
    SELECT
      `frtxigoo_dev`.`DateBlock`.`DateBlockStartDate`
    FROM
      `frtxigoo_dev`.`DateBlock`
    WHERE
      `frtxigoo_dev`.`DateBlock`.`DateBlockTourId` = `frtxigoo_dev`.`Tour`.`TourId`
      AND `frtxigoo_dev`.`DateBlock`.`DateBlockName` = 'Rehearsal'
  ) AS `RehearsalStartDate`,
(
    SELECT
      `frtxigoo_dev`.`DateBlock`.`DateBlockEndDate`
    FROM
      `frtxigoo_dev`.`DateBlock`
    WHERE
      `frtxigoo_dev`.`DateBlock`.`DateBlockTourId` = `frtxigoo_dev`.`Tour`.`TourId`
      AND `frtxigoo_dev`.`DateBlock`.`DateBlockName` = 'Rehearsal'
  ) AS `RehearsalEndDate`,
(
    SELECT
      `frtxigoo_dev`.`DateBlock`.`DateBlockStartDate`
    FROM
      `frtxigoo_dev`.`DateBlock`
    WHERE
      `frtxigoo_dev`.`DateBlock`.`DateBlockTourId` = `frtxigoo_dev`.`Tour`.`TourId`
      AND `frtxigoo_dev`.`DateBlock`.`DateBlockName` = 'Tour'
  ) AS `TourStartDate`,
(
    SELECT
      `frtxigoo_dev`.`DateBlock`.`DateBlockEndDate`
    FROM
      `frtxigoo_dev`.`DateBlock`
    WHERE
      `frtxigoo_dev`.`DateBlock`.`DateBlockTourId` = `frtxigoo_dev`.`Tour`.`TourId`
      AND `frtxigoo_dev`.`DateBlock`.`DateBlockName` = 'Tour'
  ) AS `TourEndDate`
FROM
  (
    `frtxigoo_dev`.`Tour`
    JOIN `frtxigoo_dev`.`Show` ON(
      `frtxigoo_dev`.`Show`.`ShowId` = `frtxigoo_dev`.`Tour`.`TourShowId`
    )
  )
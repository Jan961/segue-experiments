SELECT
  `frtxigoo_dev2`.`SalesSet`.`SetBookingId` AS `SetBookingId`,
  `frtxigoo_dev2`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  'Hold' AS `HoldOrComp`,
  `frtxigoo_dev2`.`HoldType`.`HoldTypeCode` AS `Code`,
  `frtxigoo_dev2`.`HoldType`.`HoldTypeName` AS `Name`,
  `frtxigoo_dev2`.`SetHold`.`SetHoldSeats` AS `Seats`,
  `frtxigoo_dev2`.`SetHold`.`SetHoldValue` AS `Value`
FROM
  (
    (
      `frtxigoo_dev2`.`SalesSet`
      LEFT JOIN `frtxigoo_dev2`.`SetHold` ON(
        `frtxigoo_dev2`.`SalesSet`.`SetId` = `frtxigoo_dev2`.`SetHold`.`SetHoldSetId`
      )
    )
    JOIN `frtxigoo_dev2`.`HoldType` ON(
      `frtxigoo_dev2`.`SetHold`.`SetHoldHoldTypeId` = `frtxigoo_dev2`.`HoldType`.`HoldTypeId`
    )
  )
UNION
SELECT
  `frtxigoo_dev2`.`SalesSet`.`SetBookingId` AS `SetBookingId`,
  `frtxigoo_dev2`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  'Comp' AS `HoldOrComp`,
  `frtxigoo_dev2`.`CompType`.`CompTypeCode` AS `Code`,
  `frtxigoo_dev2`.`CompType`.`CompTypeName` AS `Name`,
  `frtxigoo_dev2`.`SetComp`.`SetCompSeats` AS `Seats`,
  0 AS `Value`
FROM
  (
    (
      `frtxigoo_dev2`.`SalesSet`
      LEFT JOIN `frtxigoo_dev2`.`SetComp` ON(
        `frtxigoo_dev2`.`SalesSet`.`SetId` = `frtxigoo_dev2`.`SetComp`.`SetCompSetId`
      )
    )
    JOIN `frtxigoo_dev2`.`CompType` ON(
      `frtxigoo_dev2`.`SetComp`.`SetCompCompTypeId` = `frtxigoo_dev2`.`CompType`.`CompTypeId`
    )
  )
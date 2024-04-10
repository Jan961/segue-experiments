SELECT
  `frtxigoo_dev`.`SalesSet`.`SetBookingId` AS `SetBookingId`,
  `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  'Hold' AS `HoldOrComp`,
  `frtxigoo_dev`.`HoldType`.`HoldTypeCode` AS `Code`,
  `frtxigoo_dev`.`HoldType`.`HoldTypeName` AS `Name`,
  `frtxigoo_dev`.`SetHold`.`SetHoldSeats` AS `Seats`,
  `frtxigoo_dev`.`SetHold`.`SetHoldValue` AS `Value`
FROM
  (
    (
      `frtxigoo_dev`.`SalesSet`
      LEFT JOIN `frtxigoo_dev`.`SetHold` ON(
        `frtxigoo_dev`.`SalesSet`.`SetId` = `frtxigoo_dev`.`SetHold`.`SetHoldSetId`
      )
    )
    JOIN `frtxigoo_dev`.`HoldType` ON(
      `frtxigoo_dev`.`SetHold`.`SetHoldHoldTypeId` = `frtxigoo_dev`.`HoldType`.`HoldTypeId`
    )
  )
UNION
SELECT
  `frtxigoo_dev`.`SalesSet`.`SetBookingId` AS `SetBookingId`,
  `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  'Comp' AS `HoldOrComp`,
  `frtxigoo_dev`.`CompType`.`CompTypeCode` AS `Code`,
  `frtxigoo_dev`.`CompType`.`CompTypeName` AS `Name`,
  `frtxigoo_dev`.`SetComp`.`SetCompSeats` AS `Seats`,
  0 AS `Value`
FROM
  (
    (
      `frtxigoo_dev`.`SalesSet`
      LEFT JOIN `frtxigoo_dev`.`SetComp` ON(
        `frtxigoo_dev`.`SalesSet`.`SetId` = `frtxigoo_dev`.`SetComp`.`SetCompSetId`
      )
    )
    JOIN `frtxigoo_dev`.`CompType` ON(
      `frtxigoo_dev`.`SetComp`.`SetCompCompTypeId` = `frtxigoo_dev`.`CompType`.`CompTypeId`
    )
  )
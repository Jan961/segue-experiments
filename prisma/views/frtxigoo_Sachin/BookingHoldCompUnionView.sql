SELECT
  `frtxigoo_Sachin`.`SalesSet`.`SetBookingId` AS `SetBookingId`,
  `frtxigoo_Sachin`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  'Hold' AS `HoldOrComp`,
  `frtxigoo_Sachin`.`HoldType`.`HoldTypeCode` AS `Code`,
  `frtxigoo_Sachin`.`HoldType`.`HoldTypeName` AS `Name`,
  `frtxigoo_Sachin`.`SetHold`.`SetHoldSeats` AS `Seats`,
  `frtxigoo_Sachin`.`SetHold`.`SetHoldValue` AS `Value`
FROM
  (
    (
      `frtxigoo_Sachin`.`SalesSet`
      LEFT JOIN `frtxigoo_Sachin`.`SetHold` ON(
        `frtxigoo_Sachin`.`SalesSet`.`SetId` = `frtxigoo_Sachin`.`SetHold`.`SetHoldSetId`
      )
    )
    JOIN `frtxigoo_Sachin`.`HoldType` ON(
      `frtxigoo_Sachin`.`SetHold`.`SetHoldHoldTypeId` = `frtxigoo_Sachin`.`HoldType`.`HoldTypeId`
    )
  )
UNION
SELECT
  `frtxigoo_Sachin`.`SalesSet`.`SetBookingId` AS `SetBookingId`,
  `frtxigoo_Sachin`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  'Comp' AS `HoldOrComp`,
  `frtxigoo_Sachin`.`CompType`.`CompTypeCode` AS `Code`,
  `frtxigoo_Sachin`.`CompType`.`CompTypeName` AS `Name`,
  `frtxigoo_Sachin`.`SetComp`.`SetCompSeats` AS `Seats`,
  0 AS `Value`
FROM
  (
    (
      `frtxigoo_Sachin`.`SalesSet`
      LEFT JOIN `frtxigoo_Sachin`.`SetComp` ON(
        `frtxigoo_Sachin`.`SalesSet`.`SetId` = `frtxigoo_Sachin`.`SetComp`.`SetCompSetId`
      )
    )
    JOIN `frtxigoo_Sachin`.`CompType` ON(
      `frtxigoo_Sachin`.`SetComp`.`SetCompCompTypeId` = `frtxigoo_Sachin`.`CompType`.`CompTypeId`
    )
  )
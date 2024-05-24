SELECT
  `frtxigoo_Sachin`.`SalesSet`.`SetBookingId` AS `SetBookingId`,
  `frtxigoo_Sachin`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  `frtxigoo_Sachin`.`SalesSet`.`SetIsFinalFigures` AS `SetIsFinalFigures`,
  `frtxigoo_Sachin`.`SaleType`.`SaleTypeName` AS `SaleTypeName`,
  sum(`frtxigoo_Sachin`.`Sale`.`SaleSeats`) AS `Seats`,
  sum(`frtxigoo_Sachin`.`Sale`.`SaleValue`) AS `Value`
FROM
  (
    (
      `frtxigoo_Sachin`.`SalesSet`
      JOIN `frtxigoo_Sachin`.`Sale` ON(
        `frtxigoo_Sachin`.`SalesSet`.`SetId` = `frtxigoo_Sachin`.`Sale`.`SaleSetId`
      )
    )
    JOIN `frtxigoo_Sachin`.`SaleType` ON(
      `frtxigoo_Sachin`.`Sale`.`SaleSaleTypeId` = `frtxigoo_Sachin`.`SaleType`.`SaleTypeId`
    )
  )
GROUP BY
  `frtxigoo_Sachin`.`SalesSet`.`SetBookingId`,
  `frtxigoo_Sachin`.`SalesSet`.`SetSalesFiguresDate`,
  `frtxigoo_Sachin`.`SalesSet`.`SetIsFinalFigures`,
  `frtxigoo_Sachin`.`SaleType`.`SaleTypeName`
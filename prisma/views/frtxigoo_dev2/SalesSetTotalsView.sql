SELECT
  `frtxigoo_dev2`.`SalesSet`.`SetBookingId` AS `SetBookingId`,
  `frtxigoo_dev2`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  `frtxigoo_dev2`.`SalesSet`.`SetIsFinalFigures` AS `SetIsFinalFigures`,
  `frtxigoo_dev2`.`SaleType`.`SaleTypeName` AS `SaleTypeName`,
  sum(`frtxigoo_dev2`.`Sale`.`SaleSeats`) AS `Seats`,
  sum(`frtxigoo_dev2`.`Sale`.`SaleValue`) AS `Value`
FROM
  (
    (
      `frtxigoo_dev2`.`SalesSet`
      JOIN `frtxigoo_dev2`.`Sale` ON(
        `frtxigoo_dev2`.`SalesSet`.`SetId` = `frtxigoo_dev2`.`Sale`.`SaleSetId`
      )
    )
    JOIN `frtxigoo_dev2`.`SaleType` ON(
      `frtxigoo_dev2`.`Sale`.`SaleSaleTypeId` = `frtxigoo_dev2`.`SaleType`.`SaleTypeId`
    )
  )
GROUP BY
  `frtxigoo_dev2`.`SalesSet`.`SetBookingId`,
  `frtxigoo_dev2`.`SalesSet`.`SetSalesFiguresDate`,
  `frtxigoo_dev2`.`SalesSet`.`SetIsFinalFigures`,
  `frtxigoo_dev2`.`SaleType`.`SaleTypeName`
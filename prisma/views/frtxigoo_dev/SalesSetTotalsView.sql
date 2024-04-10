SELECT
  `frtxigoo_dev`.`SalesSet`.`SetBookingId` AS `SetBookingId`,
  `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  `frtxigoo_dev`.`SalesSet`.`SetIsFinalFigures` AS `SetIsFinalFigures`,
  `frtxigoo_dev`.`SaleType`.`SaleTypeName` AS `SaleTypeName`,
  sum(`frtxigoo_dev`.`Sale`.`SaleSeats`) AS `Seats`,
  sum(`frtxigoo_dev`.`Sale`.`SaleValue`) AS `Value`
FROM
  (
    (
      `frtxigoo_dev`.`SalesSet`
      JOIN `frtxigoo_dev`.`Sale` ON(
        `frtxigoo_dev`.`SalesSet`.`SetId` = `frtxigoo_dev`.`Sale`.`SaleSetId`
      )
    )
    JOIN `frtxigoo_dev`.`SaleType` ON(
      `frtxigoo_dev`.`Sale`.`SaleSaleTypeId` = `frtxigoo_dev`.`SaleType`.`SaleTypeId`
    )
  )
GROUP BY
  `frtxigoo_dev`.`SalesSet`.`SetBookingId`,
  `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate`,
  `frtxigoo_dev`.`SalesSet`.`SetIsFinalFigures`,
  `frtxigoo_dev`.`SaleType`.`SaleTypeName`
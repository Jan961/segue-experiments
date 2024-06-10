SELECT
  `frtxigoo_dev2`.`SalesSet`.`SetId` AS `SetId`,
  `frtxigoo_dev2`.`SalesSet`.`SetBookingId` AS `BookingId`,
  `frtxigoo_dev2`.`SalesSet`.`SetPerformanceId` AS `PerformanceId`,
  `frtxigoo_dev2`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  `frtxigoo_dev2`.`SaleType`.`SaleTypeId` AS `SaleTypeId`,
  `frtxigoo_dev2`.`SaleType`.`SaleTypeName` AS `SaleTypeName`,
  `frtxigoo_dev2`.`Sale`.`SaleId` AS `SaleId`,
  `frtxigoo_dev2`.`Sale`.`SaleSeats` AS `SaleSeats`,
  `frtxigoo_dev2`.`Sale`.`SaleValue` AS `SaleValue`
FROM
  (
    (
      `frtxigoo_dev2`.`SalesSet`
      LEFT JOIN `frtxigoo_dev2`.`Sale` ON(
        `frtxigoo_dev2`.`SalesSet`.`SetId` = `frtxigoo_dev2`.`Sale`.`SaleSetId`
      )
    )
    JOIN `frtxigoo_dev2`.`SaleType` ON(
      `frtxigoo_dev2`.`Sale`.`SaleSaleTypeId` = `frtxigoo_dev2`.`SaleType`.`SaleTypeId`
    )
  )
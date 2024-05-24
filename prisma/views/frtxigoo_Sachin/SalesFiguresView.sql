SELECT
  `frtxigoo_Sachin`.`SalesSet`.`SetId` AS `SetId`,
  `frtxigoo_Sachin`.`SalesSet`.`SetBookingId` AS `BookingId`,
  `frtxigoo_Sachin`.`SalesSet`.`SetPerformanceId` AS `PerformanceId`,
  `frtxigoo_Sachin`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  `frtxigoo_Sachin`.`SaleType`.`SaleTypeId` AS `SaleTypeId`,
  `frtxigoo_Sachin`.`SaleType`.`SaleTypeName` AS `SaleTypeName`,
  `frtxigoo_Sachin`.`Sale`.`SaleId` AS `SaleId`,
  `frtxigoo_Sachin`.`Sale`.`SaleSeats` AS `SaleSeats`,
  `frtxigoo_Sachin`.`Sale`.`SaleValue` AS `SaleValue`
FROM
  (
    (
      `frtxigoo_Sachin`.`SalesSet`
      LEFT JOIN `frtxigoo_Sachin`.`Sale` ON(
        `frtxigoo_Sachin`.`SalesSet`.`SetId` = `frtxigoo_Sachin`.`Sale`.`SaleSetId`
      )
    )
    JOIN `frtxigoo_Sachin`.`SaleType` ON(
      `frtxigoo_Sachin`.`Sale`.`SaleSaleTypeId` = `frtxigoo_Sachin`.`SaleType`.`SaleTypeId`
    )
  )
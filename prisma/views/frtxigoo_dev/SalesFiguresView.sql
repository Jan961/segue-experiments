SELECT
  `frtxigoo_dev`.`SalesSet`.`SetId` AS `SetId`,
  `frtxigoo_dev`.`SalesSet`.`SetBookingId` AS `BookingId`,
  `frtxigoo_dev`.`SalesSet`.`SetPerformanceId` AS `PerformanceId`,
  `frtxigoo_dev`.`SalesSet`.`SetSalesFiguresDate` AS `SetSalesFiguresDate`,
  `frtxigoo_dev`.`SaleType`.`SaleTypeId` AS `SaleTypeId`,
  `frtxigoo_dev`.`SaleType`.`SaleTypeName` AS `SaleTypeName`,
  `frtxigoo_dev`.`Sale`.`SaleId` AS `SaleId`,
  `frtxigoo_dev`.`Sale`.`SaleSeats` AS `SaleSeats`,
  `frtxigoo_dev`.`Sale`.`SaleValue` AS `SaleValue`
FROM
  (
    (
      `frtxigoo_dev`.`SalesSet`
      LEFT JOIN `frtxigoo_dev`.`Sale` ON(
        `frtxigoo_dev`.`SalesSet`.`SetId` = `frtxigoo_dev`.`Sale`.`SaleSetId`
      )
    )
    JOIN `frtxigoo_dev`.`SaleType` ON(
      `frtxigoo_dev`.`Sale`.`SaleSaleTypeId` = `frtxigoo_dev`.`SaleType`.`SaleTypeId`
    )
  )
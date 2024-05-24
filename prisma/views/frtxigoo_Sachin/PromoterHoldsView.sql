SELECT
  `ProductionView`.`ProductionId` AS `ProductionId`,
  `ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `frtxigoo_Sachin`.`Venue`.`VenueCode` AS `VenueCode`,
  `frtxigoo_Sachin`.`Venue`.`VenueName` AS `VenueName`,
  `frtxigoo_Sachin`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_Sachin`.`Performance`.`PerformanceDate` AS `PerformanceDate`,
  `frtxigoo_Sachin`.`Performance`.`PerformanceTime` AS `PerformanceTime`,
  `frtxigoo_Sachin`.`AvailableComp`.`AvailableCompSeats` AS `AvailableCompSeats`,
  `frtxigoo_Sachin`.`AvailableComp`.`AvailableCompNotes` AS `AvailableCompNotes`,
  `frtxigoo_Sachin`.`CompAllocation`.`CompAllocationSeats` AS `CompAllocationSeats`,
  `frtxigoo_Sachin`.`CompAllocation`.`CompAllocationTicketHolderName` AS `CompAllocationTicketHolderName`,
  `frtxigoo_Sachin`.`CompAllocation`.`CompAllocationSeatsAllocated` AS `CompAllocationSeatsAllocated`,
  `frtxigoo_Sachin`.`CompAllocation`.`CompAllocationTicketHolderEmail` AS `CompAllocationTicketHolderEmail`,
  `frtxigoo_Sachin`.`CompAllocation`.`CompAllocationComments` AS `CompAllocationComments`,
  `frtxigoo_Sachin`.`CompAllocation`.`CompAllocationRequestedBy` AS `CompAllocationRequestedBy`,
  `frtxigoo_Sachin`.`CompAllocation`.`CompAllocationArrangedBy` AS `CompAllocationArrangedBy`,
  `frtxigoo_Sachin`.`CompAllocation`.`CompAllocationVenueConfirmationNotes` AS `CompAllocationVenueConfirmationNotes`
FROM
  (
    (
      (
        (
          (
            (
              `frtxigoo_Sachin`.`ProductionView`
              JOIN `frtxigoo_Sachin`.`DateBlock` ON(
                `ProductionView`.`ProductionId` = `frtxigoo_Sachin`.`DateBlock`.`DateBlockProductionId`
              )
            )
            JOIN `frtxigoo_Sachin`.`Booking` ON(
              `frtxigoo_Sachin`.`DateBlock`.`DateBlockId` = `frtxigoo_Sachin`.`Booking`.`BookingDateBlockId`
            )
          )
          JOIN `frtxigoo_Sachin`.`Venue` ON(
            `frtxigoo_Sachin`.`Booking`.`BookingVenueId` = `frtxigoo_Sachin`.`Venue`.`VenueId`
          )
        )
        LEFT JOIN `frtxigoo_Sachin`.`Performance` ON(
          `frtxigoo_Sachin`.`Booking`.`BookingId` = `frtxigoo_Sachin`.`Performance`.`PerformanceBookingId`
        )
      )
      LEFT JOIN `frtxigoo_Sachin`.`AvailableComp` ON(
        `frtxigoo_Sachin`.`Performance`.`PerformanceId` = `frtxigoo_Sachin`.`AvailableComp`.`AvailableCompPerformanceId`
      )
    )
    LEFT JOIN `frtxigoo_Sachin`.`CompAllocation` ON(
      `frtxigoo_Sachin`.`AvailableComp`.`AvailableCompId` = `frtxigoo_Sachin`.`CompAllocation`.`CompAllocationAvailableCompId`
    )
  )
SELECT
  `frtxigoo_dev`.`TourView`.`TourId` AS `TourId`,
  `frtxigoo_dev`.`TourView`.`FullTourCode` AS `FullTourCode`,
  `frtxigoo_dev`.`Venue`.`VenueCode` AS `VenueCode`,
  `frtxigoo_dev`.`Venue`.`VenueName` AS `VenueName`,
  `frtxigoo_dev`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_dev`.`Performance`.`PerformanceDate` AS `PerformanceDate`,
  `frtxigoo_dev`.`Performance`.`PerformanceTime` AS `PerformanceTime`,
  `frtxigoo_dev`.`AvailableComp`.`AvailableCompSeats` AS `AvailableCompSeats`,
  `frtxigoo_dev`.`AvailableComp`.`AvailableCompNotes` AS `AvailableCompNotes`,
  `frtxigoo_dev`.`CompAllocation`.`CompAllocationSeats` AS `CompAllocationSeats`,
  `frtxigoo_dev`.`CompAllocation`.`CompAllocationTicketHolderName` AS `CompAllocationTicketHolderName`,
  `frtxigoo_dev`.`CompAllocation`.`CompAllocationSeatsAllocated` AS `CompAllocationSeatsAllocated`,
  `frtxigoo_dev`.`CompAllocation`.`CompAllocationTicketHolderEmail` AS `CompAllocationTicketHolderEmail`,
  `frtxigoo_dev`.`CompAllocation`.`CompAllocationComments` AS `CompAllocationComments`,
  `frtxigoo_dev`.`CompAllocation`.`CompAllocationRequestedBy` AS `CompAllocationRequestedBy`,
  `frtxigoo_dev`.`CompAllocation`.`CompAllocationArrangedBy` AS `CompAllocationArrangedBy`,
  `frtxigoo_dev`.`CompAllocation`.`CompAllocationVenueConfirmationNotes` AS `CompAllocationVenueConfirmationNotes`
FROM
  (
    (
      (
        (
          (
            (
              `frtxigoo_dev`.`TourView`
              JOIN `frtxigoo_dev`.`DateBlock` ON(
                `frtxigoo_dev`.`TourView`.`TourId` = `frtxigoo_dev`.`DateBlock`.`DateBlockTourId`
              )
            )
            JOIN `frtxigoo_dev`.`Booking` ON(
              `frtxigoo_dev`.`DateBlock`.`DateBlockId` = `frtxigoo_dev`.`Booking`.`BookingDateBlockId`
            )
          )
          JOIN `frtxigoo_dev`.`Venue` ON(
            `frtxigoo_dev`.`Booking`.`BookingVenueId` = `frtxigoo_dev`.`Venue`.`VenueId`
          )
        )
        LEFT JOIN `frtxigoo_dev`.`Performance` ON(
          `frtxigoo_dev`.`Booking`.`BookingId` = `frtxigoo_dev`.`Performance`.`PerformanceBookingId`
        )
      )
      LEFT JOIN `frtxigoo_dev`.`AvailableComp` ON(
        `frtxigoo_dev`.`Performance`.`PerformanceId` = `frtxigoo_dev`.`AvailableComp`.`AvailableCompPerformanceId`
      )
    )
    LEFT JOIN `frtxigoo_dev`.`CompAllocation` ON(
      `frtxigoo_dev`.`AvailableComp`.`AvailableCompId` = `frtxigoo_dev`.`CompAllocation`.`CompAllocationAvailableCompId`
    )
  )
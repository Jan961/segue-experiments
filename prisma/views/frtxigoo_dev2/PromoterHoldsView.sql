SELECT
  `ProductionView`.`ProductionId` AS `ProductionId`,
  `ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `frtxigoo_dev2`.`Venue`.`VenueCode` AS `VenueCode`,
  `frtxigoo_dev2`.`Venue`.`VenueName` AS `VenueName`,
  `frtxigoo_dev2`.`Booking`.`BookingId` AS `BookingId`,
  `frtxigoo_dev2`.`Performance`.`PerformanceDate` AS `PerformanceDate`,
  `frtxigoo_dev2`.`Performance`.`PerformanceTime` AS `PerformanceTime`,
  `frtxigoo_dev2`.`AvailableComp`.`AvailableCompSeats` AS `AvailableCompSeats`,
  `frtxigoo_dev2`.`AvailableComp`.`AvailableCompNotes` AS `AvailableCompNotes`,
  `frtxigoo_dev2`.`CompAllocation`.`CompAllocationSeats` AS `CompAllocationSeats`,
  `frtxigoo_dev2`.`CompAllocation`.`CompAllocationTicketHolderName` AS `CompAllocationTicketHolderName`,
  `frtxigoo_dev2`.`CompAllocation`.`CompAllocationSeatsAllocated` AS `CompAllocationSeatsAllocated`,
  `frtxigoo_dev2`.`CompAllocation`.`CompAllocationTicketHolderEmail` AS `CompAllocationTicketHolderEmail`,
  `frtxigoo_dev2`.`CompAllocation`.`CompAllocationComments` AS `CompAllocationComments`,
  `frtxigoo_dev2`.`CompAllocation`.`CompAllocationRequestedBy` AS `CompAllocationRequestedBy`,
  trim(
    concat(
      `frtxigoo_dev2`.`User`.`UserFirstName`,
      ' ',
      coalesce(`frtxigoo_dev2`.`User`.`UserLastName`, '')
    )
  ) AS `CompAllocationArrangedBy`,
  `frtxigoo_dev2`.`CompAllocation`.`CompAllocationVenueConfirmationNotes` AS `CompAllocationVenueConfirmationNotes`
FROM
  (
    (
      (
        (
          (
            (
              (
                (
                  `frtxigoo_dev2`.`ProductionView`
                  JOIN `frtxigoo_dev2`.`DateBlock` ON(
                    `ProductionView`.`ProductionId` = `frtxigoo_dev2`.`DateBlock`.`DateBlockProductionId`
                  )
                )
                JOIN `frtxigoo_dev2`.`Booking` ON(
                  `frtxigoo_dev2`.`DateBlock`.`DateBlockId` = `frtxigoo_dev2`.`Booking`.`BookingDateBlockId`
                )
              )
              JOIN `frtxigoo_dev2`.`Venue` ON(
                `frtxigoo_dev2`.`Booking`.`BookingVenueId` = `frtxigoo_dev2`.`Venue`.`VenueId`
              )
            )
            LEFT JOIN `frtxigoo_dev2`.`Performance` ON(
              `frtxigoo_dev2`.`Booking`.`BookingId` = `frtxigoo_dev2`.`Performance`.`PerformanceBookingId`
            )
          )
          LEFT JOIN `frtxigoo_dev2`.`AvailableComp` ON(
            `frtxigoo_dev2`.`Performance`.`PerformanceId` = `frtxigoo_dev2`.`AvailableComp`.`AvailableCompPerformanceId`
          )
        )
        LEFT JOIN `frtxigoo_dev2`.`CompAllocation` ON(
          `frtxigoo_dev2`.`AvailableComp`.`AvailableCompId` = `frtxigoo_dev2`.`CompAllocation`.`CompAllocationAvailableCompId`
        )
      )
      LEFT JOIN `frtxigoo_dev2`.`AccountUser` ON(
        `frtxigoo_dev2`.`CompAllocation`.`CompAllocationArrangedById` = `frtxigoo_dev2`.`AccountUser`.`AccUserId`
      )
    )
    LEFT JOIN `frtxigoo_dev2`.`User` ON(
      `frtxigoo_dev2`.`AccountUser`.`AccUserUserId` = `frtxigoo_dev2`.`User`.`UserId`
    )
  )
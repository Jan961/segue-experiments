SELECT
  `ProductionView`.`ProductionId` AS `ProductionId`,
  `ProductionView`.`FullProductionCode` AS `FullProductionCode`,
  `ProductionView`.`ShowName` AS `ShowName`,
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
  trim(
    concat(
      `frtxigoo_dev`.`User`.`UserFirstName`,
      ' ',
      coalesce(`frtxigoo_dev`.`User`.`UserLastName`, '')
    )
  ) AS `CompAllocationArrangedBy`,
  `frtxigoo_dev`.`CompAllocation`.`CompAllocationVenueConfirmationNotes` AS `CompAllocationVenueConfirmationNotes`
FROM
  (
    (
      (
        (
          (
            (
              (
                (
                  `frtxigoo_dev`.`ProductionView`
                  JOIN `frtxigoo_dev`.`DateBlock` ON(
                    `ProductionView`.`ProductionId` = `frtxigoo_dev`.`DateBlock`.`DateBlockProductionId`
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
      LEFT JOIN `frtxigoo_dev`.`AccountUser` ON(
        `frtxigoo_dev`.`CompAllocation`.`CompAllocationArrangedById` = `frtxigoo_dev`.`AccountUser`.`AccUserId`
      )
    )
    LEFT JOIN `frtxigoo_dev`.`User` ON(
      `frtxigoo_dev`.`AccountUser`.`AccUserUserId` = `frtxigoo_dev`.`User`.`UserId`
    )
  )
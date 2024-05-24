SELECT
  `frtxigoo_Sachin`.`Booking`.`BookingDateBlockId` AS `DateBlockId`,
  `frtxigoo_Sachin`.`Booking`.`BookingId` AS `EntryId`,
  `frtxigoo_Sachin`.`Performance`.`PerformanceDate` AS `EntryDate`,
  'Booking' AS `EntrySource`,
  `frtxigoo_Sachin`.`Venue`.`VenueName` AS `EntryName`,
  `frtxigoo_Sachin`.`VenueAddress`.`VenueAddressTown` AS `TownName`,
  `frtxigoo_Sachin`.`Booking`.`BookingStatusCode` AS `StatusCode`,
  `frtxigoo_Sachin`.`Booking`.`BookingPencilNum` AS `PencilNum`,
  `frtxigoo_Sachin`.`Venue`.`VenueSeats` AS `VenueSeats`,
  `BookingTravelView`.`Mileage` AS `Mileage`,
  `BookingTravelView`.`TimeMins` AS `TimeMins`
FROM
  (
    (
      (
        (
          `frtxigoo_Sachin`.`Booking`
          JOIN `frtxigoo_Sachin`.`Performance` ON(
            `frtxigoo_Sachin`.`Booking`.`BookingId` = `frtxigoo_Sachin`.`Performance`.`PerformanceBookingId`
          )
        )
        JOIN `frtxigoo_Sachin`.`Venue` ON(
          `frtxigoo_Sachin`.`Booking`.`BookingVenueId` = `frtxigoo_Sachin`.`Venue`.`VenueId`
        )
      )
      JOIN `frtxigoo_Sachin`.`VenueAddress` ON(
        `frtxigoo_Sachin`.`VenueAddress`.`VenueAddressVenueId` = `frtxigoo_Sachin`.`Venue`.`VenueId`
        AND `frtxigoo_Sachin`.`VenueAddress`.`VenueAddressTypeName` = 'Main'
      )
    )
    LEFT JOIN `frtxigoo_Sachin`.`BookingTravelView` ON(
      `frtxigoo_Sachin`.`Booking`.`BookingId` = `BookingTravelView`.`FromBookingId`
    )
  )
UNION
SELECT
  `frtxigoo_Sachin`.`Rehearsal`.`RehearsalDateBlockId` AS `DateBlockId`,
  `frtxigoo_Sachin`.`Rehearsal`.`RehearsalId` AS `EntryId`,
  `frtxigoo_Sachin`.`Rehearsal`.`RehearsalDate` AS `EntryDate`,
  'Rehearsal' AS `EntrySource`,
  'Rehearsal Day' AS `EntryName`,
  `frtxigoo_Sachin`.`Rehearsal`.`RehearsalTown` AS `TownName`,
  `frtxigoo_Sachin`.`Rehearsal`.`RehearsalStatusCode` AS `StatusCode`,
  NULL AS `PencilNum`,
  NULL AS `VenueSeats`,
  NULL AS `Mileage`,
  NULL AS `TimeMins`
FROM
  `frtxigoo_Sachin`.`Rehearsal`
UNION
SELECT
  `frtxigoo_Sachin`.`GetInFitUp`.`GetInFitUpDateBlockId` AS `DateBlockId`,
  `frtxigoo_Sachin`.`GetInFitUp`.`GetInFitUpId` AS `EntryId`,
  `frtxigoo_Sachin`.`GetInFitUp`.`GetInFitUpDate` AS `EntryDate`,
  'Get In/Fit Up' AS `EntrySource`,
  'Get In/Fit Up Day' AS `EntryName`,
  `frtxigoo_Sachin`.`Venue`.`VenueCode` AS `TownName`,
  `frtxigoo_Sachin`.`GetInFitUp`.`GetInFitUpStatusCode` AS `StatusCode`,
  NULL AS `PencilNum`,
  `frtxigoo_Sachin`.`Venue`.`VenueSeats` AS `VenueSeats`,
  NULL AS `Mileage`,
  NULL AS `TimeMins`
FROM
  (
    `frtxigoo_Sachin`.`GetInFitUp`
    LEFT JOIN `frtxigoo_Sachin`.`Venue` ON(
      `frtxigoo_Sachin`.`GetInFitUp`.`GetInFitUpVenueId` = `frtxigoo_Sachin`.`Venue`.`VenueId`
    )
  )
UNION
SELECT
  `frtxigoo_Sachin`.`Other`.`OtherDateBlockId` AS `DateBlockId`,
  `frtxigoo_Sachin`.`Other`.`OtherId` AS `EntryId`,
  `frtxigoo_Sachin`.`Other`.`OtherDate` AS `EntryDate`,
  'Other' AS `EntrySource`,
  `frtxigoo_Sachin`.`DateType`.`DateTypeName` AS `EntryName`,
  NULL AS `TownName`,
  `frtxigoo_Sachin`.`Other`.`OtherStatusCode` AS `StatusCode`,
  NULL AS `PencilNum`,
  NULL AS `VenueSeats`,
  NULL AS `Mileage`,
  NULL AS `TimeMins`
FROM
  (
    `frtxigoo_Sachin`.`Other`
    LEFT JOIN `frtxigoo_Sachin`.`DateType` ON(
      `frtxigoo_Sachin`.`Other`.`OtherDateTypeId` = `frtxigoo_Sachin`.`DateType`.`DateTypeId`
    )
  )
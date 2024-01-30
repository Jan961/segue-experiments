SELECT
  `frtxigoo_dev2`.`Booking`.`BookingDateBlockId` AS `DateBlockId`,
  'Booking' AS `EntryType`,
  `frtxigoo_dev2`.`Booking`.`BookingId` AS `EntryId`,
  `frtxigoo_dev2`.`Performance`.`PerformanceDate` AS `EntryDate`,
  `frtxigoo_dev2`.`Venue`.`VenueName` AS `EntryName`,
  `frtxigoo_dev2`.`VenueAddress`.`VenueAddressTown` AS `TownName`,
  `frtxigoo_dev2`.`Booking`.`BookingStatusCode` AS `StatusCode`,
  `frtxigoo_dev2`.`Booking`.`BookingPencilNum` AS `PencilNum`,
  `frtxigoo_dev2`.`Venue`.`VenueId` AS `VenueId`,
  `frtxigoo_dev2`.`Venue`.`VenueSeats` AS `VenueSeats`,
  `BookingTravelView`.`Mileage` AS `Mileage`,
  `BookingTravelView`.`TimeMins` AS `TimeMins`,
  NULL AS `DateTypeId`,
  'Booking' AS `DateTypeName`,
  1 AS `AffectsAvailability`,
  1 AS `SeqNo`
FROM
  (
    (
      (
        (
          `frtxigoo_dev2`.`Booking`
          JOIN `frtxigoo_dev2`.`Performance` ON(
            `frtxigoo_dev2`.`Booking`.`BookingId` = `frtxigoo_dev2`.`Performance`.`PerformanceBookingId`
          )
        )
        JOIN `frtxigoo_dev2`.`Venue` ON(
          `frtxigoo_dev2`.`Booking`.`BookingVenueId` = `frtxigoo_dev2`.`Venue`.`VenueId`
        )
      )
      JOIN `frtxigoo_dev2`.`VenueAddress` ON(
        `frtxigoo_dev2`.`VenueAddress`.`VenueAddressVenueId` = `frtxigoo_dev2`.`Venue`.`VenueId`
        AND `frtxigoo_dev2`.`VenueAddress`.`VenueAddressTypeName` = 'Main'
      )
    )
    LEFT JOIN `frtxigoo_dev2`.`BookingTravelView` ON(
      `frtxigoo_dev2`.`Booking`.`BookingId` = `BookingTravelView`.`FromBookingId`
    )
  )
UNION
SELECT
  `frtxigoo_dev2`.`Rehearsal`.`RehearsalDateBlockId` AS `DateBlockId`,
  'Rehearsal' AS `EntryType`,
  `frtxigoo_dev2`.`Rehearsal`.`RehearsalId` AS `EntryId`,
  `frtxigoo_dev2`.`Rehearsal`.`RehearsalDate` AS `EntryDate`,
  'Rehearsal Day' AS `EntryName`,
  `frtxigoo_dev2`.`Rehearsal`.`RehearsalTown` AS `TownName`,
  `frtxigoo_dev2`.`Rehearsal`.`RehearsalStatusCode` AS `StatusCode`,
  NULL AS `PencilNum`,
  NULL AS `VenueId`,
  NULL AS `VenueSeats`,
  NULL AS `Mileage`,
  NULL AS `TimeMins`,
  NULL AS `DateTypeId`,
  'Rehearsal' AS `DateTypeName`,
  1 AS `AffectsAvailability`,
  2 AS `SeqNo`
FROM
  `frtxigoo_dev2`.`Rehearsal`
UNION
SELECT
  `frtxigoo_dev2`.`GetInFitUp`.`GetInFitUpDateBlockId` AS `DateBlockId`,
  'GetInFitUp' AS `EntryType`,
  `frtxigoo_dev2`.`GetInFitUp`.`GetInFitUpId` AS `EntryId`,
  `frtxigoo_dev2`.`GetInFitUp`.`GetInFitUpDate` AS `EntryDate`,
  'Get In/Fit Up Day' AS `EntryName`,
  `frtxigoo_dev2`.`Venue`.`VenueCode` AS `TownName`,
  `frtxigoo_dev2`.`GetInFitUp`.`GetInFitUpStatusCode` AS `StatusCode`,
  NULL AS `PencilNum`,
  `frtxigoo_dev2`.`Venue`.`VenueId` AS `VenueId`,
  `frtxigoo_dev2`.`Venue`.`VenueSeats` AS `VenueSeats`,
  NULL AS `Mileage`,
  NULL AS `TimeMins`,
  NULL AS `DateTypeId`,
  'Get In / Fit Up' AS `DateTypeName`,
  1 AS `AffectsAvailability`,
  3 AS `SeqNo`
FROM
  (
    `frtxigoo_dev2`.`GetInFitUp`
    LEFT JOIN `frtxigoo_dev2`.`Venue` ON(
      `frtxigoo_dev2`.`GetInFitUp`.`GetInFitUpVenueId` = `frtxigoo_dev2`.`Venue`.`VenueId`
    )
  )
UNION
SELECT
  `frtxigoo_dev2`.`Other`.`OtherDateBlockId` AS `DateBlockId`,
  `frtxigoo_dev2`.`DateType`.`DateTypeName` AS `EntryType`,
  `frtxigoo_dev2`.`Other`.`OtherId` AS `EntryId`,
  `frtxigoo_dev2`.`Other`.`OtherDate` AS `EntryDate`,
  `frtxigoo_dev2`.`DateType`.`DateTypeName` AS `EntryName`,
  NULL AS `TownName`,
  `frtxigoo_dev2`.`Other`.`OtherStatusCode` AS `StatusCode`,
  NULL AS `PencilNum`,
  NULL AS `VenueId`,
  NULL AS `VenueSeats`,
  NULL AS `Mileage`,
  NULL AS `TimeMins`,
  `frtxigoo_dev2`.`DateType`.`DateTypeId` AS `DateTypeId`,
  `frtxigoo_dev2`.`DateType`.`DateTypeName` AS `DateTypeName`,
  `frtxigoo_dev2`.`DateType`.`DateTypeAffectsAvailability` AS `AffectsAvailability`,
  `frtxigoo_dev2`.`DateType`.`DateTypeSeqNo` + 3 AS `SeqNo`
FROM
  (
    `frtxigoo_dev2`.`Other`
    LEFT JOIN `frtxigoo_dev2`.`DateType` ON(
      `frtxigoo_dev2`.`Other`.`OtherDateTypeId` = `frtxigoo_dev2`.`DateType`.`DateTypeId`
    )
  )
SELECT
  `frtxigoo_dev`.`Booking`.`BookingDateBlockId` AS `DateBlockId`,
  'Booking' AS `EntryType`,
  `frtxigoo_dev`.`Booking`.`BookingId` AS `EntryId`,
  `frtxigoo_dev`.`Performance`.`PerformanceDate` AS `EntryDate`,
  `frtxigoo_dev`.`Venue`.`VenueName` AS `EntryName`,
  `frtxigoo_dev`.`VenueAddress`.`VenueAddressTown` AS `TownName`,
  `frtxigoo_dev`.`Booking`.`BookingStatusCode` AS `StatusCode`,
  `frtxigoo_dev`.`Booking`.`BookingPencilNum` AS `PencilNum`,
  `frtxigoo_dev`.`Venue`.`VenueId` AS `VenueId`,
  `frtxigoo_dev`.`Venue`.`VenueSeats` AS `VenueSeats`,
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
          `frtxigoo_dev`.`Booking`
          JOIN `frtxigoo_dev`.`Performance` ON(
            `frtxigoo_dev`.`Booking`.`BookingId` = `frtxigoo_dev`.`Performance`.`PerformanceBookingId`
          )
        )
        JOIN `frtxigoo_dev`.`Venue` ON(
          `frtxigoo_dev`.`Booking`.`BookingVenueId` = `frtxigoo_dev`.`Venue`.`VenueId`
        )
      )
      JOIN `frtxigoo_dev`.`VenueAddress` ON(
        `frtxigoo_dev`.`VenueAddress`.`VenueAddressVenueId` = `frtxigoo_dev`.`Venue`.`VenueId`
        AND `frtxigoo_dev`.`VenueAddress`.`VenueAddressTypeName` = 'Main'
      )
    )
    LEFT JOIN `frtxigoo_dev`.`BookingTravelView` ON(
      `frtxigoo_dev`.`Booking`.`BookingId` = `BookingTravelView`.`FromBookingId`
    )
  )
UNION
SELECT
  `frtxigoo_dev`.`Rehearsal`.`RehearsalDateBlockId` AS `DateBlockId`,
  'Rehearsal' AS `EntryType`,
  `frtxigoo_dev`.`Rehearsal`.`RehearsalId` AS `EntryId`,
  `frtxigoo_dev`.`Rehearsal`.`RehearsalDate` AS `EntryDate`,
  'Rehearsal Day' AS `EntryName`,
  `frtxigoo_dev`.`Rehearsal`.`RehearsalTown` AS `TownName`,
  `frtxigoo_dev`.`Rehearsal`.`RehearsalStatusCode` AS `StatusCode`,
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
  `frtxigoo_dev`.`Rehearsal`
UNION
SELECT
  `frtxigoo_dev`.`GetInFitUp`.`GetInFitUpDateBlockId` AS `DateBlockId`,
  'GetInFitUp' AS `EntryType`,
  `frtxigoo_dev`.`GetInFitUp`.`GetInFitUpId` AS `EntryId`,
  `frtxigoo_dev`.`GetInFitUp`.`GetInFitUpDate` AS `EntryDate`,
  'Get In/Fit Up Day' AS `EntryName`,
  `frtxigoo_dev`.`Venue`.`VenueCode` AS `TownName`,
  `frtxigoo_dev`.`GetInFitUp`.`GetInFitUpStatusCode` AS `StatusCode`,
  NULL AS `PencilNum`,
  `frtxigoo_dev`.`Venue`.`VenueId` AS `VenueId`,
  `frtxigoo_dev`.`Venue`.`VenueSeats` AS `VenueSeats`,
  NULL AS `Mileage`,
  NULL AS `TimeMins`,
  NULL AS `DateTypeId`,
  'Get In / Fit Up' AS `DateTypeName`,
  1 AS `AffectsAvailability`,
  3 AS `SeqNo`
FROM
  (
    `frtxigoo_dev`.`GetInFitUp`
    LEFT JOIN `frtxigoo_dev`.`Venue` ON(
      `frtxigoo_dev`.`GetInFitUp`.`GetInFitUpVenueId` = `frtxigoo_dev`.`Venue`.`VenueId`
    )
  )
UNION
SELECT
  `frtxigoo_dev`.`Other`.`OtherDateBlockId` AS `DateBlockId`,
  `frtxigoo_dev`.`DateType`.`DateTypeName` AS `EntryType`,
  `frtxigoo_dev`.`Other`.`OtherId` AS `EntryId`,
  `frtxigoo_dev`.`Other`.`OtherDate` AS `EntryDate`,
  `frtxigoo_dev`.`DateType`.`DateTypeName` AS `EntryName`,
  NULL AS `TownName`,
  `frtxigoo_dev`.`Other`.`OtherStatusCode` AS `StatusCode`,
  NULL AS `PencilNum`,
  NULL AS `VenueId`,
  NULL AS `VenueSeats`,
  NULL AS `Mileage`,
  NULL AS `TimeMins`,
  `frtxigoo_dev`.`DateType`.`DateTypeId` AS `DateTypeId`,
  `frtxigoo_dev`.`DateType`.`DateTypeName` AS `DateTypeName`,
  `frtxigoo_dev`.`DateType`.`DateTypeAffectsAvailability` AS `AffectsAvailability`,
  `frtxigoo_dev`.`DateType`.`DateTypeSeqNo` + 3 AS `SeqNo`
FROM
  (
    `frtxigoo_dev`.`Other`
    LEFT JOIN `frtxigoo_dev`.`DateType` ON(
      `frtxigoo_dev`.`Other`.`OtherDateTypeId` = `frtxigoo_dev`.`DateType`.`DateTypeId`
    )
  )
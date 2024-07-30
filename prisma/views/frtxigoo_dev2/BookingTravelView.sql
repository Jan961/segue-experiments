SELECT
  `BDDV`.`BookingDateBlockId` AS `BookingDateBlockId`,
  `BDDV`.`FromBookingId` AS `FromBookingId`,
  coalesce(`VV1`.`VVMileage`, `VV2`.`VVMileage`) AS `Mileage`,
  coalesce(`VV1`.`VVTimeMins`, `VV2`.`VVTimeMins`) AS `TimeMins`
FROM
  (
    (
      `frtxigoo_dev2`.`BookingDateDiffView` `BDDV`
      LEFT JOIN `frtxigoo_dev2`.`VenueVenue` `VV1` ON(
        `BDDV`.`FromVenueId` = `VV1`.`VVVenue1Id`
        AND `BDDV`.`ToVenueId` = `VV1`.`VVVenue2Id`
      )
    )
    LEFT JOIN `frtxigoo_dev2`.`VenueVenue` `VV2` ON(
      `BDDV`.`FromVenueId` = `VV2`.`VVVenue2Id`
      AND `BDDV`.`ToVenueId` = `VV2`.`VVVenue1Id`
    )
  )
WHERE
  `BDDV`.`DaysDifference` = (
    SELECT
      min(`BDDV2`.`DaysDifference`)
    FROM
      `frtxigoo_dev2`.`BookingDateDiffView` `BDDV2`
    WHERE
      `BDDV`.`FromBookingId` = `BDDV2`.`FromBookingId`
  )
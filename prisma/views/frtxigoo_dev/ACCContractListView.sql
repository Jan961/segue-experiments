SELECT
  `frtxigoo_dev`.`Person`.`PersonFirstName` AS `PersonFirstName`,
  `frtxigoo_dev`.`Person`.`PersonLastName` AS `PersonLastName`,
  `frtxigoo_dev`.`ACCContract`.`ACCCRoleName` AS `RoleName`,
  `frtxigoo_dev`.`ACCContract`.`ACCCContractStatus` AS `StatusCode`,
  `CBUser`.`UserFirstName` AS `CompletedByUserFirstName`,
  `CBUser`.`UserLastName` AS `CompletedByUserLastName`,
  `KBUser`.`UserFirstName` AS `CheckedByUserFirstName`,
  `KBUser`.`UserLastName` AS `CheckedByUserLastName`,
  `frtxigoo_dev`.`ACCContract`.`ACCCDateIssued` AS `DateIssued`,
  `frtxigoo_dev`.`ACCContract`.`ACCCDateReturned` AS `DateReturned`,
  `frtxigoo_dev`.`ACCContract`.`ACCCNotes` AS `ACCCNotes`
FROM
  (
    (
      (
        (
          (
            `frtxigoo_dev`.`ACCContract`
            JOIN `frtxigoo_dev`.`Person` ON(
              `frtxigoo_dev`.`ACCContract`.`ACCCPersonId` = `frtxigoo_dev`.`Person`.`PersonId`
            )
          )
          JOIN `frtxigoo_dev`.`AccountUser` `CBAccountUser` ON(
            `frtxigoo_dev`.`ACCContract`.`ACCCCompletedByAccUserId` = `CBAccountUser`.`AccUserId`
          )
        )
        JOIN `frtxigoo_dev`.`User` `CBUser` ON(
          `CBAccountUser`.`AccUserUserId` = `CBUser`.`UserId`
        )
      )
      LEFT JOIN `frtxigoo_dev`.`AccountUser` `KBAccountUser` ON(
        `frtxigoo_dev`.`ACCContract`.`ACCCCompletedByAccUserId` = `KBAccountUser`.`AccUserId`
      )
    )
    LEFT JOIN `frtxigoo_dev`.`User` `KBUser` ON(
      `CBAccountUser`.`AccUserUserId` = `KBUser`.`UserId`
    )
  )
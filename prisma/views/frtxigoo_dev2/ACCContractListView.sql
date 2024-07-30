SELECT
  `frtxigoo_dev2`.`Person`.`PersonFirstName` AS `PersonFirstName`,
  `frtxigoo_dev2`.`Person`.`PersonLastName` AS `PersonLastName`,
  `frtxigoo_dev2`.`ACCContract`.`ACCCRoleName` AS `RoleName`,
  `frtxigoo_dev2`.`ACCContract`.`ACCCContractStatus` AS `StatusCode`,
  `CBUser`.`UserFirstName` AS `CompletedByUserFirstName`,
  `CBUser`.`UserLastName` AS `CompletedByUserLastName`,
  `KBUser`.`UserFirstName` AS `CheckedByUserFirstName`,
  `KBUser`.`UserLastName` AS `CheckedByUserLastName`,
  `frtxigoo_dev2`.`ACCContract`.`ACCCDateIssued` AS `DateIssued`,
  `frtxigoo_dev2`.`ACCContract`.`ACCCDateReturned` AS `DateReturned`,
  `frtxigoo_dev2`.`ACCContract`.`ACCCNotes` AS `ACCCNotes`
FROM
  (
    (
      (
        (
          (
            `frtxigoo_dev2`.`ACCContract`
            JOIN `frtxigoo_dev2`.`Person` ON(
              `frtxigoo_dev2`.`ACCContract`.`ACCCPersonId` = `frtxigoo_dev2`.`Person`.`PersonId`
            )
          )
          JOIN `frtxigoo_dev2`.`AccountUser` `CBAccountUser` ON(
            `frtxigoo_dev2`.`ACCContract`.`ACCCCompletedByAccUserId` = `CBAccountUser`.`AccUserId`
          )
        )
        JOIN `frtxigoo_dev2`.`User` `CBUser` ON(
          `CBAccountUser`.`AccUserUserId` = `CBUser`.`UserId`
        )
      )
      LEFT JOIN `frtxigoo_dev2`.`AccountUser` `KBAccountUser` ON(
        `frtxigoo_dev2`.`ACCContract`.`ACCCCompletedByAccUserId` = `KBAccountUser`.`AccUserId`
      )
    )
    LEFT JOIN `frtxigoo_dev2`.`User` `KBUser` ON(
      `CBAccountUser`.`AccUserUserId` = `KBUser`.`UserId`
    )
  )
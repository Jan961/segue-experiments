SELECT
  `frtxigoo_dev2`.`AccountUser`.`AccUserAccountId` AS `AccountId`,
  `frtxigoo_dev2`.`User`.`UserId` AS `UserId`,
  `frtxigoo_dev2`.`AccountUser`.`AccUserId` AS `AccUserId`,
  `frtxigoo_dev2`.`User`.`UserFirstName` AS `UserFirstName`,
  `frtxigoo_dev2`.`User`.`UserLastName` AS `UserLastName`,
  `frtxigoo_dev2`.`User`.`UserEmail` AS `UserEmail`,
(
    SELECT
      GROUP_CONCAT(
        `frtxigoo_dev2`.`Permission`.`PermissionName` SEPARATOR ','
      )
    FROM
      (
        `frtxigoo_dev2`.`AccountUserPermission`
        JOIN `frtxigoo_dev2`.`Permission` ON(
          `frtxigoo_dev2`.`AccountUserPermission`.`UserAuthPermissionId` = `frtxigoo_dev2`.`Permission`.`PermissionId`
        )
      )
    WHERE
      `frtxigoo_dev2`.`AccountUser`.`AccUserId` = `frtxigoo_dev2`.`AccountUserPermission`.`UserAuthAccUserId`
  ) AS `AllPermissions`
FROM
  (
    `frtxigoo_dev2`.`User`
    JOIN `frtxigoo_dev2`.`AccountUser` ON(
      `frtxigoo_dev2`.`User`.`UserId` = `frtxigoo_dev2`.`AccountUser`.`AccUserUserId`
    )
  )
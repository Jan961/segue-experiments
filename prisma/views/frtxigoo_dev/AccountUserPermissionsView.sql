SELECT
  `frtxigoo_dev`.`AccountUser`.`AccUserAccountId` AS `AccountId`,
  `frtxigoo_dev`.`User`.`UserId` AS `UserId`,
  `frtxigoo_dev`.`AccountUser`.`AccUserId` AS `AccUserId`,
  `frtxigoo_dev`.`User`.`UserFirstName` AS `UserFirstName`,
  `frtxigoo_dev`.`User`.`UserLastName` AS `UserLastName`,
  `frtxigoo_dev`.`User`.`UserEmail` AS `UserEmail`,
(
    SELECT
      GROUP_CONCAT(
        `frtxigoo_dev`.`Permission`.`PermissionName` SEPARATOR ','
      )
    FROM
      (
        `frtxigoo_dev`.`AccountUserPermission`
        JOIN `frtxigoo_dev`.`Permission` ON(
          `frtxigoo_dev`.`AccountUserPermission`.`UserAuthPermissionId` = `frtxigoo_dev`.`Permission`.`PermissionId`
        )
      )
    WHERE
      `frtxigoo_dev`.`AccountUser`.`AccUserId` = `frtxigoo_dev`.`AccountUserPermission`.`UserAuthAccUserId`
  ) AS `AllPermissions`
FROM
  (
    `frtxigoo_dev`.`User`
    JOIN `frtxigoo_dev`.`AccountUser` ON(
      `frtxigoo_dev`.`User`.`UserId` = `frtxigoo_dev`.`AccountUser`.`AccUserUserId`
    )
  )
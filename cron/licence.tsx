// @ts-ignore
/**
 *
 * Each Night at Midnight the job will be run
 *
 */

export default function Licence() {
  getAllExpirng();
  getAllDue();
  getAllNearlyDue();
}

export function getAllExpirng() {
  // Get all Licencees that are due Today
  // Mark Each licence as Inactive if expiaryDate <today
  // Email Account Owner to inform them account has been suspended login to buy a new licence
}

function getAllDue() {
  // Get all licences that are expre tomorrow
  // Email to let them know the number of seats that will expire (this might be all or some)
}

function getAllNearlyDue() {
  // Get all license due in 14 days
}

import { emailService } from 'services/emailService'
import { generateGUID } from 'utils/guid'
import prisma from 'lib/prisma'
const bcrypt = require("bcryptjs");

function makePassword(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default async function handle(req, res) {
  // split out password from user details
  const user = req.body;

  // Password intewnded to secure the account untll the user changes the password
  if (user.password == undefined) {
    user.password = makePaswoerd(); //Random Generated
  }

  user.hash = encryptPassword(user.password);

  try {
    let createdUser = await createNewUser(user);
    //Create permissions for this user (this may take some time)
    await createPermission(user, createdUser.UserId);
    // Send Invite Email
      emailService.sendInvite(createdUser)
    //log action  TBF 
    // await Logging(  "Create user" + createdUser.UserId,  userService.userValue.UserID,  accountId);

    res.status(200).end();
  } catch (err) {
    res.status(403).json({ err: err });
  }
}

function encryptPassword(password) {
  let hash = bcrypt.hashSync(password, 10);

  return hash;
}
function makePaswoerd() {
  let password = makePassword(10);

  return password;
}
// TBC isActive should be changed to false and activated via emaail for new users 
async function createNewUser(user) {
  let createdUser = null;
  try {
    createdUser = await prisma.user.upsert({
      where: {
        EmailAddress: user.emailAddress,
      },
      update: {
        UserName: user.Name, // Set false allowing to create password
        AccountAdmin: user.accountOwner ?? 0,
        AccountId: parseInt(user.accountId),
        AccountOwner: user.accountOwner ?? 0,
        EmailAddress: user.emailAddress,
        Guid: generateGUID().toString(),
        Password: user.hash,
        SegueAdmin: 0,
        IsActive:true
      },
      create: {
        IsActive: true,
        UserName: user.Name, // Set false allowing to create password
        AccountAdmin: user.accountOwner ?? 0,
        AccountId: parseInt(user.accountId),
        AccountOwner: user.accountOwner ?? 0,
        EmailAddress: user.emailAddress,
        Guid: generateGUID().toString(),
        Password: user.hash,
        SegueAdmin: 0,
      },
    });
  } finally {
    //await prisma.disconnect()
  }
  // Make sure we get the new record.
  return await prisma.user.findFirst({
    where: { EmailAddress: user.emailAddress },
  }); // We will need this later to set the permissions
}

async function createPermission(inputs, userId) {
  try {
    for (let [input, value] of Object.entries(inputs)) {
      let show = null;
      let permission = null;
      if (input.startsWith("p-")) {
        //Indicates this is a permission
        input = input.replace("p-", ""); //remove the tag
        if (input.includes("_")) {
          show = parseInt(input.split("_")[0]); // input.split("_")[0] //the Show
          permission = parseInt(input.split("_")[1]); //the Permission
        } else {
          show = null;
          permission = parseInt(input);
        }
        await prisma.userPermissions.create({
          data: {
            AccountId: parseInt(inputs.accountId),
            UserID: parseInt(userId),
            Shows: show, // If _ number before is Show else null
            PermissionId: permission,
          },
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
}

import { generateGUID } from "utils/guid";
import { PrismaClient } from '@prisma/client'
import { emailService } from "services/emailService";
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient()

async function findUserByEmail(email:string) {
  return await prisma.user.findUnique({
    where: {
      EmailAddress: email,
    },
  });
}

async function updateGUIDForUser(user) {
  const newGuid = generateGUID();

  return await prisma.user.update({
    where: {
      UserId: user.UserId,
    },
    data: {
      Guid: newGuid
    },
  });
}

async function updatePasswordForUser(user, newPassword) {

   const hash =  bcrypt.hashSync(newPassword, 10)
  return await prisma.user.update({
    where: {
      UserId: user.UserId,
    },
    data: {
      Password: hash
    },
  });
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    try {
      const user = await findUserByEmail(email);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const updatedUser = await updateGUIDForUser(user);

      await emailService.sendForgottenPassword(updatedUser);

      res.status(200).json({ message: 'A password reset email has been sent, please check your email.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
  } else if (req.method === 'PUT') {
    const { email, newPassword, hashParam } = req.body;

    if (!email || !newPassword || !hashParam) {
      res.status(400).json({ message: 'Email, newPassword, and hashParam are required' });
      return;
    }

    try {
      const user = await findUserByEmail(email);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      if (user.Guid !== hashParam) {
        res.status(400).json({ message: 'Invalid GUID' });
        return;
      }

      await updatePasswordForUser(user, newPassword);

      res.status(200).json({ message: 'Password has been successfully updated.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
  } else {
    res.setHeader('Allow', 'POST, PUT');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}



import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handle(req, res) {
  try {
    let bookingId = parseInt(req.query.bookingId);
    const createResult = await prisma.contract.create({
      data: {
        BookingId: bookingId,
        BarringClauseBreaches: req.body.BarringClauseBreaches
      },
    });

    await res.json(createResult);
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Error occurred while creating the contract." });
  }
}

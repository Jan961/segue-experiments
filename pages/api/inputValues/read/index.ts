
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  
try {
  
    const customInputValues = await prisma.masterCustomInputValues.findMany({
    });

    res.json(customInputValues);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching CustomInputValues" });
  }
}
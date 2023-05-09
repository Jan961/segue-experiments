import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CustomInputValuesCreateInput {
  Name: string;
  Value: string;
  Type: string;
  OwnerId: number;
  Id?: number; // Add Id as an optional parameter
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { Name, Value, Type, OwnerId } = req.body;

      const input: CustomInputValuesCreateInput = {
        Name: Name,
        Value: Value,
        Type: Type,
        OwnerId: parseInt(OwnerId),
      };

      const createResult = await prisma.masterCustomInputValues.create({
        data: input,
      });

      res.json(createResult);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error creating CustomInputValue" });
    }
  } else if (req.method === "PUT") {
    try {
      const { Id, Name, Value, Type, OwnerId } = req.body;

      const input: CustomInputValuesCreateInput = {
        Id: parseInt(Id),
        Name: Name,
        Value: Value,
        Type: Type,
        OwnerId: parseInt(OwnerId),
      };

      const updateResult = await prisma.masterCustomInputValues.update({
        where: { Id: input.Id },
        data: {
          Name: input.Name,
          Value: input.Value,
          Type: input.Type,
          OwnerId: input.OwnerId,
        },
      });

      res.json(updateResult);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error updating CustomInputValue" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { Id } = req.body;

      if (!Id) {
        res.status(400).json({ error: "Id is required for deletion" });
        return;
      }

      const deleteResult = await prisma.masterCustomInputValues.delete({
        where: { Id: parseInt(Id) },
      });

      res.json(deleteResult);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error deleting CustomInputValue" });
    }
  } else {
    res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

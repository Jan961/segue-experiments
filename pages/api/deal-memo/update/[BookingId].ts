import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDealMemoCall, getPrice, getContactIdData, getDealMemoHoldUpdQuery } from '../utils';
import { omit } from 'radash';
import { isNullOrUndefined } from 'utils';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);

    const prisma = await getPrismaClient(req);
    const data = getContactIdData(req.body.formData);

    const updatedData = omit(data, [
      'error',
      'Id',
      'BookingId',
      'BOMVenueContactId',
      'TechVenueContactId',
      'SendTo',
      'DealMemoHold',
      'DealMemoPrice',
      'DealMemoTechProvision',
    ]);

    const existingDealMemo = await prisma.dealMemo.findFirst({
      where: {
        BookingId,
      },
    });

    let updateCreateDealMemo;
    const priceData = getPrice(data.DealMemoPrice);
    const dealMemoCallData = getDealMemoCall(updatedData.DealMemoCall);

    if (existingDealMemo) {
      // delete all existing price data for this deal memo
      await prisma.dealMemoPrice.deleteMany({
        where: {
          DMPDeMoId: existingDealMemo.Id,
        },
      });

      // delete existing dealMemoCall data for this deal memo
      await prisma.dealMemoCall.deleteMany({
        where: {
          DMCDeMoId: existingDealMemo.Id,
        },
      });

      updateCreateDealMemo = await prisma.dealMemo.update({
        where: {
          BookingId,
        },
        data: {
          ...updatedData,
          DealMemoPrice: {
            create: priceData,
          },
          DealMemoCall: {
            create: dealMemoCallData,
          },
          Booking: {
            connect: { Id: BookingId },
          },
        },
      });

      const dmHoldQueries = getDealMemoHoldUpdQuery(data.DealMemoHold);

      // perform updates on deal memo hold
      dmHoldQueries.forEach(async (updObj) => {
        await prisma.dealMemoHold.update(updObj);
      });

      // if email sales recipients are supplied
      if (!isNullOrUndefined(data.SendTo)) {
        // create sales email list
        const emailSalesRecipients = data.SendTo.filter(
          (accId) => accId !== 'select_all' && typeof accId !== 'string',
        ).map((accId) => {
          return {
            DMSRDeMoId: existingDealMemo.Id,
            DMSRAccUserId: accId,
          };
        });

        // first delete DealMemoSalesEmailRecipient records with matching deal memo id
        await prisma.dealMemoSalesEmailRecipient.deleteMany({
          where: {
            DMSRDeMoId: existingDealMemo.Id,
          },
        });

        // create records for emails attached to this deal memo now
        await prisma.dealMemoSalesEmailRecipient.createMany({
          data: emailSalesRecipients,
        });
      }

      // if tech provision data is supplied
      if (!isNullOrUndefined(data.DealMemoTechProvision)) {
        const techProvisionData = data.DealMemoTechProvision.map((techProv) => {
          return { ...techProv, DMTechDeMoId: existingDealMemo.Id };
        });

        // delete all tech provision data with matching deal memo id
        await prisma.dealMemoTechProvision.deleteMany({
          where: {
            DMTechDeMoId: existingDealMemo.Id,
          },
        });

        console.log({ data: techProvisionData, type: 'update' });

        // create record for tech provision data
        await prisma.dealMemoTechProvision.createMany({
          data: techProvisionData,
        });
      }

      // if there is no deal memo record for this booking
    } else {
      updateCreateDealMemo = await prisma.dealMemo.create({
        data: {
          ...updatedData,
          DealMemoPrice: {
            create: priceData,
          },
          DealMemoTechProvision: {
            create: data.DealMemoTechProvision,
          },
          DealMemoCall: {
            create: dealMemoCallData,
          },
          DealMemoHold: {
            create: data.DealMemoHold,
          },
          Booking: {
            connect: { Id: BookingId },
          },
        },
      });

      if (!isNullOrUndefined(data.SendTo)) {
        const emailSalesRecipients = data.SendTo.filter(
          (accId) => accId !== 'select_all' && typeof accId !== 'string',
        ).map((accId) => {
          return {
            DMSRDeMoId: updateCreateDealMemo.Id,
            DMSRAccUserId: accId,
          };
        });

        // create sales email link list
        await prisma.dealMemoSalesEmailRecipient.createMany({
          data: emailSalesRecipients,
        });
      }
    }

    res.status(200).json(updateCreateDealMemo);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while updating DealMemo' });
  }
}

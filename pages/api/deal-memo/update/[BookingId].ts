import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { getDealMemoCall, getPrice, getTechProvision, getContactIdData, getDealMemoHoldUpdQuery } from '../utils';
import { omit } from 'radash';
import { isUndefined } from 'utils';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();
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
    ]);

    const existingDealMemo = await prisma.dealMemo.findFirst({
      where: {
        BookingId,
      },
    });

    let updateCreateDealMemo;
    const priceData = getPrice(data.DealMemoPrice);
    const techProvisionData = getTechProvision(updatedData.DealMemoTechProvision);
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
          DealMemoTechProvision: {
            updateMany: techProvisionData[0],
            create: techProvisionData[1],
          },
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

      if (!isUndefined(data.SendTo)) {
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
        await prisma.DealMemoSalesEmailRecipient.deleteMany({
          where: {
            DMSRDeMoId: existingDealMemo.Id,
          },
        });

        // create records for emails attached to this deal memo now
        await prisma.DealMemoSalesEmailRecipient.createMany({
          data: emailSalesRecipients,
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

      if (!isUndefined(data.SendTo)) {
        const emailSalesRecipients = data.SendTo.filter(
          (accId) => accId !== 'select_all' && typeof accId !== 'string',
        ).map((accId) => {
          return {
            DMSRDeMoId: existingDealMemo.Id,
            DMSRAccUserId: accId,
          };
        });
        // create sales email link list
        await prisma.DealMemoSalesEmailRecipient.createMany(emailSalesRecipients);
      }
    }

    res.status(200).json(updateCreateDealMemo);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while updating DealMemo' });
  }
}

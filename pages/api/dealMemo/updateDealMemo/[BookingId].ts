import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { getDealMemoCall, getPrice, getTechProvision, getContactIdData, getDealMemoHold } from '../utils';
import { omit } from 'radash';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();
    const data = getContactIdData(req.body.formData);
    const demoIdData = data.Id;
    const updatedDate = omit(data, [
      'error',
      'Id',
      'BookingId',
      'AccContId',
      'BOMVenueContactId',
      'TechVenueContactId',
    ]);
    const existingDealMemo = await prisma.dealMemo.findFirst({
      where: {
        BookingId,
      },
    });

    let updateCreateDealMemo;
    const priceData = getPrice(updatedDate.DealMemoPrice);
    const techProvisionData = getTechProvision(updatedDate.DealMemoTechProvision);

    const dealMemoCallData = getDealMemoCall(updatedDate.DealMemoCall);
    const dealMemoHoldData = getDealMemoHold(updatedDate.DealMemoHold, demoIdData);
    if (existingDealMemo) {
      updateCreateDealMemo = await prisma.dealMemo.update({
        where: {
          BookingId,
        },
        data: {
          ...updatedDate,
          DealMemoPrice: {
            updateMany: priceData[0],
            create: priceData[1],
          },
          DealMemoTechProvision: {
            updateMany: techProvisionData[0],
            create: techProvisionData[1],
          },
          DealMemoCall: {
            updateMany: dealMemoCallData[0],
            create: dealMemoCallData[1],
          },
          DealMemoHold: {
            updateMany: dealMemoHoldData[0],
            create: dealMemoHoldData[1],
          },
          Booking: {
            connect: { Id: BookingId },
          },
        },
      });
    } else {
      updateCreateDealMemo = await prisma.dealMemo.create({
        data: {
          ...updatedDate,
          DealMemoPrice: {
            create: priceData[1],
          },
          DealMemoTechProvision: {
            create: data.DealMemoTechProvision,
          },
          DealMemoCall: {
            create: data.DealMemoCall,
          },
          DealMemoHold: {
            create: dealMemoHoldData[1],
          },
          Booking: {
            connect: { Id: BookingId },
          },
        },
      });
    }
    await res.json(updateCreateDealMemo);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while updating DealMemo' });
  }
}

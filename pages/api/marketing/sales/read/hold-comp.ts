// import client from 'lib/prisma';
// import master from 'lib/prisma_master';
// import { addDurationToDate } from 'services/dateService';
// import { getEmailFromReq, checkAccess, getAccountIdFromReq } from 'services/userService';

// interface Hold {
//   name: string;
//   seats: number;
//   value: number;
//   id: number;
// }

// interface Comp {
//   name: string;
//   seats: number;
//   id: number;
// }

// type Res = {
//   holds: Array<Hold>;
//   comps: Array<Comp>;
//   setId: number;
// };

// const getCompHoldData = async (salesDate, bookingId) => {

//   const holdTypes = await client.holdType.findMany({
//     orderBy: {
//       HoldTypeSeqNo: 'asc',
//     },
//   });

//   const compTypes = await client.compType.findMany({
//     orderBy: {
//       CompTypeSeqNo: 'asc',
//     },
//   });

//   const holdCompData = await client.salesSet.findMany({
//     where: {
//       SetBookingId: bookingId,
//       // SetHold or SetHold are not null
//       OR: [
//         {
//           SetHold: {
//             some: {},
//           },
//         },
//         {
//           SetComp: {
//             some: {},
//           },
//         },
//       ],
//     },
//     // get the last sales entry from the user
//     orderBy: {
//       SetSalesFiguresDate: 'desc',
//     },
//     // select both SetComp and SetHold data as data should be stored against the same SetId
//     select: {
//       SetSalesFiguresDate: true,
//       SetId: true,
//       SetHold: {
//         select: {
//           SetHoldSeats: true,
//           SetHoldValue: true,
//           SetHoldId: true,
//           SetHoldSetId: true,
//           HoldType: {
//             select: {
//               HoldTypeId: true,
//               HoldTypeName: true,
//             },
//           },
//         },
//       },
//       SetComp: {
//         select: {
//           SetCompSeats: true,
//           SetCompId: true,
//           CompType: {
//             select: {
//               CompTypeId: true,
//               CompTypeCode: true,
//               CompTypeName: true,
//             },
//           },
//         },
//       },
//     },
//     take: 1
//   });

//   console.log(JSON.stringify(holdCompData))

//   const holdResult = holdTypes.map((hold) => {
//     const holdRecIndex = holdCompData[0].SetHold.findIndex((rec) => rec.id === hold.HoldTypeId);
//     if (holdRecIndex === -1) {
//       return {
//         name: hold.HoldTypeName,
//         seats: 0,
//         value: 0,
//         id: hold.HoldTypeId,
//       };
//     } else {
//       return {
//         ...holdCompData[0].SetHold[holdRecIndex],
//       };
//     }
//   });

//   const compResult = compTypes.map((comp) => {
//     const compRecIndex = holdCompData[0].SetComp.findIndex((rec) => rec.id === comp.CompTypeId);
//     if (compRecIndex === -1) {
//       return {
//         name: comp.CompTypeName,
//         seats: 0,
//         id: comp.CompTypeId,
//       };
//     } else {
//       return {
//         ...holdCompData[0].SetComp[compRecIndex],
//       };
//     }
//   });

//   return {
//     holds: holdResult,
//     comps: compResult,
//     setId: holdCompData.length > 0 ? holdCompData[0].SetId : -1
//   };
// };

// const copyData = async (data, datesTried, bookingId) => {
//   const promises = datesTried.map(async (dtIn) => {
//     // create a SalesSet and get a setID for this week that has no data
//     const setResult = await client.SalesSet.create({
//       data: {
//         SetBookingId: parseInt(bookingId),
//         SetPerformanceId: null,
//         SetSalesFiguresDate: dtIn,
//         SetBrochureReleased: false,
//         SetSingleSeats: false,
//         SetNotOnSale: false,
//         SetIsFinalFigures: false,
//         SetIsCopy: false,
//       },
//     });

//     const dbUpdates = [];

//     // hold data first
//     data.holds.forEach((holdRec) => {
//       if (holdRec.seats > 0 || holdRec.value > 0) {
//         dbUpdates.push(
//           client.setHold.create({
//             data: {
//               SetHoldSetId: setResult.SetId,
//               SetHoldHoldTypeId: holdRec.id,
//               SetHoldSeats: parseInt(holdRec.seats),
//               SetHoldValue: parseFloat(holdRec.value),
//             },
//           }),
//         );
//       }
//     });

//     // comp data
//     data.comps.forEach((compRec) => {
//       if (compRec.seats > 0) {
//         dbUpdates.push(
//           client.setComp.create({
//             data: {
//               SetCompSetId: setResult.SetId,
//               SetCompCompTypeId: compRec.id,
//               SetCompSeats: parseInt(compRec.seats),
//             },
//           }),
//         );
//       }
//     });

//     await client.$transaction(dbUpdates);

//     // Return the setId for each created SalesSet
//     return setResult.SetId;
//   });

//   // Wait for all promises to complete and return the last setId
//   const results = await Promise.all(promises);
//   return results[results.length - 1];
// };

// const getDealMemoHoldsByBookingId = async (bookingId: number) => {
//   const booking = await client.booking.findUnique({
//     where: {
//       Id: bookingId,
//     },
//     include: {
//       DealMemo: true,
//     },
//   });

//   // if there is no dealMemo record against the booking return an empty array
//   if (booking?.DealMemo === null) {
//     return [];
//   }

//   const dealMemoHolds = await client.dealMemoHold.findMany({
//     where: {
//       DMHoldDeMoId: booking?.DealMemo.Id,
//     },
//     include: {
//       HoldType: {
//         select: {
//           HoldTypeId: true,
//           HoldTypeName: true,
//         },
//       },
//     },
//   });

//   return dealMemoHolds.map((hold) => {
//     return {
//       name: hold.HoldType.HoldTypeName,
//       seats: hold.DMHoldSeats,
//       value: hold.DMHoldValue,
//       id: hold.HoldType.HoldTypeId,
//     };
//   });
// };

// export default async function handle(req, res) {
//   try {
//     const bookingId = parseInt(req.body.bookingId);
//     const salesDate = new Date(req.body.salesDate);
//     const accountId = await getAccountIdFromReq(req);
//     const ProductionId = req.body.productionId;

//     const email = await getEmailFromReq(req);
//     const access = await checkAccess(email);
//     if (!access) return res.status(401).end();

//     let result: Res = null;

//     const { SalesFrequency } = await client.production.findUnique({
//       where: {
//         Id: ProductionId,
//       },
//       select: {
//         SalesFrequency: true,
//       },
//     });

//     // get first week of sales - this will depend of the production week start
//     // this will determine how far back the process looks for hold/comp figure and define the stopping point
//     const prodCo = await master.productionCompany.findMany({
//       where: {
//         ProdCoAccountId: accountId,
//       },
//       select: {
//         ProdCoSaleStartWeek: true,
//       },
//     });

//     const dateBlock = await client.dateBlock.findMany({
//       where: {
//         ProductionId,
//         IsPrimary: true,
//       },
//     });

//     const salesStartWeek = prodCo[0].ProdCoSaleStartWeek;
//     const numWeeks = salesStartWeek.ProdCoSaleStartWeek > 0 ? salesStartWeek : salesStartWeek * -1;
//     const startDate = addDurationToDate(dateBlock[0].StartDate, numWeeks * 7, false);
//    // const firstSalesDate = SalesFrequency === 'W' ? getMonday(startDate) : startDate;

//     // loop through previous sales until we find a set that exists
//     let currentDate = salesDate;
//     //const triedDates = [];

//     result = await getCompHoldData(currentDate, bookingId);
//     console.log(result)
//     res.status(200).json(result);

//     // do {
//     //   result = await getCompHoldData(currentDate, bookingId);

//     //   if (!isDataAvailable(result)) {
//     //     triedDates.push(currentDate);
//     //     currentDate = addDurationToDate(currentDate, SalesFrequency === 'W' ? 7 : 1, false);

//     //     // if the first sales date has been reached, there is no comps/holds to recover
//     //     // if this is the case, return blank values
//     //     if (firstSalesDate.getTime() === startOfDay(currentDate).getTime()) {
//     //       // as there is no hold/comp data found - the hold data is copied from the deal memo
//     //       const dealMemoHolds = await getDealMemoHoldsByBookingId(bookingId);

//     //       // if dealMemoHolds has a length of 0, there is no dealMemo stored against the booking.
//     //       // only actions if dealMemoHolds is greater than 0
//     //       if (dealMemoHolds.length > 0) {
//     //         result = { ...result, holds: dealMemoHolds };
//     //       }

//     //       res.status(200).json(result);
//     //     }
//     //   }
//     // } while (!isDataAvailable(result));

//     // // if tried dates is greater than 0, we need to copy the new found data into the weeks that were missed
//     // if (triedDates.length > 0) {
//     //   const latestSetId = await copyData(result, triedDates, bookingId);
//     //   result = { ...result, setId: latestSetId };
//     // }

//     // res.status(200).json(result);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ err: 'Error occurred getting hold and comp data.' });
//   }
// }

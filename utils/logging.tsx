// export async function Logging(action, user_id, account_id) {
//   // todo impliment this
//   /**
//     try {
//         const logEntry = await prisma.action_log.create({
//             data: {
//                 action: action,
//                 user_id: user_id, // Set to 0 for testing
//                 account_id: account_id //Set to 0 for testing ,
//             },
//         })
//     } finally {
//         await prisma.$disconnect();
//     }
//  */
// }

declare global {
  interface Window {
    debugMode?: boolean;
  }
}

export const debug = (...logArgs: any) => {
  if (Object.hasOwn(window, 'debugMode') && window?.debugMode) {
    console.debug('Debug:', ...logArgs);
  }
};

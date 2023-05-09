/**
 *
 * Action logging
 *
 * - user who is actioning the change
 * - change | what part of the system a change is being made in
 * - account | what account they are in
 * - datetime ¬ added on save
 *
 */

import { PrismaClient } from '@prisma/client';

export async function Logging(action, user_id, account_id) {
    const prisma = new PrismaClient();

    //todo impliment this
/**
    try {
        const logEntry = await prisma.action_log.create({
            data: {
                action: action,
                user_id: user_id, // Set to 0 for testing
                account_id: account_id //Set to 0 for testing ,
            },
        })
    } finally {
        await prisma.$disconnect();
    }
 */
}
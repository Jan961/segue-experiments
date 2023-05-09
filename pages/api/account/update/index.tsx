import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {Tour} from "../../../../interfaces";
import { parseISO, format } from 'date-fns';
import accountId from "../../../accounts/update-details/[account-id]";

const prisma = new PrismaClient()


export default  async function handle(req, res) {

    console.log(JSON.stringify(req.body))

    try {
        let vat_reg = false
        if (req.body.vatRegistered == 'true') {
            vat_reg = true
        }

        const updateAccount = await prisma.account.update({
            where: {
                AccountId: parseInt(req.body.accountId)
            },
            data: {
                BusinessName: req.body.businessName,
                TelephoneNumber: req.body.telephone,
                EmailAddress: req.body.emailAddress,
                AddressLine1: req.body.addressLine1,
                AddressLine2: req.body.addressLine2,
                AddressLine3: req.body.addressLine3,
                County: req.body.county,
                Country: null,
                Postcode: req.body.postcode,
                VatRegistered: vat_reg,
                BusinessType: parseInt(req.body.businessType),
            },


        })

        console.log(updateAccount)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(updateAccount))
        //res.json(result)

    } catch (err) {
        console.log(err);
        res.status(403).json({err: "Error occurred while generating search results."});
    }

}



import fetch from 'node-fetch'
import prisma from 'lib/prisma'

async function callCreateUserApi(userData) {
  const baseUrl = process.env.BASE_URL;
  //console.log("the base url:", baseUrl);
  //console.log("the user data:", userData)
  try {
    const response = await fetch(`${baseUrl}/api/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from create user API:', errorText);
      throw new Error(`Error creating user: ${errorText}`);
    }

    return await response
  } catch (error) {
    console.error('Error calling create user API:', error);
    throw error;
  }
}

export default async function handle(req, res) {


    try {
        let vat_reg = false
        if(req.body.vatRegistered.toLowerCase() == 'true'){
            vat_reg = true
        }

        const result = await prisma.account.create({
            data: {
                BusinessName: req.body.businessName,
                TelephoneNumber: req.body.telephone,
                EmailAddress: req.body.emailAddress,
                CompanyWebsite: req.body.companyWebsite,
                AddressLine1: req.body.addressLine1,
                AddressLine2: req.body.addressLine2,
                AddressLine3: req.body.addressLine3,
                County: req.body.county,
                Country: null, //req.body.user.country,
                Currency:"GBP",
                Postcode: req.body.postcode,
                VatRegistered: vat_reg,
                BusinessType:  parseInt(req.body.businessType),
           },
        })
          

     const newUserResponse =   await callCreateUserApi({
            password:req.body.password,
            emailAddress:req.body.emailAddress,
            accountId:result.AccountId,
            Name:req.body.name,
            accountOwner:1
        })
        if ( newUserResponse.status !== 200){
          throw new Error("error creating new user account")
        }
        
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
       // console.log("create new account result: ", result)
        res.end(JSON.stringify( result ))
        //res.json(result)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while creating a new account." });
    }

}



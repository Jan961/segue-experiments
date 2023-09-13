import * as React from "react";
import AccountDetails from "./accountDetails";
import AccountPaymentDetails from "./paymentDetails";
import {router} from "next/client";
import {forceNavigate} from "../../../utils/forceNavigate";



export default function AccountRegistration() {

//https://jasonwatmore.com/post/2021/08/19/next-js-11-user-registration-and-login-tutorial-with-example-app

    function handleOnSubmit() {
            //Check Account can be created no conflicts with others

            // Register Account

            // Register User As Account Owner

            // Log User in and Send to Platform Home

            //forceNavigate("\/")
        return null
    }


    // @ts-ignore
    return (

        <>

            <form onSubmit={handleOnSubmit()}>

                <AccountPaymentDetails></AccountPaymentDetails>

                <div>
                    <button type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
<span className="absolute inset-y-0 left-0 flex items-center pl-3">


            </span>
                        Save
                    </button>
                </div>
            </form>
        </>
    )
}
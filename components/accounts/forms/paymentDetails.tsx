
const Account = {

    email: 'me@myemail.com',
    name: 'R C Kelly',
    telephone: '',
    businessName: 'R C Kelly',
    webURl: "https://www.rckelly.local",
    addressLine1: "123 Fake Street",
    addressLine2: "123 Fake Street",
    addressLine3: "123 Fake Street",
    country: "123 Fake Street",
    postcode: "123 Fake Street",
    isVatRegistered: true,
    businessType: "123 Fake Street",
    numberOfUsers: "6"
}
export default function AccountPaymentDetails() {
    return (

        <>
            <div>
                <fieldset>
                    <legend className="block text-centre text-sm font-medium text-gray-700 ">Payment Details</legend>
                    <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
                        <div>
                            <label htmlFor="card-number" className="sr-only">Long cart #</label>
                            <input type="text" name="card-number" id="card-number"
                                   className="block w-full min-w-0 flex-1 rounded-none rounded-t-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                   placeholder="Card number"/>
                        </div>
                        <div className="flex -space-x-px">
                            <div className="w-1/2 min-w-0 flex-1">
                                <label htmlFor="card-expiration-date" className="sr-only">Expiration date</label>
                                <input type="text" name="card-expiration-date" id="card-expiration-date"
                                       className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                       placeholder="Valid MM / YY"/>
                            </div>
                            <div className="min-w-0 flex-1">
                                <label htmlFor="card-cvc" className="sr-only">CVC</label>
                                <input type="text" name="card-cvc" id="card-cvc"
                                       className="block w-full min-w-0 flex-1 rounded-none  border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                       placeholder="CVC"/>
                            </div>
                            <div className="min-w-0 flex-1">
                                <label htmlFor="card-postcode" className="sr-only">postcode</label>
                                <input type="text" name="card-postcode" id="card-postcode"
                                       className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                       placeholder="Postcode"/>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div>
                <fieldset>
                    <label htmlFor="terms-agree" className="sr-only">Agree with Segue terms and conditions</label>
                    <input type="checkbox" id="terms-agree" name="terms-agree"/><span className="text-sm text-gray-500">I agree to the <a href="#">terms and conditions</a> and <a href="#">privacy policy</a></span>
                </fieldset>
            </div>
            <div>

            </div>

        </>
    )
}

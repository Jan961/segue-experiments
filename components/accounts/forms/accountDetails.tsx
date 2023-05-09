import * as React from "react";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";

import {userService} from "../../../services/user.service";
import {alertService} from "../../../services/alert.service";
import {emailService} from "../../../services/emailService";
import Link from "next/link";
import axios from "axios";
import {useEffect, useState} from "react";
import {da} from "date-fns/locale";
import {Alert} from "../../alert";
import {reportsService} from "../../../services/reportsService";
import {loggingService} from "../../../services/loggingService";



export default function AccountDetails(accountId) {
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)

    let errors: {}

    const router = useRouter();

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });


    const searchEndpoint = (query) => `/api/account/read/${query}`

    const [inputs, setInputs] = useState({
        emailAddress: "",
        telephone: "",
        businessName: '',
        address_line_1: "",
        address_line_2: "",
        address_line_3: "",
        company_website:"",
        vatRegistered: "",
        businessType: "",
        county: "",
        postcode: "",
        accountId: accountId,

    });


    useEffect(() => {
        setLoading(true)
        fetch(searchEndpoint(30))
            .then((res) => res.json())
            .then((data) => {
                setInputs({
                    address_line_1: data.searchResults.addressLine1,
                    address_line_2: data.searchResults.addressLine2,
                    address_line_3: data.searchResults.addressLine3,
                    businessName: data.searchResults.businessName,
                    businessType: data.searchResults.businessType,
                    company_website: data.searchResults.companyWebsite,
                    county: data.searchResults.addressLine1,
                    postcode: data.searchResults.postcode,
                    telephone: data.searchResults.addressLine1,
                    vatRegistered: data.searchResults.vatRegistered,
                    emailAddress: data.searchResults.emailAddress,
                    accountId: accountId,
                })
                setData(data)
                setLoading(false)
            })
    }, [])


    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>




    const handleServerResponse = (ok, msg) => {
        if (ok) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg },
            });
            setInputs({
                accountId: accountId,
                emailAddress: inputs.emailAddress,
                telephone: inputs.telephone,
                businessName: inputs.businessName,
                address_line_1: inputs.address_line_1,
                address_line_2: inputs.address_line_2,
                address_line_3: inputs.address_line_3,
                company_website: inputs.company_website,
                vatRegistered:  inputs.vatRegistered,
                businessType: inputs.businessType,
                county: inputs.county,
                postcode: inputs.postcode});
        } else {
            // @ts-ignore
            setStatus(false);
        }
    };
    const handleOnChange = async (e) => {
        e.persist();

        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));

        setStatus({
            submitted: false,
            submitting: false,
            info: {error: false, msg: null},
        });
    };
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setStatus((prevStatus) => ({...prevStatus, submitting: true}));

        axios({
            method: 'POST',
            url: '/api/account/update/',
            data: inputs,
        })
            .then((response) => {
                loggingService.logAction("Update Account", "update Account: " + accountId)
                handleServerResponse(
                    true,
                    'Update successful and now live');
                alertService.success('Update successful and now live', {keepAfterRouteChange: true})
            })
            .catch((error) => {
                handleServerResponse(false, error.response.data.error);
                alertService.error('Error Updating', null)
            });
    };
    return (

        <>
            <Alert></Alert>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>

                        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Update Account Details</h1>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Update your company details below

                        </p>
                    </div>
                    <form onSubmit={handleOnSubmit}>
                        <div>
                            <fieldset id="Account">
                                <div className="grid grid-cols-2 gap-2">

                                    <div>
                                        <label htmlFor="emailAddress" className="">Email Address</label>
                                        <input id="emailAddress"
                                               type="text"
                                               name="emailAddress"
                                               onChange={handleOnChange}
                                               required
                                               value={inputs.emailAddress}
                                               className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                               placeholder="XYZABC"
                                               contentEditable={true}
                                        />




                                    </div>

                                    <div>
                                        <label htmlFor="telephone" className="">Telephone Number</label>
                                        <input id="telephone"
                                               type="text"
                                               name="telephone"
                                               onChange={handleOnChange}
                                               required
                                               value={inputs.telephone}
                                               className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                               placeholder="0141 000 0000"
                                               contentEditable={true}
                                        />

                                    </div>
                                    <div>
                                        <label htmlFor="businessName" className="">Business Name</label>
                                        <input id="businessName"
                                               type="text"
                                               name="businessName"
                                               onChange={handleOnChange}
                                               required
                                               value={inputs.businessName}
                                               className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                               placeholder="0141 000 0000"
                                               contentEditable={true}
                                        />

                                    </div>
                                    <div>
                                        <label htmlFor="address_line_1" className="">Address Line 1</label>
                                        <input id="address_line_1"
                                               type="text"
                                               name="address_line_1"
                                               onChange={handleOnChange}
                                               required
                                               value={inputs.address_line_1}
                                               className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                               placeholder="0141 000 0000"
                                               contentEditable={true}
                                        />

                                    </div>
                                    <div>

                                        <label htmlFor="company_website" className="">Company Website</label>
                                        <div className="mt-1 flex rounded-md shadow-sm">

                                            <input id="company_website"
                                                   type="text"
                                                   name="company_website"
                                                   onChange={handleOnChange}
                                                   required
                                                   value={inputs.company_website}
                                                   className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                   placeholder="0141 000 0000"
                                                   contentEditable={true}
                                            />

                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="address_line_2" className="">Address Line 2</label>
                                        <input id="address_line_2"
                                               type="text"
                                               name="address_line_2"
                                               onChange={handleOnChange}
                                               required
                                               value={inputs.address_line_2}
                                               className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                               placeholder="0141 000 0000"
                                               contentEditable={true}
                                        />

                                    </div>
                                    <div>
                                        <label htmlFor="vatRegistered" className="">VAT Registered </label>

                                        <input id="vatRegistered"
                                               type="checkbox"
                                               name="vatRegistered"
                                               onChange={handleOnChange}

                                               value={inputs.vatRegistered}
                                               className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                               placeholder="0141 000 0000"
                                               contentEditable={true}
                                        />

                                        <span className="text-sm text-gray-500"> </span>
                                    </div>
                                    <div>
                                        <label htmlFor="address_line_3" className="">Address Line 3</label>
                                        <input id="address_line_3"
                                               type="text"
                                               name="address_line_3"
                                               onChange={handleOnChange}
                                               required
                                               value={inputs.address_line_3}
                                               className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                               placeholder="0141 000 0000"
                                               contentEditable={true}
                                        />

                                    </div>
                                    <div>
                                        <label htmlFor="businessType" className="">Business type</label>
                                        <select
                                            className="relative block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            defaultValue={"Select one"}
                                            value={inputs.businessType}
                                            onChange={handleOnChange}
                                            id="businessType"
                                        >
                                            <option key={0} value={0}  disabled>Select one</option>
                                            <option key={1} value={1}>Producer</option>
                                            <option key={2} value={2}>Booker</option>
                                            <option key={3} value={3}>Venue</option>
                                            <option key={4} value={4}>Marketing Company</option>
                                            <option key={5} value={4}>Press and PR Company</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="county" className="">County</label>
                                        <input id="county"
                                               type="text"
                                               name="county"
                                               onChange={handleOnChange}
                                               required
                                               value={inputs.county}
                                               className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                               placeholder="0141 000 0000"
                                               contentEditable={true}
                                        />

                                    </div>
                                    <div>

                                    </div>

                                    <div>
                                        <label htmlFor="postcode" className="">Postcode</label>
                                        <input id="postcode"
                                               type="text"
                                               name="postcode"
                                               onChange={handleOnChange}
                                               required
                                               value={inputs.postcode}
                                               className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                               placeholder="G12 3AB"
                                               contentEditable={true}
                                        />

                                    </div>

                                    <div>

                                    </div>

                                </div>
                            </fieldset>
                        </div>

                        <div>
                            <fieldset>
                                <div>

                                    <button> Update Account</button>
                                </div>
                            </fieldset>



                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}
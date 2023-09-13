import * as React from "react";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";

import {userService} from "../../services/user.service";
import {alertService} from "../../services/alert.service";
import {emailService} from "../../services/emailService";
import Link from "next/link";
import axios from "axios";
import {useEffect, useState} from "react";
import {da} from "date-fns/locale";
import {Alert} from "../alert";
import user from "../account/manage-users/user";



export default function UpdateProfile(accountId) {
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)

    let errors: {}

    const router = useRouter();

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });
    let user = userService.userValue

    const searchEndpoint = (query) => `/api/users/read/${query}`


    const [inputs, setInputs] = useState({
        emailAddress: "",
        UserName: "",
        password: '',
        passwordConfirm: "",
        UserId: user.id


    });



    useEffect(() => {
        setLoading(true)
        fetch(searchEndpoint(user.id))
            .then((res) => res.json())
            .then((data) => {

                setInputs({
                    emailAddress:user.email,
                    password: "",
                    passwordConfirm: "",
                    UserName: user.name,
                    UserId: user.id
                })

                setData(data)
                setLoading(false)
            })
    }, [])


    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>


    let changePassword = false;


    const handleServerResponse = (ok, msg) => {
        if (ok) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg },
            });
            setInputs({
                password: inputs.password,
                passwordConfirm: inputs.passwordConfirm,
                UserName: inputs.UserName,
                emailAddress: inputs.emailAddress,
                UserId: user.id
            })

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


        //validate in
        if (inputs.password === inputs.passwordConfirm) {
            if (inputs.password !== null || inputs.password !== undefined) {

            }

            axios({
                method: 'POST',
                url: '/api/users/update/',
                data: inputs,
            })
                .then((response) => {
                    handleServerResponse(
                        true,
                        'Update successful and now live');
                    alertService.success('Update successful and now live', {keepAfterRouteChange: true})
                })
                .catch((error) => {
                    handleServerResponse(false, error.response.data.error);
                    alertService.error('Error Updating', null)
                });
        }
        ;



    }

    const handleChangePasswordIntent = async (e) => {

        changePassword = !changePassword
        const changePasswordOptions = document.getElementById('changePasswordOptions');

        if (changePasswordOptions.style.display === 'none') {
            changePasswordOptions.style.display = 'block';

        } else {
            changePasswordOptions.style.display = 'none';

        }
    }

    function handleChangePassword() {

    }

    return (

        <>
            <Alert></Alert>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">

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
                                        <label htmlFor="UserName" className="">User Name</label>
                                        <input id="UserName"
                                               type="text"
                                               name="UserName"
                                               onChange={handleOnChange}
                                               required
                                               value={inputs.UserName}
                                               className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                               placeholder=""
                                               contentEditable={false}
                                        />

                                    </div>
                                    <div>
                                        <label htmlFor="address_line_1" className="">Change Password?</label>
                                        <input id="address_line_1"
                                               type="checkbox"
                                               name="address_line_1"
                                               onChange={handleChangePasswordIntent}
                                               value={"on"}
                                               defaultValue={"on"}
                                               className="block"

                                        />

                                    </div>

                                        <div  id="changePasswordOptions" className="changePasswordOptions" style={{display: "none"}}>
                                        <div>
                                            <label htmlFor="password" className="">New Password</label>
                                            <input id="password"
                                                   type="password"
                                                   name="password"
                                                   onChange={handleOnChange}

                                                   value={inputs.password}
                                                   className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                   placeholder="password"
                                                   contentEditable={true}
                                            />

                                        </div>

                                        <div>
                                            <label htmlFor="passwordConfirm" className="">Confirm Password</label>
                                            <input id="passwordConfirm"
                                                   type="password"
                                                   name="passwordConfirm"
                                                   onChange={handleOnChange}

                                                   value={inputs.passwordConfirm}
                                                   className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                   placeholder="password"
                                                   contentEditable={true}
                                            />
                                            <input type={"hidden"} id={"UserId"} value={user.UserId}/>
                                        </div>
                                        </div>


                                </div>
                            </fieldset>
                        </div>

                        <div>
                            <fieldset>
                                <div>

                                    <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}> Update Profile</button>
                                </div>
                            </fieldset>



                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}

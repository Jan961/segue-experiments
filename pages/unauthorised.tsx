import Link from 'next/link'
import Layout from '../components/guestLayout'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


import { alertService } from '../services/alert.service';
import { userService } from '../services/user.service';
import {  Alert } from '../components/alert';
import user from "../components/accounts/manage-users/user";
export default Unauthorised;

function Unauthorised() {
    const router = useRouter()

    return (
        <Layout title="Unauthorised | Segue">
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img className="mx-auto h-12 w-auto"
                             src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"/>
                        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Not Authorised</h1>
                        <Link href={"/"} title={"Back to home"}>Home</Link>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Sorry you do not have permission to view this page. Please contact your administrator to get access
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

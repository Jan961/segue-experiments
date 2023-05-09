import Link from 'next/link'
import Layout from '../../components/guestLayout'
import AccountPaymentDetails from "../../components/accounts/forms/paymentDetails";
import AccountDetails from "../../components/accounts/forms/accountDetails";
import UserRegistration from "../../components/accounts/forms/userRegistration";

const RegisterPage = () => (
    <Layout title="Login | Segue">
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <img className="mx-auto h-12 w-auto"
                         src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"/>
                    <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Register as Invited User</h1>
                    <p className="mt-2 text-center text-sm text-gray-600">


                    </p>
                    <UserRegistration></UserRegistration>
                </div>

            </div>
        </div>
    </Layout>
)

export default RegisterPage

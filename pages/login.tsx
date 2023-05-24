import Link from 'next/link'
import Layout from '../components/guestLayout'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


import { alertService } from '../services/alert.service';
import { userService } from '../services/user.service';
import {  Alert } from '../components/alert';
export default Login;

function Login() {
    const router = useRouter();

    // form validation rules
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ email, password }) {

        
        return userService.login(email, password)
            .then(() => {
                // get return url from query parameters or default to '/'
                const returnUrl = router.query.returnUrl || '/';
                // @ts-ignore
                router.push(returnUrl);
            })
            .catch(alertService.error("Error - Unable to login", ""));
    }

    return (
    <Layout title="Login | Segue">
        <Alert />
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <img className="mx-auto h-auto w-34"
                         src="/segue/segue_logo.png" alt="Segue Logo"/>
                        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Login</h1>
                        <p className="mt-2 text-center text-sm text-gray-600">


                        </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" name="remember" value="true"/>
                        <div className="-space-y-px rounded-md shadow-sm">
                            <div className="my-4">
                                <label htmlFor="email"  className="sr-only">Email address</label>
                                <input type="email"
                                       className="relative block w-full appearance-none drop-shadow-md rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                       placeholder="Email address"
                                       {...register('email')}

                                />
                                <div className="invalid-feedback">{errors.email?.message}</div>
                            </div>
                            <div className="my-4">
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input type="password"
                                       className="relative block w-full appearance-none drop-shadow-md rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                       placeholder="Password"
                                       {...register('password')}

                                />
                                <div className="invalid-feedback">{errors.password?.message}</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">

                            <div className="text-sm">
                                <div className="w-24 h-10 border-2 rounded-md flex justify-center items-center cursor-pointer hover:text-gray-800">

                                <a href="/register"
                                   className=" font-bold text-gray-800 ">Register</a>
                                </div>
                            </div>
                            <div className="text-sm">
                                <a href="forgotten-password" className=" underline font-medium text-gray-500 hover:text-gray-800">Forgot
                                    your password?</a>
                            </div>
                        </div>

                        <div>


                            <button disabled={formState.isSubmitting} className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">

                                  <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg"
                                       viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fill-rule="evenodd"
                                        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                                        clip-rule="evenodd"/>
                                </svg>
                              </span>
                                Login
                            </button>
                        </div>
                </form>
            </div>
        </div>
    </Layout>
    );
}

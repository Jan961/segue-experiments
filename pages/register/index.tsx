import Link from 'next/link'
import Layout from 'components/guestLayout'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { userService } from 'services/user.service'
import { alertService } from 'services/alert.service'
import { useRouter } from 'next/router'
import * as React from 'react'
import { emailService } from 'services/emailService'
import axios from 'axios'
import { Switch } from '@headlessui/react'
import { Spinner } from 'spinner'
import classNames from 'classnames'

export default Register
function Register () {
  const [toggle, setToggle] = React.useState(false)
  const router = useRouter()

  // form validation rules
  const validationSchema = Yup.object().shape({
    // User
    name: Yup.string().required('Name is required'),
    email: Yup.string().required(
      'Your Email is required, to allow login and notifications'
    ),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    password_confirm: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Passwords must match'
    ),

    // Account

    telephone: Yup.string()
      .required('You need to enter your business building')
      .min(10, 'Please include your full phone number'),
    business_name: Yup.string().required('We need your business name'),
    address_line_1: Yup.string().required('We need your business address'),
    address_line_2: Yup.string().notRequired(),
    address_line_3: Yup.string().notRequired(),
    postcode: Yup.string().notRequired(),
    county: Yup.string().notRequired(),
    company_website: Yup.string().notRequired(),
    var_reg: Yup.string().notRequired(),
    business_type: Yup.string().required(
      'What kind of business are you will you use this software with'
    ),

    // Account Payment
    card_number: Yup.string().notRequired(),
    card_expiration_date: Yup.string()
      .required('Expiration Date is required')
      .matches(
        /^(0[1-9]|1[0-2])?([0-9]{2})$/,
        'Must be Date in 0112 (Month)(Year)'
      )
      .min(4, 'Must be exactly 4 digits')
      .max(4, 'Must be exactly 4 digits'),
    card_cvc: Yup.string()
      .required('CVC is required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(3, 'Must be exactly 3 digits')
      .max(3, 'Must be exactly 3 digits'),
    card_postcode: Yup.string().notRequired(),

    // Accepted Terms and Conditions
    terms_agree: Yup.boolean().oneOf(
      [true],
      'You must accept the terms and conditions'
    )
  })
  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState

  function createPayload (user) {
    return {
      businessName: user.business_name,
      telephoneNumber: user.telephone,
      emailAddress: user.email,
      addressLine1: user.address_line_1,
      addressLine2: user.address_line_2,
      addressLine3: user.address_line_3,
      county: user.county,
      country: null, // user.country,
      postcode: user.postcode,
      vatRegistered: user.var_reg,
      businessType: parseInt(user.business_type),
      companyWebsite: user.company_website,
      password: user.password,
      name: user.name
    }
  }

  async function createAccount (user) {
    try {
      const response = await axios.post(
        '/api/account/create/',
        createPayload(user)
      )

      console.log('RESPONSE DATA:', response.data.accountId)
      const accountID = await response.data.AccountId

      if (accountID) {
        try {
          await axios.post('/api/venue/setup/setupAccountVenues', {
            accountId: accountID
          })
        } catch (error) {
          console.error(error)
        }
      }

      return accountID
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async function onSubmit (user) {
    // Create Account get Account ID
    let paymentSuccess: boolean

    paymentSuccess = true

    user.accountId = await createAccount(user)

    // Send User to UserService to Register
    return userService
      .register(user)
      .then(() => {
        // Send an alert to say account has been registered
        alertService.success('Registration successful', {
          keepAfterRouteChange: true
        })
        // Email users registered email with information about account
        emailService.send('confirmation', user)
        // Send user to Login Page to access the new Account with User Details
        router.push('login')
      })
      .catch(alertService.error('Error Registering', null))
  }

  return (
    <>
      <Layout title="Register | Segue">
        <div className="flex min-h-full items-center justify-around py-12 pb-4 sm:pb-2 lg:pb-6">
          <div className="w-full max-w-3xl space-y-8">
            <div>
              <img
                // className="mx-auto h-12 w-auto sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40"
                className="mx-auto w-auto h-32 aspect-[16/9]"
                src="/segue/segue_logo.png"
                alt="Your Company"
              />
              <h1 className=" text-center text-3xl font-bold tracking-tight text-gray-900">
                Register
              </h1>
              <p className="mt-2 text-center text-sm text-gray-600">
                If you have been invited to Join use the link in the email to
                create an account linked to your tour company
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <fieldset id="Account">
                  <div className="grid grid-cols-2 gap-x-24 gap-y-4">
                    <div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="block w-full min-w-0 flex-1  rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Your email"
                        {...register('email')}
                      />
                      <div className="invalid-feedback">
                        {errors.email?.message}
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Your Name"
                        className="block w-full min-w-0 flex-1 rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register('name')}
                      />
                      <div className="invalid-feedback">
                        {errors.name?.message}
                      </div>
                    </div>
                    <div>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        className="block w-full min-w-0 flex-1  rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register('password')}
                      />
                      <div className="invalid-feedback">
                        {errors.password?.message}
                      </div>
                    </div>
                    <div>
                      <input
                        type="password"
                        placeholder="Password Repeat"
                        className="block w-full min-w-0 flex-1 rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register('password_confirm')}
                      />
                      <div className="invalid-feedback">
                        {errors.password_confirm?.message}
                      </div>
                    </div>
                    <div>

                      <input
                        type="tel"
                        placeholder="Telephone number"
                        className="block w-full min-w-0 flex-1  rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register('telephone')}
                      />
                      <div className="invalid-feedback">
                        {errors.telephone?.message}
                      </div>
                    </div>
                    <div>

                      <input
                        type="text"
                        placeholder="Business Name"
                        className="block w-full min-w-0 flex-1 rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register('business_name')}
                      />
                      <div className="invalid-feedback">
                        {errors.business_name?.message}
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Address line 1"
                        className="block w-full min-w-0 flex-1  rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register('address_line_1')}
                      />
                      <div className="invalid-feedback">
                        {errors.address_line_1?.message}
                      </div>
                    </div>
                    <div>
                      <div className="mt-1 ">
                        <input
                          type="text"
                          className="block w-full min-w-0 flex-1 rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Website URL"
                          {...register('company_website')}
                        />
                        <div className="invalid-feedback">
                          {errors.company_website?.message}
                        </div>
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Address line 2"
                        className="block w-full min-w-0 flex-1  rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register('address_line_2')}
                      />
                      <div className="invalid-feedback">
                        {errors.address_line_2?.message}
                      </div>
                    </div>
                    <div className="flex flex-row items-center">
                      <input type="checkbox" {...register('var_reg')} />
                      <span className="text-sm mr-3 text-gray-500"> </span>
                      <label className="font-bold text-gray-500">Business is Vat Registered</label>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Address line 3"
                        className="block w-full min-w-0 flex-1  rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register('address_line_3')}
                      />
                      <div className="invalid-feedback">
                        {errors.address_line_3?.message}
                      </div>
                    </div>
                    <div>
                      <select
                        className="relative block w-full min-w-0 flex-1 rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue={'Select one'}
                        {...register('business_type')}
                      >
                        <option value="0" disabled>
                          Select one
                        </option>
                        <option value="1">Producer</option>
                        <option value="2">Booker</option>
                        <option value="3">Venue</option>
                        <option value="4">Marketing Company</option>
                        <option value="5">Press and PR Company</option>
                      </select>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="County"
                        className="block w-full min-w-0 flex-1  rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register('county')}
                      />
                      <div className="invalid-feedback">
                        {errors.county?.message}
                      </div>
                    </div>
                    <div></div>

                    <div>
                      <input
                        type="text"
                        placeholder="Postcode"
                        className="block w-full min-w-0 flex-1  rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register('postcode')}
                      />
                      <div className="invalid-feedback">
                        {errors.postcode?.message}
                      </div>
                    </div>

                    <div></div>
                  </div>
                </fieldset>
              </div>

              <div className="flex flex-row items-center justify-between h-24 border-y-2 border-gray-500 my-4">
                <span className="text-4xl font-bold text-gray-900">Total Per Month: £ 120 (inc VAT)</span>
                <Switch
                  checked={toggle}
                  onChange={() => setToggle(!toggle)}
                  className={classNames(
                    toggle ? 'bg-primary-green ' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:primary-green focus:ring-offset-2'
                  )}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      toggle ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
                <span className="text-xl text-gray-500 font-bold ">
        Pay Monthly
                </span>
              </div>
              <div>
                <fieldset id="Payment" className="flex flex-col items-center">
                  <legend className="block w-full text-center text-2xl font-bold text-gray-700 ">
                    Payment Details
                  </legend>
                  <div className="mt-1 w-full px-24 ">
                    <div>
                      <input
                        type="text"
                        className="block w-full min-w-0 flex-1 rounded-none rounded-t-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Long Card #"
                        {...register('card_number')}
                      />
                      <div className="invalid-feedback">
                        {errors.card_number?.message}
                      </div>
                    </div>
                    <div className="flex flex-row justify-between mt-4">
                      <div className="pr-2 flex-1">
                        <input
                          type="text"
                          className="block w-full min-w-0 flex-1  rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Valid MM / YY"
                          {...register('card_expiration_date')}
                        />
                        <div className="invalid-feedback">
                          {errors.card_expiration_date?.message}
                        </div>
                      </div>
                      <div className="min-w-0 px-2 flex-1">
                        <input
                          type="text"
                          className="block w-full min-w-0 flex-1   rounded-md drop-shadow-md border-gray-300  px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="CVC"
                          {...register('card_cvc')}
                        />
                        <div className="invalid-feedback">
                          {errors.card_cvc?.message}
                        </div>
                      </div>
                      <div className="min-w-0 pl-2 flex-1">
                        <label htmlFor="card_postcode" className="sr-only">
                          postcode
                        </label>
                        <input
                          type="text"
                          className="block w-full min-w-0 flex-1 rounded-md drop-shadow-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Postcode"
                          {...register('card_postcode')}
                        />
                        <div className="invalid-feedback">
                          {errors.card_postcode?.message}
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div>
                <fieldset>
                  <div className="flex flex-col">
                    <div className="w-full flex flex-row justify-center items-center my-4">

                      <label htmlFor="terms_agree" className="sr-only">
                      Agree with Segue terms and conditions
                      </label>
                      <input type="checkbox" className="mr-2" {...register('terms_agree')} />
                      <div className="invalid-feedback">
                        {errors.terms_agree?.message}
                      </div>
                      <span className="inline text-sm text-gray-500">
                      I agree to the
                        <Link href={'terms'} className="text-blue-500 font-bold"> Terms and conditions </Link> and
                        <Link href={'privacy'} className="text-blue-500 font-bold"> Privacy Policy</Link>
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex flex-row justify-center">
                    <input type="hidden" name="accountId" />
                    <button
                      disabled={formState.isSubmitting}
                      className=" bg-primary-green w-32 p-2 rounded-md text-white drop-shadow-md "
                    >
                      {formState.isSubmitting && (
                        <Spinner/>
                      )}
                      Register
                    </button>
                  </div>
                </fieldset>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}

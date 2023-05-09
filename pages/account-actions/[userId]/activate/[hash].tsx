import Layout from "../../../../components/guestLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { forceNavigate } from "../../../../utils/forceNavigate";

export default function Index({userToActivate, userId, guid }) {

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const guidlenght = 36;

  const [inputs, setInputs] = useState({
    emailAddress: null,
    password: null,
    confirm_password: null,
  });

  // Get User id and GUID
  const router = useRouter();

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: msg },
      });
      //setInputs({});
    } else {
      // @ts-ignore
      setStatus(false);
    }
  };
  const handleOnChange = (e) => {
    e.persist();

    if (e.target.type === "checkbox") {
      if (e.target.checked !== null) {
        e.target.value = e.target.checked;
      }
    }

    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

    if (inputs.password === inputs.confirm_password) {
      axios({
        method: "POST",
        url: "/api/users/activate",
        data: inputs,
      })
        .then((response) => {
          handleServerResponse(
            true,
            "Thank you, your account has been activated."
          );
          handleComplete();
        })
        .catch((error) => {
          handleServerResponse(false, error.response.data.error);
        });
    } else {
      handleServerResponse(false, "Password did not match");
    }
  };

  const handleComplete = () => {
    // Send success message
    // forward to login
    forceNavigate("/login");
  };

  // basic check
  if (userId !== null && guid !== null) {
    //get user

    //const guid = router.query.hash
    //const userId = router.query.userId

    console.log("The UserToACtivate", userToActivate);

    // userToActivate.guid = "";

    // fetch(`/api/users/read/${userId}}/${guid}`)
    //   .then((res) => res.json())
    //   .then((res) => {
    //     userToActivate.searchResults.EmailAddress = res.searchResults.EmailAddress;
    //     //userToActivate.isActive = res.searchResults.IsActive
    //     userToActivate.searchResults.Guid = res.searchResults.guid;
    //   });

    // Guid must mtch what is in the user stored profile to prevent manual line maniplutation
    //console.log("GUID: " + userToActivate.guid + " Params guid:  " + guid)
    if (userToActivate && userToActivate.searchResults && router.query.hash === userToActivate.searchResults.Guid) {
      // Account can be activated

      return (
        <Layout title="Create Account | Segue">
          <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div>
                <img
                  className="mx-auto h-12 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
                <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                  Activate Account
                </h1>
                <p className="mt-2 text-center text-sm text-gray-600"></p>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleOnSubmit}>
                <input type="hidden" name="remember" value="true" />
                <div className="-space-y-px rounded-md shadow-sm">
                  <div>
                    <label htmlFor="emailAddress" className="">
                      Email address
                    </label>
                    <input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      autoComplete="email"
                      onChange={handleOnChange}
                      required
                      value={inputs.emailAddress}
                      className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      onChange={handleOnChange}
                      required
                      value={inputs.password}
                      className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm_password" className="">
                      Confirm Password
                    </label>
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      onChange={handleOnChange}
                      required
                      value={inputs.confirm_password}
                      className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder=""
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Activate now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Layout>
      );
    } else {
      return (
        <div className="w-screen h-screen flex flex-col justify-center bg-white">
          <div className="font-bold">Account is activated</div>
          {/* <p>{userToActivate.searchResults.Guid}</p>
          <p>{router.query.hash}</p> */}
        </div>
      );
    }
  } else {
    // invalid
    return (
      <>
        <div>Link Expired</div>
      </>
    );
  }

  // Validete request to create password
  // a password creation needs account to be inactive isActive = false

  // If Invalid = Display timed out

  /// else create password

  // handle on submit

  // verify account via email (user must enter the email that they recieved the link help prevent brute force)
  //check password matched from entered fields

  // error

  // on success forward to login

  // handle on change

  return "not setup";
}

export async function getStaticProps(context) {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  const { params } = context;
  const userId = params.userId;
  const guid = params.hash;

  const res = await fetch(`${process.env.BASE_URL}/api/users/read/${userId}/${guid}`);
  const userToActivate = await res.json();
  console.log("The user to activate", userToActivate);

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      userToActivate,
      guid,
      userId,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

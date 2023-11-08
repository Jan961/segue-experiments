import { useRouter } from 'next/router';
import { userService } from '../../../services/user.service';
import { alertService } from '../../../services/alert.service';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert } from '../../alert';
import accountId from '../../../pages/account/update-details/[account-id]';
import { loggingService } from '../../../services/loggingService';

export default function SalesDataValidation() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  let errors: {};

  const router = useRouter();

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({
    lowSeatCount: 50,
    seatPercentageIncrease: 100,
    HighSeatCount: 50,
    seatPercentageLowerIncrease: 15,
    reservedSeatPercentageIncrease: 15,
    accountId: userService.userValue.accountId,
  });
  const searchEndpoint = `api/account/settings/salesValidation/${accountId}`;

  useEffect(() => {
    fetch(searchEndpoint)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data !== null) {
          setInputs({
            lowSeatCount: data.lowSeatCount,
            seatPercentageIncrease: data.seatPercentageIncrease,
            HighSeatCount: data.HighSeatCount,
            seatPercentageLowerIncrease: data.seatPercentageLowerIncrease,
            reservedSeatPercentageIncrease: data.reservedSeatPercentageIncrease,
            accountId: userService.userValue.accountId,
          });
        }
        setData(data);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg },
      });
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
      info: { error: false, msg: null },
    });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

    axios({
      method: 'POST',
      url: '/api/account/settings/salesValidation',
      data: inputs,
    })
      .then((response) => {
        loggingService.logAction('Account Settings', 'Sales Data Validation Rule Change');
        handleServerResponse(true, 'Update successful and now live');
        alertService.success('Update successful and now live', { keepAfterRouteChange: true });
      })
      .catch((error) => {
        loggingService.logError(error);
        handleServerResponse(false, error.response.data.error);
        alertService.error('Error Updating', null);
      });
  };
  return (
    <>
      <Alert></Alert>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Update Account Sales Data Validation
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              The below data will used when processing sales data entered into the system to
            </p>
          </div>
          <form onSubmit={handleOnSubmit}>
            <div>
              <fieldset id="Account">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label htmlFor="lowSeatCount" className="">
                      Seat Count is Lass than Previous by
                    </label>
                    <input
                      id="lowSeatCount"
                      type="number"
                      name="lowSeatCount"
                      onChange={handleOnChange}
                      required
                      value={inputs.lowSeatCount}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="100"
                      contentEditable={true}
                    />
                  </div>

                  <div>
                    <label htmlFor="seatPerCentIncrease" className="">
                      Seat Count increase Percentage (%)
                    </label>
                    <input
                      id="seatPercentageIncrease"
                      type="number"
                      name="telephone"
                      onChange={handleOnChange}
                      value={inputs.seatPercentageIncrease}
                      required
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="50"
                      contentEditable={true}
                    />
                  </div>

                  <div>
                    <label htmlFor="HighSeatCount" className="">
                      Seat Count Increase by{' '}
                    </label>
                    <input
                      id="HighSeatCount"
                      type="number"
                      name="HighSeatCount"
                      onChange={handleOnChange}
                      required
                      value={inputs.HighSeatCount}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="100"
                      contentEditable={true}
                    />
                  </div>

                  <div>
                    <label htmlFor="seatPercentageLowerIncrease" className="">
                      Seat Count increase Percentage lower bound (%)
                    </label>
                    <input
                      id="seatPercentageLowerIncrease"
                      type="number"
                      name="seatPercentageLowerIncrease"
                      onChange={handleOnChange}
                      value={inputs.seatPercentageLowerIncrease}
                      required
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="15"
                      contentEditable={true}
                    />
                  </div>
                  <div>
                    <label htmlFor="reservedSeatPercentageIncrease" className="">
                      Reserved Seat Count increase Percentage (%)
                    </label>
                    <input
                      id="reservedSeatPercentageIncrease"
                      type="number"
                      name="reservedSeatPercentageIncrease"
                      onChange={handleOnChange}
                      value={inputs.reservedSeatPercentageIncrease}
                      required
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="15"
                      contentEditable={true}
                    />
                    <input type={'hidden'} id={'accountId'} value={inputs.accountId} name={'accountID'} />
                  </div>
                </div>
              </fieldset>
            </div>

            <div>
              <fieldset>
                <div>
                  <button className={''}> Update Validation Rules</button>
                </div>
              </fieldset>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

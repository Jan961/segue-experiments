import { useState } from 'react'
import axios from 'axios'
import { Venue } from 'interfaces'
import { userService } from 'services/user.service'
import { loggingService } from 'services/loggingService'

type Props = {
    items: Venue
}

export default function Details({items}: Props){

    const userLevel = userService.userValue.accountId

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });

    const [inputs, setInputs] = useState({
        Code: items.Code,
        Name: items.Name,
        Address1: items.Address1,
        Address2: items.Address2,
        Address3: items.Address3,
        Town:items.Town,
        Postcode:items.Postcode,
        County: items.County,
        Country:items.Country,
        Seats:items.Seats,
        Notes: items.Notes,


        DeliveryAddress1: items.DeliveryAddress1,
        DeliveryAddress2: items.DeliveryAddress2,
        DeliveryAddress3: items.DeliveryAddress3,
        DeliveryCounty: items.DeliveryCounty,
        DeliveryCountry: items.DeliveryCountry,
        DeliveryPostcode: items.DeliveryPostcode,
        Latitude: items.Latitude,
        Longitude: items.Longitude


    });

    const handleServerResponse = (ok, msg) => {
        if (ok) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg },
            });
            setInputs({
                Latitude: inputs.Latitude,
                Longitude: inputs.Longitude,
                Code: inputs.Code,
                Name: inputs.Name,
                Address1: inputs.Address1,
                Address2: inputs.Address2,
                Address3: inputs.Address3,
                Town:inputs.Town,
                Postcode:inputs.Postcode,
                County: inputs.County,
                Country:inputs.Country,
                Seats:inputs.Seats,
                Notes: inputs.Notes,
                DeliveryAddress1: inputs.DeliveryAddress1,
                DeliveryAddress2: inputs.DeliveryAddress2,
                DeliveryAddress3: inputs.DeliveryAddress3,
                DeliveryCounty: inputs.DeliveryCounty,
                DeliveryCountry: inputs.DeliveryCountry,
                DeliveryPostcode: inputs.DeliveryPostcode
            });
        } else {
            // @ts-ignore
            setStatus(false);
        }
    };
    const handleOnChange = async (e) => {

        e.persist();
        if (e.target.name === "Postcode") {
            let postcode =  e.target.value
            await getLatLong(postcode)
        }
        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));


    };

    async function getLatLong(PostCode){
        await fetch(`/api/distance/country/${PostCode}`)
            .then((res) => res.json())
            .then((data) => {
                inputs.Latitude = data.latitude
                inputs.Longitude = data.longitude
            })

    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
         axios({
            method: 'POST',
            url: '/api/venue/update/details/' + items.VenueId,
            data: inputs,
        })
            .then((response) => {
                loggingService.logAction("Update Venue","Update Venue Details")
                handleServerResponse(
                    true,
                    'Thank you, your message has been submitted.',
                                    );
                //console.log((JSON.stringify(handleServerResponse)))
            })
            .catch((error) => {
                loggingService.logError(error)
                handleServerResponse(false, error.response.data.error);
            });
    };

    return (
    <>
        <div className={"flex bg-blue-100 w-screen p-5"}>
            <form onSubmit={handleOnSubmit}>
                <div className="grid grid-cols-2 gap-2 w-screen px-20">
                    <div>
                    {inputs.Latitude}</div>
                    <div>{inputs.Longitude}</div>

                    <div>
                        <label htmlFor="text" className="">Code  {inputs.Code}</label>

                        <input
                            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={inputs.Code}
                            id="Code"
                            name="Code"
                            type="text"
                            required
                            onChange={handleOnChange}

                        />

                    </div>
                    <div>
                        <label htmlFor="name" className="">Venue name</label>
                        <input value={inputs.Name}
                               id="Name"
                               name="Name"
                               type="text"
                               required
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                               onChange={handleOnChange}

                        />
                    </div>

                    <div>
                        <label htmlFor="text" className="">Address Line 1</label>
                        <input value={inputs.Address1}
                               id="Address1"
                               name="Address1"
                               type="text"
                               required
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                               onChange={handleOnChange}

                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="">Vat Registered</label>
                        <input
                            type="checkbox"
                            // id={`custom-checkbox-${index}`}
                            name=""
                            value=""
                            checked={true}
                            onChange={handleOnChange}

                        />

                    </div>
                    <div>
                        <label htmlFor="text" className="">Address Line 2</label>

                        <input value={inputs.Address2}
                               id="Address2"
                               name="Address2"
                               type="text"
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="">Currency</label>
                        <select>
                            <option>GBP - Pounds Sterling (£) </option>
                            <option>Eur - Euros (€)</option>
                            <option>USD - Euros ($)</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="text" className="">Address Line 3</label>

                        <input value={inputs.Address3}
                               id="Address3"
                               name="Address3"
                               type="text"
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="">Seats</label>
                        <input value={inputs.Seats}
                               id="Seats"
                               name="Seats"
                               type="number"
                               required
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="text" className="">Town</label>

                        <input value={inputs.Town}
                               id="Town"
                               name="Town"
                               type="text"
                               required
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>


                        <label htmlFor="Notes" className="form-label inline-block mb-2 text-gray-700"
                        >Notes</label
                        >
                        <textarea
                            className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            id="notes"
                            rows={3}
                            placeholder="Your message"
                        >{inputs.Notes}</textarea>

                    </div>

                    <div>
                        <label htmlFor="text" className="">Postcode</label>

                        <input value={inputs.Postcode}
                               id="Postcode"
                               name="Postcode"
                               type="text"
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>

                    </div>
                    <div>
                        <label htmlFor="text" className="">County</label>

                        <input value={inputs.County}
                               id="County"
                               name="County"
                               type="text"
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>

                    </div>
                    <div>
                        <label htmlFor="text" className="">Country</label>

                        <input value={inputs.Country}
                               id="Country"
                               name="Country"
                               type="text"
                               required
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>

                    </div>
                    <div>

                        <label htmlFor="text" className="">Delivery Address Line 1</label>

                        <input value={inputs.DeliveryAddress1}
                               id="DeliveryAddress1"
                               name="DeliveryAddress1"
                               type="text"
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>

                    </div>
                    <div>
                        <label htmlFor="text" className="">Delivery Address Line 2</label>

                        <input value={inputs.DeliveryAddress2}
                               id="DeliveryAddress2"
                               name="DeliveryAddress2"
                               type="text"
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />

                    </div>
                    <div>

                    </div>
                    <div>
                        <label htmlFor="text" className="">Delivery Address Line 3</label>

                        <input value={inputs.DeliveryAddress3}
                               id="DeliveryAddress3"
                               name="DeliveryAddress3"
                               type="text"
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>

                    </div>
                    <div>
                        <label htmlFor="text" className="">Delivery Town</label>

                        <input value={inputs.DeliveryCounty}
                               id="DeliveryTown"
                               name="DeliveryTown"
                               type="text"
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>

                    </div>
                    <div>
                        <label htmlFor="text" className="">Delivery County</label>

                        <input value={inputs.DeliveryCounty}
                               id="DeliveryCounty"
                               name="DeliveryCounty"
                               type="text"
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>

                    </div>
                    <div>
                        <label htmlFor="text" className="">Delivery Postcode</label>

                        <input value={inputs.DeliveryPostcode}
                               id="DeliveryPostcode"
                               name="DeliveryPostcode"
                               type="text"

                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>

                    </div>
                    <div>
                        <label htmlFor="text" className="">Delivery Country</label>

                        <input value={inputs.DeliveryCountry}
                               id="DeliveryCountry"
                               name="DeliveryCountry"
                               type="text"
                               onChange={handleOnChange}
                               className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>

                    </div>


                </div>
                <input type={"submit"} value={"Submit"}/>
            </form>
        </div>

    </>
);
}




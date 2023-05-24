import { useState } from 'react'
import axios from 'axios'
import { Venue } from 'interfaces'
import { loggingService } from 'services/loggingService'

type Props = {
    items: Venue
}

export default function Barring({items}: Props){

    const userLevel = 1  //TODO: get this from User

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });

    const [inputs, setInputs] = useState({
        BarringClause: items.BarringClause,
        BarringWeeksPre: items.BarringWeeksPre,
        BarringWeeksPost: items.BarringWeeksPost,
        BarringMiles: items.BarringMiles,

    });

    const handleServerResponse = (ok, msg) => {
        if (ok) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg },
            });
            setInputs({
                BarringClause: items.BarringClause,
                BarringWeeksPre: items.BarringWeeksPre,
                BarringWeeksPost: items.BarringWeeksPost,
                BarringMiles: items.BarringMiles,
            });
        } else {
            // @ts-ignore
            setStatus(false);
        }
    };
    const handleOnChange = (e) => {
        e.persist();
        if(e.target.name == "Name" || e.target.name == "Town"){
            alert(e.target.name)
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
    const handleOnSubmit = (e) => {
        e.preventDefault();
        setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
        axios({
            method: 'POST',
            url: '/api/venue/update/barring/' + items.VenueId,
            data: inputs,
        })
            .then((response) => {
                loggingService.logAction("Barring Update","Update Venue Barring")

                handleServerResponse(
                    true,
                    'Thank you, your message has been submitted.',
                    //Todo: router setlocation to the new venue to allow user to add the rest fo the detils

                );
                console.log((JSON.stringify(handleServerResponse)))
            })
            .catch((error) => {
                loggingService.logError( error)
                handleServerResponse(false, error.response.data.error);
            });
    };

    return (
        <>
            <div className={"flex bg-blue-100 w-screen p-5"}>
                <form onSubmit={handleOnSubmit}>
                    <div className="grid grid-cols-2 gap-2 w-screen px-20">

                        <div>
                            <label htmlFor="text" className="">Barring Clause</label>

                            <input
                                className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={inputs.BarringClause}
                                id="BarringClause"
                                name="BarringClause"
                                type="text"
                                required
                                onChange={handleOnChange}

                            />

                        </div>
                        <div>

                        </div>

                        <div>
                            <span>Barring Weeks</span>
                        </div>
                        <div>

                        </div>
                        <div>
                            <label htmlFor="text" className="">Pre Show</label>

                            <input value={inputs.BarringWeeksPre}
                                   id="BarringWeeksPre"
                                   name="BarringWeeksPre"
                                   type="text"
                                   onChange={handleOnChange}
                                   className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="text" className="">Post Show</label>

                            <input value={inputs.BarringWeeksPost}
                                   id="BarringWeeksPost"
                                   name="BarringWeeksPost"
                                   type="text"
                                   onChange={handleOnChange}
                                   className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="text" className="">Barring Miles</label>

                            <input value={inputs.BarringMiles}
                                   id="BarringMiles"
                                   name="BarringMiles"
                                   type="text"
                                   onChange={handleOnChange}
                                   className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>

                        </div>
                        <div>
                            {/* TODO: Venue Barring list */}
                            Barring Clause List (DO with BARRING)
                            Include a new form with the barring venue venue data
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




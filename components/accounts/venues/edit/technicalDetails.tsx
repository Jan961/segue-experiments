import * as React from 'react'
import {faBook, faEdit, faPlus, faSquareXmark, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Venue} from "../../../../interfaces";
import {useState} from "react";
import axios from "axios";
import {loggingService} from "../../../../services/loggingService";


type Props = {
    items: Venue
}


export default function Details({items}: Props){

    const userLevel = 1  //TODO: get this from User

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });

    const [inputs, setInputs] = useState({
        TechSpecsURL: items.TechSpecsURL,
        StageSize: items.StageSize,
        LXDesk: items.LXDesk,
        GridHeight: items.GridHeight,
        LXNotes: items.LXNotes,
        VenueFlags:items.VenueFlags,
        SoundDesk:items.SoundDesk,
        SoundNotes: items.SoundNotes,



    });

    const handleServerResponse = (ok, msg) => {
        if (ok) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg },
            });
            setInputs({
                StageSize: inputs.StageSize,
                TechSpecsURL: inputs.TechSpecsURL,
                LXDesk: inputs.LXDesk,
                GridHeight: inputs.GridHeight,
                LXNotes: inputs.LXNotes,
                VenueFlags:inputs.VenueFlags,
                SoundDesk:inputs.SoundDesk,
                SoundNotes: inputs.SoundNotes,
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
            url: '/api/venue/update/technicalDetails/' + items.VenueId,
            data: inputs,
        })
            .then((response) => {
                loggingService.logAction("Technical Details Update","Updated" + items.VenueId)
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
                            <label htmlFor="text" className="">Technical Specification URL</label>

                            <input
                                className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={items.TechSpecsURL}
                                id="TechSpecsURL"
                                name="TechSpecsURL"
                                type="text"
                                required
                                onChange={handleOnChange}

                            />

                        </div>
                        <div>
                            <label htmlFor="name" className="">Stage Size</label>
                            <input value={inputs.StageSize}
                                   id="StageSize"
                                   name="StageSize"
                                   type="text"
                                   required
                                   className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                   onChange={handleOnChange}

                            />
                        </div>

                        <div>
                            <label htmlFor="text" className="">Lighting Desk</label>
                            <input value={inputs.LXDesk}
                                   id="LXDesk"
                                   name="LXDesk"
                                   type="text"
                                   required
                                   className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                   onChange={handleOnChange}

                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="">Grid Height</label>
                            <input value={inputs.GridHeight}
                                   id="GridHeight"
                                   name="GridHeight"
                                   type="text"
                                   required
                                   className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                   onChange={handleOnChange}


                            />

                        </div>


                        <div>
                            <label htmlFor="LX Notes" className="form-label inline-block mb-2 text-gray-700"
                            >LX Notes</label
                            >
                            <textarea
                                id="LXNotes"
                                name="LXNotes"
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

                                rows={3}
                                onChange={handleOnChange}
                            >{inputs.LXNotes}</textarea>
                        </div>
                        <div>


                            <label htmlFor="Notes" className="form-label inline-block mb-2 text-gray-700"
                            >VenueFlags</label
                            >
                            <textarea
                                id="VenueFlags"
                                name="VenueFlags"
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

                                rows={3}
                                onChange={handleOnChange}
                            >{inputs.LXNotes}</textarea>

                        </div>

                        <div>
                            <label htmlFor="text" className="">Sound Desk</label>

                            <input value={inputs.SoundDesk}
                                   id="SoundDesk"
                                   name="SoundDesk"
                                   type="text"
                                   onChange={handleOnChange}
                                   className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>

                        </div>
                        <div>
                            <label htmlFor="LX Notes" className="form-label inline-block mb-2 text-gray-700"
                            >Sound Notes</label
                            >
                            <textarea
                                id="SoundNotes"
                                name="SoundNotes"
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

                                rows={3}
                                onChange={handleOnChange}
                            >{inputs.SoundNotes}</textarea>
                        </div>
                        <div>

                        </div>
                        <div>

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




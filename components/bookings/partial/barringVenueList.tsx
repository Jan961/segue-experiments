import {faCalendarXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons/faCircleInfo";

export default function BarringVenueList({venues}){

    return typeof venues !== 'undefined' ? (
        venues.length >= 1 ? (
            <div className="flex flex-row space-x-2 space-y-2">
                <table className={""}>
                    <tr>
                        <th>Venue</th>
                        <th>Distance</th>
                        <th>Reason</th>
                    </tr>
                    {venues.map((barredVenue) => (
                    <tr>
                        <td>{"VenueName"}</td>
                        <td>{"Distance"}</td>
                        <td>

                            <div className="group relative m-12 flex justify-center">
                                <button className="rounded bg-red-700 px-4 py-2 text-sm text-white shadow-sm"><FontAwesomeIcon icon={faCircleInfo as IconProp}/></button>
                                <span className="absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white w-max-200 group-hover:scale-100 w-300px">
                                    <p>Reason to not allow this venue 1</p>
                                </span>
                            </div>
                        </td>
                    </tr>
                        )
                    )}
                </table>

            </div>
        ) : (
            <div className="flex flex-row space-x-2 space-y-2">
                <p>Use the above filtered to get a list of venue</p>
            </div>
        )
    ) : null

}
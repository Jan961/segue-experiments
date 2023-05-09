import * as React from 'react'
import Hold from "../marketing/tabs/hold";
import BookingHold from "./modal/bookingHold";
import { id } from 'date-fns/locale';
import {useEffect, useState} from "react";
import {bookingService} from "../../services/bookingService";
import {userService} from "../../services/user.service";
import EditPerfomance from "./modal/EditPerfomance";
import AddPerfomance from "./modal/AddPerfomance";
import PerfomanceHold from "./modal/perfomanceHold";


const performances = [];

interface PerformancesListProps {
    bookingId: number,
}

function PerformancesList({ bookingId }: PerformancesListProps) {
    const [performances, setPerformances] = useState([]);

    useEffect(() => { (async() => {
        setPerformances([])
        fetch(`/api/bookings/Performances/${bookingId}/`)
            .then((res) => res.json())
            .then((data) => {
                setPerformances(data);
            })

    })(); }, [bookingId]);

    return (
        <>
            { performances.length < 8 ?
                <>
                <AddPerfomance BookingId={bookingId}></AddPerfomance>
                </> : null
            }


    <div className="flex flex-row">
        <div className="col-auto">
            <div className="col-auto">
                <div className="flex flex-row">&nbsp;</div>
            </div>
        </div>
        <div className="w-full text-sm rounded-md border py-2">
        <ul className="w-full">
            {performances.length >= 1 ?  (
                <>
                    {performances.map((item) => (
                        <li className="flex items-center justify-between w-full py-1 px-4 border rounded-md bg-white mb-1">
                            <span className="text-center flex-1">{item.Time.substring(11,16)}</span>
                            { item.PerformanceId !== undefined ?
                                <>
                                    <EditPerfomance PerformanceId={item.PerformanceId}></EditPerfomance>
                                    <PerfomanceHold bookingId={bookingId} perfomanceId={item.PerformanceId} className="ml-auto"/>
                                </>
                            : null
                                }

                        </li>
                    ))}
                </>
            ): <div><p className={"text-gray-900" }>No Performances for this booking </p></div>}

        </ul>
        </div>
    </div>
    </>
    );
  }

export default PerformancesList

/*
preventDefault type button not submit 
row added will have a remove performance 
list needs to be editable 

Performances table: 
ID - auto number
booking id - pairs with booking itself
time - stored as a time field 

API has add, read and delete

do database stuff (dummy data), then API read, write (examples in current set), and then call the API localhost/API/Bookings/Performances/PerformanceID 
performance id = request.id.performance.bookingID 
*/

import * as React from 'react'
import {faBook, faEdit, faPlus, faSquareXmark, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const activities = [
    {activityName: "hello World!", type: "Type 1", created: "10/10/2022", followup: "20/12/2022", co: "cs", venue: "The kings, Glasgow", notes: "loripsuim"},
    {activityName: "hello World!", type: "Type 1", created: "10/10/2022", followup: "20/12/2022", co: "cs", venue: "The kings, Glasgow", notes: "loripsuim"},
    {activityName: "hello World!", type: "Type 1", created: "10/10/2022", followup: "20/12/2022", co: "cs", venue: "The kings, Glasgow", notes: "loripsuim"},
    {activityName: "hello World!", type: "Type 1", created: "10/10/2022", followup: "20/12/2022", co: "cs", venue: "The kings, Glasgow", notes: "loripsuim"},
    {activityName: "hello World!", type: "Type 1", created: "10/10/2022", followup: "20/12/2022", co: "cs", venue: "The kings, Glasgow", notes: "loripsuim"},
    {activityName: "hello World!", type: "Type 1", created: "10/10/2022", followup: "20/12/2022", co: "cs", venue: "The kings, Glasgow", notes: "loripsuim"},


]


const Activities = () => (
    <div   className={"flex w-9/12 pt-5"}>

        <div className="flex-auto mx-4 mt-0overflow-hidden   ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
            <div className={"mb-3"}>
                <form className="grid grid-cols-5">
                    <div className="flex flex-row items-center space-x-4 ">

                    <input type={"checkbox"} className={""} name={"onSale"} value={"off"} />
                    <label htmlFor={"onSale"} className={""}>On Sale</label>
                    </div>
                    <div className="flex flex-row items-center space-x-4 ">

                    <label htmlFor={"date"} className={"sr-only"}>Date</label>
                    <input className="border border-gray-300  rounded-md" type={"date"} id={"date"} value={new Date().toDateString()} name={"date"}/>
                    </div>
                    <div className="flex flex-row items-center space-x-4 ">

                    <input type={"checkbox"} className={""} name={"onSale"} value={"off"} />
                    <label htmlFor={"onSale"} className={""}> Marketing Plans Received </label>
                    </div>
                    <div className="flex flex-row items-center space-x-4 ">

                    <input type={"checkbox"} className={""} name={"onSale"} value={"off"} />
                    <label htmlFor={"onSale"} className={""}> Print requirements received </label>
                    </div>
                    <div className="flex flex-row items-center space-x-4 ">

                    <input type={"checkbox"} className={""} name={"onSale"} value={"off"} />
                    <label htmlFor={"onSale"} className={""}> Contact info Received </label>
                    </div>

                </form>

            </div>
            <table className=" min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                <tr className="bg-primary-green">
                    <th scope="col" className=" border-l border-white py-3 pl-4 pr-3 text-left text-sm font-normal rounded-tl-md text-white sm:pl-6">
                        Activity Name
                    </th>
                    <th scope="col" className=" border-l border-white py-3 pl-4 pr-3 text-left text-sm font-normal text-white sm:pl-6">
                        type
                    </th>
                    <th
                        scope="col"
                        className=" border-l border-white hidden px-3 py-3 text-left text-sm font-normal text-white lg:table-cell"
                    >
                        week created / Follow up Date
                    </th>
                    <th
                        scope="col"
                        className=" border-l border-white hidden px-3 py-3 text-left text-sm font-normal text-white sm:table-cell"
                    >
                        co
                    </th>
                    <th
                        scope="col"
                        className=" border-l border-white hidden px-3 py-3 text-left text-sm font-normal text-white sm:table-cell"
                    >

                        Venue
                    </th>
                    <th
                        scope="col"
                        className=" border-l border-white hidden px-3 py-3 text-left text-sm font-normal text-white sm:table-cell"
                    >

                        Notes
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-sm font-normal rounded-tr-md text-white">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {activities.map((activity, idx) => (
                    <tr key={activity.activityName} className={idx%2 ===0?"bg-white":"bg-gray-50"}>
                        <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:w-auto sm:max-w-none sm:pl-6">
                            {activity.activityName}
                        </td>
                        <td className=" border-l border-slate-200 hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{activity.type}</td>
                        <td className=" border-l border-slate-200 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{activity.created} - {activity.followup}</td>
                        <td className=" border-l border-slate-200 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{activity.co}</td>
                        <td className=" border-l border-slate-200 px-3 py-4 text-sm text-gray-500">{activity.venue}</td>
                        <td className=" border-l border-slate-200 px-3 py-4 text-sm text-gray-500">{activity.notes}</td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                            <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-1">

                                <FontAwesomeIcon icon={faPlus}/>
                                <span className="sr-only">Single Seat</span>
                            </a>
                            <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-1">

                                <FontAwesomeIcon icon={faEdit}/>
                                <span className="sr-only">Single Seat</span>
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table><div className="mt-3">
            <button className={"inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}>Add Activity </button>

        </div>
        </div>


         </div>

)

export default Activities



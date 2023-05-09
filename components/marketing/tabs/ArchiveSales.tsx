import * as React from 'react'
import {faBook, faSquareXmark, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const sales = [
    {week: -51, weekOf: "10/10/2023", num: 0, value: 1},
    {week: -50, weekOf: "10/10/2023", num: 0, value: 1},
    {week: -49, weekOf: "10/10/2023", num: 0, value: 1},
    {week: -48, weekOf: "10/10/2023", num: 0, value: 1},
    {week: -47, weekOf: "10/10/2023", num: 0, value: 1},
    {week: -46, weekOf: "10/10/2023", num: 0, value: 1},
    {week: -45, weekOf: "10/10/2023", num: 0, value: 1},
    {week: -44, weekOf: "10/10/2023", num: 0, value: 1},
    {week: -43, weekOf: "10/10/2023", num: 0, value: 1},
    {week: -42, weekOf: "10/10/2023", num: 0, value: 1},
    {week: -41, weekOf: "10/10/2023", num: 0, value: 1},
    {week: -40, weekOf: "10/10/2023", num: 0, value: 1},
    {week: -39, weekOf: "10/10/2023", num: 0, value: 1},

]


const ArchiveSales = () => (
    <div   className={"flex w-9/12"}>

        <div className="flex-auto mx-4 mt-0overflow-hidden   ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
            <div className={"mb-1 space-x-3 pb-6"}>
                <button className={"inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}>For this Venue </button>
                <button className={"inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}>For this Town </button>

            </div>
            <table className=" min-w-full">
                <thead className="bg-gray-50">
                <tr className="bg-primary-green ">
                    <th scope="col" className="py-3 pl-4 pr-3 text-center text-sm font-semibold border-l-white border text-white sm:pl-6 rounded-tl-md">
                        Week
                    </th>
                    <th
                        scope="col"
                        className="hidden px-3 py-3 text-center text-sm font-semibold border-l-white border text-white lg:table-cell"
                    >
                        Week of
                    </th>
                    <th
                        scope="col"
                        className="hidden px-3 py-3 text-center text-sm font-semibold border-l-white border text-white sm:table-cell"
                    >
                        Num
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-sm font-semibold text-white rounded-tr-md">
                        S Value
                    </th>
                </tr>
                </thead>
                <tbody className=" bg-white">
                {sales.map((sale, idx) => (
                    <tr key={sale.week} className={idx%2 ===0?"bg-white":"bg-gray-50"}>
                        <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-white sm:w-auto sm:max-w-none sm:pl-6">
                            {sale.week}
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500  text-center lg:table-cell">{sale.weekOf}</td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500  text-center sm:table-cell">{sale.num}</td>
                        <td className="px-3 py-4 text-sm text-gray-500 text-center ">{sale.value}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    </div>

)

export default ArchiveSales



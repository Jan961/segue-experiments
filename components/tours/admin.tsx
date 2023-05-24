import SideNavBar from "../sideMenu";

const activitiy = [
    {code: "C12233", name: "Grand Hall", toen: "townsville", country: "England", seats: "1592", updated: "20",website: "https://www.google.co." },



]

export default function Admin() {
    return (
        <>
            <SideNavBar></SideNavBar>

                <div className="flex flex-auto flex-col bg-yellow-100 w-9/12">
                <div className="flex ">
                    Manage Custom venue data
                </div>
                    <div>Segue provides a rich database of venue information out of the box. If
                        you would like to add your own venues, please enter those below
                    </div>
                    <div>
                        <table className=" min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                    Code
                                </th>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                >
                                    Town
                                </th>
                                <th
                                    scope="col"
                                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                                >
                                    Country
                                </th>
                                <th
                                    scope="col"
                                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                                >

                                    Seats
                                </th>
                                <th
                                    scope="col"
                                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                                >

                                    Last Updated
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Website URL
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {activitiy.map((venue) => (
                                <tr key={venue.code}>
                                    <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                                        {venue.code}
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{venue.name}</td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{venue.toen}</td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{venue.country}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{venue.seats}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{venue.updated}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{venue.website}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

        </>
    )
}

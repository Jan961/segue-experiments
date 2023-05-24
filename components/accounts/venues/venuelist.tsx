import { Venue } from "../../../interfaces";
import VenueListItem from "./venueListItem";
import { useRouter } from "next/router";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  items: Venue[];
};

const VenueList = ({ items }: Props) => {

  const router = useRouter()

  function navigate(id:number){
router.push(`/administration/venues/edit/${encodeURIComponent(id)}`)
  }
  
  return(
  <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
    <table className=" min-w-full divide-y divide-gray-300">
      <thead className=" bg-gray-50">
        <tr className=" bg-primary-orange">
          <th
            scope="col"
            className=" py-3 pr-3 border-r-2 text-center text-sm font-semibold  text-white "
          >
            Code
          </th>
          <th
            scope="col"
            className=" py-3 pr-3 border-r-2 text-center text-sm font-semibold text-white "
          >
            Name of Venue
          </th>
          <th
            scope="col"
            className=" px-3 py-3 border-r-2 text-center text-sm font-semibold  text-white "
          >
            Town
          </th>
          <th
            scope="col"
            className=" px-3 py-3 border-r-2 text-center text-sm font-semibold  text-white "
          >
            Country
          </th>
          <th
            scope="col"
            className=" px-3 py-3 border-r-2 text-center text-sm font-semibold  text-white "
          >
            Seats
          </th>
          <th
            scope="col"
            className=" px-3 py-3 border-r-2 text-center text-sm font-semibold  text-white "
          >
            Last Updated
          </th>
          <th
            scope="col"
            className="  px-3 py-3 text-center text-sm font-semibold  text-white "
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {items &&
          items.map((item, idx) => <VenueListItem key={idx} navigate={navigate} data={item}></VenueListItem>)}
      </tbody>
    </table>
  </div>
)};

export default VenueList;

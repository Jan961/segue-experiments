import * as React from 'react';
import { forceReload } from '../../../utils/forceReload';
import { Show, Venue } from '../../../interfaces';
import axios, { Axios } from 'axios';
import formatDate from 'utils/formatDate';

type Props = {
  data: Venue;
  navigate: (id: number) => void;
};

function softDelete(venueID) {
  axios({
    method: 'POST',
    url: '/api/venue/delete/' + venueID,
    data: venueID,
  })
    .then((response) => {
      console.log('Marked ' + venueID + ' As deleted');
      forceReload();
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}

function trimWebsite(url: string) {
  if (url) {
    return url.length > 34 ? url.slice(0, 34) + '...' : url;
  }
  return 'Null';
}

const UserListItem = ({ data, navigate }: Props) => (
  <tr className={'hover:bg-slate-100 cursor-pointer p-1'} key={data.VenueId}>
    <td
      onClick={() => navigate(data.VenueId)}
      className="whitespace-nowrap py-4 pr-2 text-sm font-medium text-gray-900"
      key={data.Code}
    >
      {data.Code}
    </td>
    <td onClick={() => navigate(data.VenueId)} className=" px-2 py-2 text-sm text-gray-500">
      {data.Name}
    </td>
    <td onClick={() => navigate(data.VenueId)} className=" px-2 py-2 text-sm text-gray-500">
      {data.Town}
    </td>
    <td onClick={() => navigate(data.VenueId)} className=" px-2 py-2 text-sm text-gray-500">
      {data.Country}
    </td>
    <td onClick={() => navigate(data.VenueId)} className=" px-2 py-2 text-sm text-gray-500">
      <a href={`${data.Website}`} target="_blank">
        {data.Seats}
      </a>
    </td>
    <td onClick={() => navigate(data.VenueId)} className=" px-2 py-2 text-sm text-gray-500">
      {formatDate(data.updated_at)}
    </td>
    <td onClick={() => navigate(data.VenueId)} className=" px-2 py-2 text-sm text-gray-500">
      <a href={`${data.Website}`} target="_blank">
        {trimWebsite(data.Website)}
      </a>
    </td>
  </tr>
);

export default UserListItem;

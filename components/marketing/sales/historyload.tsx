import {
  faBook,
  faCopy,
  faEdit,
  faEnvelopeOpen,
  faPlus,
  faSquareXmark,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import upload from '../../../pages/api/fileUpload/upload';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { forceReload } from '../../../utils/forceReload';
import { csvFileService } from '../../../services/csvFileService';
const fs = require('fs');
const { parse } = require('csv-parse');

type cvsItem = {
  TourCode: string;
  VenueCode: string;
  VenueName: string;
  ShowDate: string;
  SalesFiguresDate: string;
  FinalFigures: string;
  NumSchoolSeatsSold: string;
  SoldSchoolSeatsValue: string;
  NumSchoolSeatsReserved: string;
  ReservedSchoolSeatsValue: string;
  NumSeatsSold: string;
  SoldSeatsValue: string;
  NumSeatsReserved: string;
  ReservedSeatsValue: string;
  PromoterHoldsSeats: string;
  PromoterHoldsValue: string;
  VenueHoldsSeats: string;
  VenueHoldsValue: string;
};

const columns = [
  {
    field: 'TourCode',
    headerName: 'TourCode',
  },
  {
    field: 'VenueCode',
    headerName: 'VenueCode',
  },
  {
    field: 'VenueName',
    headerName: 'VenueName',
  },
  {
    field: 'ShowDate',
    headerName: 'ShowDate',
  },
  {
    field: 'SalesFiguresDate',
    headerName: 'SalesFiguresDate',
  },
  {
    field: 'FinalFigures',
    headerName: 'FinalFigures',
  },
  {
    field: 'NumSchoolSeatsSold',
    headerName: 'NumSchoolSeatsSold',
  },
  {
    field: 'SoldSchoolSeatsValue',
    headerName: 'SoldSchoolSeatsValue',
  },
  {
    field: 'NumSchoolSeatsReserved',
    headerName: 'NumSchoolSeatsReserved',
  },
  {
    field: 'ReservedSchoolSeatsValue',
    headerName: 'ReservedSchoolSeatsValue',
  },
  {
    field: 'NumSeatsSold',
    headerName: 'NumSeatsSold',
  },
  {
    field: 'SoldSeatsValue',
    headerName: 'SoldSeatsValue',
  },
  {
    field: 'NumSeatsReserved',
    headerName: 'NumSeatsReserved',
  },
  {
    field: 'ReservedSeatsValue',
    headerName: 'ReservedSeatsValue',
  },
  {
    field: 'PromoterHoldsSeats',
    headerName: 'PromoterHoldsSeats',
  },
  {
    field: 'PromoterHoldsValue',
    headerName: 'PromoterHoldsValue',
  },
  {
    field: 'VenueHoldsSeats',
    headerName: 'VenueHoldsSeats',
  },
  {
    field: 'VenueHoldsValue',
    headerName: 'VenueHoldsValue',
  },
];

const recordCount = 0;

export default function Historyload() {
  const [fileUpload, setFileUpload] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [csvData, setCsvData] = useState<cvsItem[]>([]);
  const [filename, setFilename] = useState('');
  const [csvArray, setCsvArray] = useState([]);

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({
    FileUpload: fileUpload,
  });

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg },
      });
      setInputs({
        FileUpload: fileUpload,
      });
    } else {
      // @ts-ignore
      setStatus(false);
    }
  };

  const handleClose = () => {
    forceReload();
  };

  const handleOnChange = (e) => {
    // e.persist();
    alert(e.target.value);
    if (e.target.files && e.target.files[0]) {
      const i = e.target.files[0];
      setFileUpload(i);
      setCreateObjectURL(URL.createObjectURL(i));
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
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

    if (fileUpload) {
      const fd = new FormData();
      fd.append('file', fileUpload);
      const res = await fetch(`/api/fileUpload/upload`, {
        method: 'POST',
        headers: {},
        body: fd,
      });
      const response = await res.json();

      const fileName = response.data;

      const records = csvFileService.parseCSV(fileName);

      const processCSV = (records, delim = ',') => {
        const headers = records.slice(0, records.indexOf('\n')).split(delim);
        const rows = records.slice(records.indexOf('\n') + 1).split('\n');

        const newArray = rows.map((row) => {
          const values = row.split(delim);
          const eachObject = headers.reduce((obj, header, i) => {
            obj[header] = values[i];
            return obj;
          }, {});
          return eachObject;
        });

        setCsvArray(newArray);
      };
      alert(csvArray.length);
    }

    /**
     *
     * Do what needs to be done to pasrse file contnet
     *
     */

    handleServerResponse(true, 'Thank you, your submitting the file will now be processed.');
    //  handleClose()
  };

  return (
    <div className={'flex bg-pink-50 w-9/12 p-5'}>
      <div className="flex-auto mx-4 mt-0overflow-hidden shadow  ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <div className={'mb-1'}>
          <h1 className={''}>Overwrite sales data</h1>
          <p>
            Select a CSV file to upload. This will overwrite existing sales data for the specified ‘Show/Tour, Venue,
            Date’. If data does not currently exist for that ‘Show/Tour, Venue, Date’ then the information in the CSV
            file will be uploaded to the system without affecting current data.
          </p>
        </div>
        <form onSubmit={handleOnSubmit}>
          <div className="columns-1">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="settour" className=" sr-only">
                Select File
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <label htmlFor="formFile" className="form-label inline-block mb-2 text-gray-700">
                  Default file input example
                </label>
                <label htmlFor="fileUpload" className="">
                  File Upload
                </label>

                <input
                  id="fileUpload"
                  type="file"
                  name="fileUpload"
                  onChange={handleOnChange}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <button
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="submit"
            disabled={status.submitting}
          >
            {!status.submitting ? (!status.submitted ? 'Submit' : 'Submitted') : 'Submitting...'}
          </button>
        </form>
      </div>
    </div>
  );
}

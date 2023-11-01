import { useState } from 'react';

export const csvFileService = {
  parseCSV,
};

const fs = require('fs');
const { parse } = require('csv-parse');

function parseCSV(fileName) {
  console.log(fileName);

  fetch('http://127.0.0.1:3000/segue/logos/' + fileName)
    .then((response) => response.text())
    .then((responseText) => {
      return responseText;
    });
}

function CSVToArray(str, delim) {
  const [csvArray, setCsvArray] = useState([]);

  const processCSV = (str, delim = ',') => {
    const headers = str.slice(0, str.indexOf('\n')).split(delim);
    const rows = str.slice(str.indexOf('\n') + 1).split('\n');

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

  return csvArray;
}

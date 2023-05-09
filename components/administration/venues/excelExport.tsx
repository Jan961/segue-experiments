import {EnvelopeIcon, PhoneIcon} from '@heroicons/react/20/solid'
import {faFileExcel} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import ExcelIcon from "../../global/icons/excelIcon";
import {it} from "date-fns/locale";

import DataGrid, {
    Column,
    Export,
    GroupPanel
} from "devextreme-react/data-grid";

import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import { saveAs } from 'file-saver'
import { Venue } from 'interfaces';

function handleOnClick(data) {
}

interface props {
  items: Venue[]
}
export default function ExcelExport({items}:props){


  return(
      <>
      </>
  )


}
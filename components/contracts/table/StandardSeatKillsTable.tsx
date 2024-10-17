import Table from 'components/core-ui-lib/Table';
import { contractsStyleProps, seatKillsColDefs } from 'components/contracts/tableConfig';
import { useEffect, useRef, useState } from 'react';
import { DealMemoHoldType, StandardSeatRowType } from 'interfaces';
import { isNullOrEmpty, isNullOrUndefined } from 'utils';

export type SeatKillRow = {
  id: number;
  seats: number;
  type: string;
  value: string;
  typeId: number;
};

interface SeatKillProps {
  rowData?: Array<any>;
  holdTypeList: Array<DealMemoHoldType>;
  handleFormUpdate?: (data: SeatKillRow, field: string, rows: any) => void;
  currency?: string;
}

export default function StandardSeatKillsTable({ rowData, holdTypeList, handleFormUpdate, currency }: SeatKillProps) {
  const tableRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [dbData, setDbData] = useState([]);

  const handleChange = (row: SeatKillRow, value: string, field: string) => {
    // get row thats being updated
    const rowToUpdate = rows.find((seatKill) => seatKill.typeId === row.typeId);

    // update the field in the row object
    rowToUpdate[field] = parseInt(value);

    // pass back the new object to the parent form to update the form
    handleFormUpdate(rowToUpdate, field, dbData);
  };

  useEffect(() => {
    if (!isNullOrUndefined(holdTypeList)) {
      if (!isNullOrEmpty(rowData)) {
        const seatKillData: Array<StandardSeatRowType> = rowData.map((seatKill) => {
          return {
            type: holdTypeList.find((hold) => hold.HoldTypeId === seatKill.DMHoldHoldTypeId).HoldTypeName,
            typeId: seatKill.DMHoldHoldTypeId,
            value: seatKill.DMHoldValue,
            seats: seatKill.DMHoldSeats,
            id: seatKill.DMHoldId,
          };
        });

        setRows(seatKillData);

        // if no data exists, create the seat kill object from the hold types
      } else {
        const tableData: Array<StandardSeatRowType> = [];
        const dbData = [];

        holdTypeList.forEach((holdType) => {
          tableData.push({
            type: holdType.HoldTypeName,
            typeId: holdType.HoldTypeId,
            value: '0',
            seats: '0',
            id: null,
          });

          dbData.push({
            DMHoldHoldTypeId: holdType.HoldTypeId,
            DMHoldSeats: 0,
            DMHoldValue: 0,
          });
        });

        setRows(tableData);
        setDbData(dbData);
      }
    }
  }, [rowData]);

  return (
    <>
      <div className="w-full">
        <Table
          columnDefs={seatKillsColDefs(handleChange, currency)}
          rowData={rows}
          styleProps={contractsStyleProps}
          ref={tableRef}
          tableHeight={780}
        />
      </div>
    </>
  );
}

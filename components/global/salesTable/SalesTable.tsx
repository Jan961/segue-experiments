import classNames from 'classnames';
import Table from 'components/core-ui-lib/Table';
import { tileColors } from 'config/global';
import { useEffect, useState } from 'react';
import formatInputDate from 'utils/dateInputFormat';
import { prodComparisionColDefs, salesColDefs } from './tableConfig';
import salesComparison, { SalesComp } from './utils/salesComparision';
import { SalesSnapshot, BookingSelection } from 'types/MarketingTypes';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

export type SalesTableVariant = 'prodComparision' | 'salesSnapshot' | 'salesComparison' | 'venue';

export type ProdComp = {
  venueId: number;
  showCode: string;
};

interface SalesTableProps {
  module: string;
  containerWidth: string;
  containerHeight: string;
  variant: SalesTableVariant;
  data?: Array<BookingSelection> | SalesComp | Array<SalesSnapshot>;
  onCellClick?: (e) => void;
  onCellValChange?: (e) => void;
  cellRenderParams;
  productions;
  booking?;
}

export default function SalesTable({
  module = 'bookings',
  containerHeight,
  containerWidth,
  variant,
  data,
  onCellClick,
  onCellValChange,
  cellRenderParams,
  productions,
  booking
}: Partial<SalesTableProps>) {
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [currency, setCurrency] = useState('£');
  const [height, setHeight] = useState(containerHeight);
  const [width, setWidth] = useState(containerWidth);

  // To be discussed and reviewed by Arun on his return - this is causing more issues than fixes just now
  // const prodColDefs = useMemo(() => {
  //   if (variant === 'prodComparision' && Array.isArray(data)) {
  //     return prodComparisionColDefs(data.length, onCellValChange, cellRenderParams.selected);
  //   }
  //   return [];
  // }, [data, onCellValChange, cellRenderParams, variant]);

  // set table style props based on module
  const styleProps = { headerColor: tileColors[module] };

  const salesSnapshot = (data: Array<SalesSnapshot>) => {
    setCurrency('£');

    // check for school data
    const found = data.find(data => data.schReservations !== "" ||
      data.schReserved !== "" ||
      data.schSeatsSold !== "" ||
      data.schTotalValue !== "");


    let colDefs = salesColDefs(currency, Boolean(found), module === 'bookings' ? false : true, booking, setSalesActivity);
    if (!Boolean(found)) {
      colDefs = colDefs.filter(column => column.headerName !== 'School Sales');
      setWidth('w-[1065px]');
    }

    setColumnDefs(colDefs);
    setRowData(data);
  };

  const productionComparision = (data: Array<BookingSelection>) => {
    const processedBookings = [];

    data.forEach((booking) => {
      const production = productions.find((production) => production.Id === booking.ProductionId);

      processedBookings.push({
        bookingId: booking.BookingId,
        prodName: production.ShowCode + production.Code + ' ' + production.ShowName,
        firstPerfDt: formatInputDate(booking.BookingFirstDate),
        numPerfs: booking.PerformanceCount,
        prodWks: booking.ProductionLengthWeeks,
        prodCode: booking.FullProductionCode,
      });
    });

    setRowData(processedBookings);
    setColumnDefs(prodComparisionColDefs(data.length, onCellValChange, cellRenderParams.selected));
  };

  const setSalesActivity = (type, selected, sale) => {
    switch (type) {
      case 'isSingleSeats': {
        onSingleSeatChange(type, !sale.isSingleSeats, sale, selected);
      }

      case 'isBrochureReleased': {
        onBrochureReleasedChange(type, !sale.isBrochureReleased, sale, selected);
      }

      case 'isNotOnSale': {
        onIsNotOnSaleChange(type, !sale.isNotOnSale, sale, selected);
      }
    }
  }

  const onIsNotOnSaleChange = (key: string, value: boolean, sale: any, selected) => {
    updateSaleSet('updateNotOnSale', selected, sale.weekOf ? format(parseISO(sale.weekOf), 'yyyy-MM-dd') : null, {
      [key.replace('is', 'Set')]: value,
    });

    setRowData((prevSales) =>
      prevSales.map((s) => {
        if (!value) {
          const isOnSale = new Date(s.weekOf) < new Date(sale.weekOf);
          return { ...s, [key]: isOnSale };
        } else {
          const isNotOnSale = new Date(s.weekOf) <= new Date(sale.weekOf);
          return isNotOnSale ? { ...s, [key]: value } : s;
        }
      }),
    );
  };

  const onSingleSeatChange = (key: string, value: boolean, sale: any, selected) => {
    updateSaleSet('updateSingleSeats', selected, sale.weekOf ? format(parseISO(sale.weekOf), 'yyyy-MM-dd') : null, {
      [key.replace('is', 'Set')]: value,
    });
    setRowData((prevSales) =>
      prevSales.map((s) => {
        const isSingleSeat = new Date(s.weekOf) >= new Date(sale.weekOf);
        return isSingleSeat ? { ...s, [key]: value } : s;
      }),
    );
  }

  const onBrochureReleasedChange = (key: string, value: boolean, sale: any, selected) => {
    updateSaleSet('update', selected, sale.weekOf ? format(parseISO(sale.weekOf), 'yyyy-MM-dd') : null, {
      [key.replace('is', 'Set')]: value,
    });
    setRowData((prevSales) =>
      prevSales.map((s) => {
        if (sale.weekOf === s.weekOf && sale.week === s.week) {
          return { ...s, [key]: value };
        }
        return s;
      }),
    );
  };

  const updateSaleSet = (type: string, BookingId: number, SalesFigureDate: string, update: any) => {
    axios
      .put(`/api/marketing/sales/salesSet/${type}`, { BookingId, SalesFigureDate, ...update })
      .catch((error: any) => console.log('failed to update sale', error));
  };

  const exec = async (variant: string, data) => {
    switch (variant) {
      case 'salesComparison': {
        const tableData = await salesComparison(data);
        setColumnDefs(tableData.columnDef);

        setRowData(tableData.rowData);
        break;
      }

      case 'salesSnapshot': {
        salesSnapshot(data);
        break;
      }

      case 'prodComparision': {
        productionComparision(data);
        break;
      }
    }
  };

  useEffect(() => {
    exec(variant, data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  return (
    <div className={classNames(width, height)}>
      <Table
        columnDefs={columnDefs}
        rowData={rowData}
        styleProps={styleProps}
        onCellClicked={onCellClick}
        onCellValueChange={onCellValChange}
      />
    </div>
  );
}

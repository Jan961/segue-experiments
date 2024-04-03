import classNames from 'classnames';
import Table from 'components/core-ui-lib/Table';
import { tileColors } from 'config/global';
import { useEffect, useMemo, useState } from 'react';
import formatInputDate from 'utils/dateInputFormat';
import { prodComparisionColDefs, salesColDefs } from './tableConfig'
import salesComparison, { SalesComp } from './utils/salesComparision';
import { SalesSnapshot, BookingSelection } from 'types/MarketingTypes';

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
  errorMessage?: string;
  primaryBtnTxt?: string;
  showPrimaryBtn?: boolean;
  onPrimaryBtnClick?: () => void;
  secondaryBtnText?: string;
  showSecondaryBtn?: boolean;
  onSecondaryBtnClick?: () => void;
  showExportBtn?: boolean;
  backBtnTxt?: string;
  showBackBtn?: boolean;
  onBackBtnClick?: () => void;
  onCellClick?: (e) => void;
  onCellValChange?: (e) => void;
  cellRenderParams;
  processing?: boolean;
  productions?: any;
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
  productions
}: Partial<SalesTableProps>) {
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [currency, setCurrency] = useState('£');

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
    setRowData(data);
    setCurrency('£'); // currency accessor needs added here or value needs passed to salesColDefs
    setColumnDefs(salesColDefs(currency));
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
    <div className={classNames(containerWidth, containerHeight)}>
      <div>
        <Table
          columnDefs={columnDefs}
          rowData={rowData}
          styleProps={styleProps}
          onCellClicked={onCellClick}
          onCellValueChange={onCellValChange}
        />
      </div>
    </div>
  );
}

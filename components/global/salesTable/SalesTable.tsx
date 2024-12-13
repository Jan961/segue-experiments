import classNames from 'classnames';
import Table from 'components/core-ui-lib/Table';
import { tileColors } from 'config/global';
import { useEffect, useState } from 'react';
import formatInputDate from 'utils/dateInputFormat';
import { prodCompArchColDefs, prodComparisionColDefs, salesColDefs } from './tableConfig';
import salesComparison, { SalesComp } from './utils/salesComparision';
import { SalesSnapshot, BookingSelection } from 'types/MarketingTypes';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { accessMarketingHome } from 'state/account/selectors/permissionSelector';

export type SalesTableVariant = 'prodComparision' | 'salesSnapshot' | 'salesComparison' | 'venue' | 'prodCompArch';

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
  tableHeight?: number;
  salesTableRef?: any;
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
  tableHeight = 0,
  salesTableRef,
}: Partial<SalesTableProps>) {
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [height, setHeight] = useState(containerHeight);
  const [schoolSales, setSchoolSales] = useState<boolean>(false);
  const [numBookings, setNumBookings] = useState<number>(0);
  const [tableWidth, setTableWidth] = useState(containerWidth);
  const [excelStyles, setExcelStyles] = useState([]);
  const permissions = useRecoilValue(accessMarketingHome);

  // set table style props based on module
  const styleProps = { headerColor: tileColors[module] };

  const salesSnapshot = (data: Array<SalesSnapshot>) => {
    // check for school data
    const schoolSalesFound = data.find(
      (data) =>
        data.schReservations !== '' || data.schReserved !== '' || data.schSeatsSold !== '' || data.schTotalValue !== '',
    );
    setSchoolSales(Boolean(schoolSalesFound));

    let colDefs = salesColDefs(
      Boolean(schoolSalesFound),
      module !== 'bookings',
      setSalesActivity,
      permissions.includes('EDIT_ACTIVTIY_FLAGS'),
    );
    if (!schoolSalesFound) {
      colDefs = colDefs.filter((column) => column.headerName !== 'School Sales');
      setHeight(containerHeight);
    }

    setColumnDefs(colDefs);
    setRowData(data);
  };

  const productionComparision = (data: Array<BookingSelection>) => {
    if (data === undefined) {
      return;
    }
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
        hasSalesData: booking.HasSalesData,
      });
    });

    setRowData(processedBookings);
    if (variant === 'prodComparision') {
      setColumnDefs(
        prodComparisionColDefs(
          data.filter((item) => {
            return item.HasSalesData;
          }).length,
          onCellValChange,
          cellRenderParams.selected,
        ),
      );
    } else {
      setColumnDefs(
        prodCompArchColDefs(
          data.filter((item) => {
            return item.HasSalesData;
          }).length,
          onCellValChange,
          cellRenderParams.selected,
        ),
      );
    }
  };

  const prepateStatusUpdate = (type: string, sale: any) => {
    switch (type) {
      case 'SetSingleSeats': {
        const newStatus = !sale.isSingleSeats;

        return {
          updData: { [type]: newStatus },
          status: newStatus,
        };
      }

      case 'SetBrochureReleased': {
        const newStatus = !sale.isBrochureReleased;

        return {
          updData: { [type]: newStatus },
          status: newStatus,
        };
      }

      case 'SetNotOnSale': {
        const newStatus = !sale.isNotOnSale;

        return {
          updData: { [type]: newStatus },
          status: newStatus,
        };
      }
    }
  };

  const setSalesActivity = (field: string, sale: any) => {
    try {
      // prepare object to send to db and object to update frontend
      const updateData = prepateStatusUpdate(field, sale);

      const data = {
        setId: sale.setId,
        dataToUpd: updateData.updData,
      };

      axios.put(`/api/marketing/sales/salesSet/update`, data);

      updSaleStatuses(field, updateData.status, sale);
    } catch (error) {
      console.error(error);
    }
  };

  const updSaleStatuses = (key: string, value: boolean, sale: SalesSnapshot) => {
    const saleDate = new Date(sale.weekOf).getTime();

    setRowData((prevSales) =>
      prevSales.map((s) => {
        const rowDate = new Date(s.weekOf).getTime();

        switch (key) {
          case 'SetSingleSeats':
            return rowDate >= saleDate ? { ...s, isSingleSeats: value } : s;

          case 'SetBrochureReleased':
            return rowDate === saleDate ? { ...s, isBrochureReleased: value } : s;

          case 'SetNotOnSale':
            return rowDate <= saleDate ? { ...s, isNotOnSale: value } : s;

          default:
            return s;
        }
      }),
    );
  };

  const calculateWidth = () => {
    switch (variant) {
      case 'salesSnapshot': {
        const isMarketing = module !== 'bookings';
        let SCHOOLS_WIDTH = 1465;
        let NORMAL_WIDTH = 1085;

        if (!isMarketing) {
          SCHOOLS_WIDTH -= 110;
          NORMAL_WIDTH -= 120;
        }

        const width = schoolSales ? SCHOOLS_WIDTH : NORMAL_WIDTH;
        return width.toString() + 'px';
      }

      case 'salesComparison': {
        const PER_PERFORMANCE_WIDTH = 302;
        const WEEK_COLUMN_WIDTH = 80;
        const widthInt = numBookings * PER_PERFORMANCE_WIDTH + WEEK_COLUMN_WIDTH;
        return `${widthInt}px`;
      }

      case 'prodComparision': {
        return containerWidth;
      }

      case 'prodCompArch': {
        return containerWidth;
      }
    }
  };

  const getGridOptions = () => {
    const gridOptions = { suppressHorizontalScroll: true };
    switch (variant) {
      case 'prodComparision': {
        return {
          ...gridOptions,
          onRowDataUpdated: (params) => {
            params.api.forEachNode((rowNode) => {
              rowNode.id = rowNode.data.prodName;
            });
          },
          getRowNodeId: (data) => data.id,
        };
      }
      case 'salesSnapshot': {
        return {
          ...gridOptions,
          onRowDataUpdated: (params) => {
            params.api.forEachNode((rowNode) => {
              rowNode.id = rowNode.data.week;
            });
          },
          getRowNodeId: (data) => data.id,
        };
      }
      case 'salesComparison': {
        return {
          ...gridOptions,
          onRowDataUpdated: (params) => {
            params.api.forEachNode((rowNode) => {
              rowNode.id = rowNode.data.week;
            });
          },
          getRowNodeId: (data) => data.id,
        };
      }
    }
    return gridOptions;
  };

  const exec = async (variant: string, data) => {
    switch (variant) {
      case 'salesComparison': {
        const tableData = await salesComparison(data);
        setNumBookings(data.bookingIds.length);
        setColumnDefs(tableData.columnDef);
        setRowData(tableData.rowData);
        setExcelStyles(tableData.excelStyles);
        break;
      }

      case 'salesSnapshot': {
        salesSnapshot(data);
        break;
      }

      case 'prodComparision':
      case 'prodCompArch': {
        productionComparision(data);
        break;
      }
    }
  };

  useEffect(() => {
    exec(variant, data);
    const newWidth = calculateWidth();
    setTableWidth(newWidth);
  }, [variant, data, numBookings, schoolSales, containerWidth]);

  const gridOptions = getGridOptions();

  return (
    <div className={classNames('table-container')} style={{ width: tableWidth, height }}>
      <Table
        testId="sales-table"
        ref={salesTableRef}
        columnDefs={columnDefs}
        rowData={rowData}
        styleProps={styleProps}
        onCellClicked={onCellClick}
        onCellValueChange={onCellValChange}
        tableHeight={tableHeight}
        gridOptions={gridOptions}
        excelStyles={excelStyles}
      />
    </div>
  );
}

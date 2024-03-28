import classNames from 'classnames';
import Table from 'components/core-ui-lib/Table';
import { tileColors } from 'config/global';
import { useEffect, useMemo, useState } from 'react';
import formatInputDate from 'utils/dateInputFormat';
import { prodComparisionColDefs, salesColDefs } from './tableConfig';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import Button from 'components/core-ui-lib/Button';
import { Spinner } from 'components/global/Spinner';
import { BookingSelectionView } from 'pages/api/marketing/archivedSales/bookingSelection';
import { SalesComp } from 'components/bookings/modal/VenueHistory';
import salesComparison from './utils/salesComparision';
import { SalesSnapshot } from 'types/MarketingTypes';

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
  data?: Array<BookingSelectionView> | SalesComp | Array<SalesSnapshot>;
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
}

export default function SalesTable({
  module = 'bookings',
  containerHeight,
  containerWidth,
  variant,
  data,
  primaryBtnTxt,
  showPrimaryBtn = false,
  onPrimaryBtnClick,
  secondaryBtnText,
  showSecondaryBtn = false,
  onSecondaryBtnClick,
  showExportBtn = false,
  backBtnTxt,
  showBackBtn,
  onBackBtnClick,
  onCellClick,
  onCellValChange,
  cellRenderParams,
  processing,
  errorMessage,
}: Partial<SalesTableProps>) {
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const { productions } = useRecoilValue(productionJumpState);
  const [currency, setCurrency] = useState('£');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const prodColDefs = useMemo(() => {
    if (variant === 'prodComparision' && Array.isArray(data)) {
      return prodComparisionColDefs(data.length, onCellValChange, cellRenderParams.selected);
    }
    return [];
  }, [data, onCellValChange, cellRenderParams, variant]);

  // set table style props based on module
  const styleProps = { headerColor: tileColors[module] };

  const salesSnapshot = (data: Array<SalesSnapshot>) => {
    setRowData(data);
    setCurrency('£'); // currency accessor needs added here or value needs passed to salesColDefs
    setColumnDefs(salesColDefs(currency));
  };

  const productionComparision = (data: Array<BookingSelectionView>) => {
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
    setColumnDefs(prodColDefs);
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

  useEffect(() => {
    setLoading(processing);
  }, [processing]);

  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

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

        <div className="float-right flex flex-row mt-5 py-2">
          <div className="text text-base text-primary-red mr-12">{error}</div>

          {loading && <Spinner size="sm" className="mr-3" />}

          {showBackBtn && (
            <div>
              <Button className="w-32" variant="secondary" text={backBtnTxt} onClick={onBackBtnClick} />
            </div>
          )}

          {showSecondaryBtn && (
            <div>
              <Button
                className="ml-4 w-32"
                onClick={onSecondaryBtnClick}
                variant={showExportBtn ? 'primary' : 'secondary'}
                text={secondaryBtnText}
                iconProps={showExportBtn && { className: 'h-4 w-3' }}
                sufixIconName={showExportBtn && 'excel'}
              />
            </div>
          )}

          {showPrimaryBtn && (
            <div>
              <Button
                className="ml-4 w-32 mr-1"
                variant="primary"
                text={primaryBtnTxt}
                onClick={() => onPrimaryBtnClick()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { gridOptions } from 'components/bookings/modal/GapSuggest';
import { styleProps } from 'components/bookings/table/tableConfig';
import { Button, PopupModal, Table, notify } from 'components/core-ui-lib';
import { updateConversionRate } from 'components/shows/request';
import { currencyConversionTableConfig } from 'components/shows/table/tableConfig';
import { ConversionRateDTO, ICurrency, ICurrencyCountry } from 'interfaces';
import { useRouter } from 'next/router';
import { unique } from 'radash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accessShows } from 'state/account/selectors/permissionSelector';
import { debug } from 'utils/logging';

interface CurrencyConversionModalProps {
  title: string;
  visible: boolean;
  conversionRates: ConversionRateDTO[];
  currencyCountryLookup: Record<string, ICurrencyCountry[]>;
  currencyLookup: Record<string, ICurrency>;
  onClose: () => void;
}
const CurrencyConversionModal = ({
  conversionRates,
  onClose,
  title,
  currencyCountryLookup = {},
  currencyLookup = {},
  visible,
}: CurrencyConversionModalProps) => {
  const permissions = useRecoilValue(accessShows);
  const router = useRouter();
  const tableRef = useRef(null);
  const [editMap, setEditMap] = useState<Record<string, number>>({});
  const rowsData = useMemo(
    () =>
      conversionRates?.map?.(({ Rate, FromCurrencyCode, ToCurrencyCode, ...others }) => {
        const allRegions = currencyCountryLookup[FromCurrencyCode].flatMap(({ regionList }) => regionList);
        const fromCurrency = currencyLookup[FromCurrencyCode];
        const toCurrency = currencyLookup[ToCurrencyCode];
        const uniqueRegions = unique(allRegions, ({ id }) => id);
        const countries = currencyCountryLookup[FromCurrencyCode].map(({ code }) => code);
        return {
          ...others,
          rate: Rate,
          currency: `${fromCurrency.code} | ${fromCurrency.name}`,
          countries: unique(countries).join(', '),
          exchange: {
            toSymbol: toCurrency?.symbolUniCode,
            fromCurrencyCode: fromCurrency.code,
          },
          region: uniqueRegions.map(({ name }) => name).join(', '),
          ToCurrency: toCurrency,
          FromCurrency: fromCurrency,
        };
      }),
    [conversionRates],
  );

  const handleCellChanges = useCallback(
    (e) => {
      if (e.oldValue === e.newValue) return;
      debug('handleCellChanges', e);
      setEditMap((prev) => ({ ...prev, [e.data.Id]: e.newValue }));
    },
    [setEditMap],
  );

  const onSubmit = useCallback(() => {
    const updates = Object.entries(editMap).map(([key, value]) => ({ id: parseInt(key, 10), rate: value }));
    notify.promise(
      updateConversionRate({ updates }).then(() => {
        router.replace(router.asPath);
        onClose();
      }),
      {
        loading: 'Updating conversion rates',
        success: 'Updated conversion rates successfully',
        error: 'Error updating conversion rates',
      },
    );
  }, [editMap, onClose]);

  return (
    <PopupModal
      hasOverlay={false}
      titleClass="text-xl text-primary-navy font-bold"
      title={title}
      show={visible}
      onClose={onClose}
    >
      <h4 className="text-xl text-primary-navy font-bold mt-3 mb-5">
        Currency Conversion Rates: Currencies based on selected Region(s)
      </h4>
      <div className=" w-[750px] lg:w-[1047px] h-full flex flex-col ">
        <Table
          ref={tableRef}
          columnDefs={currencyConversionTableConfig(permissions)}
          rowData={rowsData}
          styleProps={styleProps}
          gridOptions={gridOptions}
          onCellValueChange={handleCellChanges}
          headerHeight={30}
        />
      </div>
      <div className="pt-3 w-full flex items-center justify-end gap-2">
        <Button onClick={onClose} className="float-right px-4 w-33 font-normal" variant="secondary" text="Cancel" />
        <Button
          className="float-right px-4 font-normal w-33 text-center"
          variant="primary"
          iconProps={{ className: 'h-4 w-3' }}
          text="Save and Close"
          onClick={onSubmit}
          disabled={!permissions.includes('EDIT_CURRENCY_CONVERSION')}
        />
      </div>
    </PopupModal>
  );
};

export default CurrencyConversionModal;

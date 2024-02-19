import { NewBookingColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { useWizard } from 'react-use-wizard';

const rows = [
  {
    date: 'Mon 02/01/23',
    perf: true,
    dayType: 'Performance',
    venue: 'Venue A',
    noPerf: 5,
    times: '23:40',
    bookingStatus: 'Confirmed',
    pencilNo: '1',
    notes: 'Lorem ipsum',
  },
  {
    date: 'Mon 02/01/23',
    perf: false,
    dayType: 'Declared Holiday',
    venue: 'Venue A',
    noPerf: 5,
    times: '23:40',
    bookingStatus: 'Pencilled',
    pencilNo: '2',
    notes: 'Lorem ipsum',
  },
  {
    date: 'Mon 02/01/23',
    perf: false,
    dayType: 'Declared Holiday',
    venue: 'Venue A',
    noPerf: 5,
    times: '23:40',
    bookingStatus: 'Pencilled',
    pencilNo: '2',
    notes: 'Lorem ipsum',
  },
  {
    date: 'Mon 02/01/23',
    perf: false,
    dayType: 'Declared Holiday',
    venue: 'Venue A',
    noPerf: 5,
    times: '23:40',
    bookingStatus: 'Pencilled',
    pencilNo: '2',
    notes: 'Lorem ipsum',
  },
  {
    date: 'Mon 02/01/23',
    perf: false,
    dayType: 'Declared Holiday',
    venue: 'Venue A',
    noPerf: 5,
    times: '23:40',
    bookingStatus: 'Pencilled',
    pencilNo: '2',
    notes: 'Lorem ipsum',
  },
  {
    date: 'Mon 02/01/23',
    perf: false,
    dayType: 'Declared Holiday',
    venue: 'Venue A',
    noPerf: 5,
    times: '23:40',
    bookingStatus: 'Pencilled',
    pencilNo: '2',
    notes: 'Lorem ipsum',
  },
];

export default function NewBookingDetails() {
  // const [rows, setRows] = useState([]);
  // const [showModal, setShowModal] = useState<boolean>(false);
  // const [productionItem, setProductionItem] = useState(null);
  const { nextStep, previousStep } = useWizard();
  // const setViewHeader = useSetRecoilState(newBookingState);

  const gridOptions = {
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 50,
      editable: true,
    },
  };
  const goToPreviousStep = () => {
    previousStep();
  };
  // const handleCellClick = (e) => {
  //   if (e.column.colId === 'note') {
  //     setProductionItem(e.data);
  //     setShowModal(true);
  //   }
  // };

  const getRowStyle = (params) => {
    const zIndex = rows.length - params.node.rowIndex; // Calculate z-index in descending order

    return {
      zIndex: zIndex.toString(), // Convert the zIndex to string and apply
    };
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <h3 className="text-lg font-bold leading-6 undefined pb-2"> MTM223 Menopause the Musical 2</h3>
        <div className="flex flex-row gap-2">
          <p className="min-w-fit text-primary-dark-blue">This is a run of dates. Y/N</p>
          {/* <TimeInput label="hhgffghffgfg" value={'22:00'} name="time" onChange={() => ''} disabled /> */}
          {/* <Checkbox name="date" /> */}
        </div>
      </div>
      <div className=" w-[700px] lg:w-[1154px] h-[440px] z-[999] flex flex-col ">
        <Table
          columnDefs={NewBookingColumnDefs}
          rowData={rows}
          styleProps={styleProps}
          gridOptions={gridOptions}
          // onCellClicked={handleCellClick}
          getRowStyle={getRowStyle}
        />

        <div className="py-3 w-full grid grid-cols-2 items-center  justify-end  justify-items-end gap-3">
          <Button className=" w-33  place-self-start  " text="Check Mileage" onClick={() => nextStep()} />
          <div className="flex gap-4">
            <Button className="w-33" variant="secondary" text="Back" onClick={goToPreviousStep} />
            <Button className="w-33 " variant="secondary" text="Cancel" onClick={close} />
            <Button className=" w-33" text="Preview Booking" onClick={() => nextStep()} />
          </div>
        </div>
      </div>
    </div>
  );
}

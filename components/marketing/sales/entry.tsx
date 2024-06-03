import { useEffect, useState } from 'react';
import { Button, Checkbox, Table, TextArea, TextInput } from 'components/core-ui-lib';
import useAxios from 'hooks/useAxios';
import { salesEntryColDefs, styleProps } from '../table/tableConfig';

interface HoldType {
  name: string;
  type: string;
  seq: number;
}

export default function Entry() {
  const [genSeatsSold, setGenSeatsSold] = useState('');
  const [genSeatsSoldVal, setGenSeatsSoldVal] = useState('');
  const [genSeatsReserved, setGenSeatsReserved] = useState('');
  const [genSeatsReservedVal, setGenSeatsReservedVal] = useState('');
  const [schSeatsSold, setSchSeatsSold] = useState('');
  const [schSeatsSoldVal, setSchSeatsSoldVal] = useState('');
  const [schSeatsReserved, setSchSeatsReserved] = useState('');
  const [schSeatsReservedVal, setSchSeatsReservedVal] = useState('');
  // const [currency, setCurrency] = useState('£');
  const [schoolSalesNotRequired, setSchoolSalesNotRequired] = useState(false);
  const [bookingSaleNotes, setBookingSaleNotes] = useState('');
  const [holdData, setHoldData] = useState([]);
  const [compData, setCompData] = useState([]);
  const [formReady, setFormReady] = useState(false);

  const { fetchData } = useAxios();

  const handleUpdate = () => {
    console.log('update');
  };

  const handleTableUpdate = (value, data, type, field) => {
    if (type === 'Holds') {
      const holdRecIndex = holdData.findIndex((rec) => rec.name === data.name);
      const tempHoldRecs = [...holdData];

      if (holdRecIndex !== -1) {
        tempHoldRecs[holdRecIndex] = { ...tempHoldRecs[holdRecIndex], [field]: value };
      }

      setHoldData(tempHoldRecs);
    }
  };

  const handleCopy = () => {
    console.log('copy');
  };

  const handleCancel = () => {
    console.log('cancel');
  };

  useEffect(() => {
    const initForm = async () => {
      try {
        const data = await fetchData({
          url: '/api/marketing/holdType/read',
          method: 'POST',
        });

        if (typeof data === 'object') {
          const holdTypes = data as Array<HoldType>;
          const tempData = holdTypes.map((hold) => ({
            name: hold.name,
            seats: 0,
            value: 0.0,
          }));
          setHoldData(tempData);
          setCompData(tempData);
        }
      } catch (error) {
        console.log('error is: ' + error);
      }
    };

    if (!formReady) {
      initForm();
      setFormReady(true);
    }
  }, [formReady, fetchData]);

  return (
    <div className="flex flex-row w-full gap-8">
      <div className="flex flex-col">
        <div className="w-[849px] h-[275px] bg-primary-green/[0.30] rounded-xl mt-5 p-4">
          <div className="leading-6 text-xl text-primary-input-text font-bold mt-1 flex-row">General</div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-col mr-[20px]">
              <div className="flex flex-row mt-4">
                <div className="flex flex-col">
                  <div className="text-primary-dark-blue base font-bold mr-[52px]">Seats Sold</div>
                </div>
                <TextInput
                  className="w-[137px] h-[31px] flex flex-col -mt-1"
                  placeholder="Enter Seats"
                  id="genSeatsSold"
                  value={genSeatsSold}
                  onChange={(event) => setGenSeatsSold(event.target.value)}
                />
              </div>

              <div className="flex flex-row mt-4">
                <div className="flex flex-col">
                  <div className="text-primary-dark-blue base font-bold mr-5">Reserved Seats</div>
                </div>
                <TextInput
                  className="w-[137px] h-[31px] flex flex-col -mt-1"
                  placeholder="Enter Seats"
                  id="genSeatsReserved"
                  value={genSeatsReserved}
                  onChange={(event) => setGenSeatsReserved(event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-row mt-4">
                <div className="flex flex-col">
                  <div className="text-primary-dark-blue base font-bold mr-[52px]">Seats Sold Value</div>
                </div>
                <TextInput
                  className="w-[137px] h-[31px] flex flex-col -mt-1"
                  placeholder="Enter Value"
                  id="genSeatsSoldVal"
                  value={genSeatsSoldVal}
                  onChange={(event) => setGenSeatsSoldVal(event.target.value)}
                />
              </div>

              <div className="flex flex-row mt-4">
                <div className="flex flex-col">
                  <div className="text-primary-dark-blue base font-bold mr-5">Reserved Seats Value</div>
                </div>
                <TextInput
                  className="w-[137px] h-[31px] flex flex-col -mt-1"
                  placeholder="Enter Value"
                  id="genSeatsReservedVal"
                  value={genSeatsReservedVal}
                  onChange={(event) => setGenSeatsReservedVal(event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col mt-4 justify-end">
              <div className="flex flex-col items-end">
                <Button
                  className="w-[132px] flex flex-row mb-2"
                  variant="primary"
                  text="Update"
                  onClick={handleUpdate}
                />
                <Button
                  className="w-[211px] flex flex-row"
                  variant="primary"
                  text="Copy Previous Week's Sales"
                  onClick={handleCopy}
                />
              </div>
            </div>
          </div>

          <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">Schools</div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-col mr-[20px]">
              <div className="flex flex-row mt-4">
                <div className="flex flex-col">
                  <div className="text-primary-dark-blue base font-bold mr-[52px]">Seats Sold</div>
                </div>
                <TextInput
                  className="w-[137px] h-[31px] flex flex-col -mt-1"
                  placeholder="Enter Seats"
                  id="schSeatsSold"
                  value={schSeatsSold}
                  onChange={(event) => setSchSeatsSold(event.target.value)}
                />
              </div>

              <div className="flex flex-row mt-4">
                <div className="flex flex-col">
                  <div className="text-primary-dark-blue base font-bold mr-5">Reserved Seats</div>
                </div>
                <TextInput
                  className="w-[137px] h-[31px] flex flex-col -mt-1"
                  placeholder="Enter Seats"
                  id="schSeatsReserved"
                  value={schSeatsReserved}
                  onChange={(event) => setSchSeatsReserved(event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-row mt-4">
                <div className="flex flex-col">
                  <div className="text-primary-dark-blue base font-bold mr-[52px]">Seats Sold Value</div>
                </div>
                <TextInput
                  className="w-[137px] h-[31px] flex flex-col -mt-1"
                  placeholder="Enter Value"
                  id="schSeatsSoldVal"
                  value={schSeatsSoldVal}
                  onChange={(event) => setSchSeatsSoldVal(event.target.value)}
                />
              </div>

              <div className="flex flex-row mt-4">
                <div className="flex flex-col">
                  <div className="text-primary-dark-blue base font-bold mr-5">Reserved Seats Value</div>
                </div>
                <TextInput
                  className="w-[137px] h-[31px] flex flex-col -mt-1"
                  placeholder="Enter Value"
                  id="schSeatsReservedVal"
                  value={schSeatsReservedVal}
                  onChange={(event) => setSchSeatsReservedVal(event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col mt-4 justify-end">
              <div className="flex flex-col items-end">
                <div className="flex flex-row mb-5">
                  <div className="text-base text-primary-dark-blue font-bold flex flex-col mr-3">
                    School Sales not required
                  </div>
                  <div className="flex flex-col">
                    <Checkbox
                      id="Marketing Plans Received"
                      name="Marketing Plans Received"
                      checked={schoolSalesNotRequired}
                      onChange={(e) => setSchoolSalesNotRequired(e.target.checked)}
                      className="w-[19px] h-[19px]"
                    />
                  </div>
                </div>

                <Button className="w-[132px] flex flex-row" variant="secondary" text="Cancel" onClick={handleCancel} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row w-[849px] gap-6 mt-5">
          <div className="flex flex-col w-[415px]">
            <Table
              columnDefs={salesEntryColDefs('Holds', handleTableUpdate)}
              rowData={holdData}
              styleProps={styleProps}
            />
          </div>

          <div className="flex flex-col w-[415px]">
            <Table
              columnDefs={salesEntryColDefs('Comps', handleTableUpdate)}
              rowData={compData}
              styleProps={styleProps}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">Booking Sales Notes</div>

        <TextArea
          className="mt-2 h-[963px] w-[473px]"
          value={bookingSaleNotes}
          placeholder="Notes Field"
          onChange={(e) => setBookingSaleNotes(e.target.value)}
        />
      </div>
    </div>
  );
}

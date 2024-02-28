import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { useWizard } from 'react-use-wizard';
import { TForm } from '../reducer';

type PreviewDataItem = {
  production: string;
  date: string;
  week: string;
  venue: number;
  town: string;
  perf: boolean;
  dayType: string;
  bookingStatus: string;
  capacity: number;
  noPerf: number;
  perfTimes: string;
  miles: string;
  travelTime: string;
};
type NewBookingDetailsProps = {
  formData: TForm;
  productionCode: string;
};
export default function PreviewNewBooking({ formData, productionCode }: NewBookingDetailsProps) {
  console.log('data to preview booking :>> ', formData);
  const { fromDate, toDate } = formData;

  // Assuming formData.fromDate and formData.toDate are valid date strings in the format 'YYYY-MM-DD'
  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);

  // Calculate past 5 days from the form date
  const pastStartDate = new Date(startDate);
  pastStartDate.setDate(startDate.getDate() - 5);

  // Calculate future 5 days from the to date
  const futureEndDate = new Date(endDate);
  futureEndDate.setDate(endDate.getDate() + 5);

  console.log('Past Start Date:', pastStartDate.toISOString().split('T')[0]); // Output: Past Start Date: YYYY-MM-DD
  console.log('Future End Date:', futureEndDate.toISOString().split('T')[0]); // Output: Future End Date: YYYY-MM-DD

  const dummyData: PreviewDataItem[] = [
    {
      production: '1',
      date: '2024-01-01',
      week: 'Week 1',
      venue: 1,
      town: 'City 1',
      perf: true,
      dayType: 'Performance',
      bookingStatus: 'Confirmed',
      capacity: 1000,
      noPerf: 2,
      perfTimes: '7:00 PM - 9:00 PM',
      miles: '50',
      travelTime: '1 hour',
    },
    {
      production: '2',
      date: '2024-01-02',
      week: 'Week 1',
      venue: 2,
      town: 'City 2',
      perf: false,
      dayType: 'Rehearsal',
      bookingStatus: 'Pending',
      capacity: 800,
      noPerf: 0,
      perfTimes: '',
      miles: '30',
      travelTime: '45 minutes',
    },
    {
      production: '3',
      date: '2024-01-03',
      week: 'Week 1',
      venue: 3,
      town: 'City 3',
      perf: true,
      dayType: 'Performance',
      bookingStatus: 'Confirmed',
      capacity: 1200,
      noPerf: 1,
      perfTimes: '6:30 PM - 8:30 PM',
      miles: '40',
      travelTime: '50 minutes',
    },
    {
      production: '4',
      date: '2024-01-04',
      week: 'Week 1',
      venue: 4,
      town: 'City 4',
      perf: false,
      dayType: 'Travel Day',
      bookingStatus: 'Confirmed',
      capacity: 900,
      noPerf: 0,
      perfTimes: '',
      miles: '60',
      travelTime: '1.5 hours',
    },
    // Add more dummy data as needed
  ];
  const { nextStep, previousStep } = useWizard();
  const goToPreviousStep = () => {
    previousStep();
  };
  return (
    <>
      <div className="flex justify-between">
        <div className="text-primary-navy text-xl my-2 font-bold">{productionCode}</div>
      </div>
      <div className="w-[700px] lg:w-[1386px] h-full  z-[999] flex flex-col ">
        <Table rowData={dummyData} columnDefs={columnDefs} styleProps={styleProps} />

        <div className="py-8 w-full flex justify-end  gap-3 float-right">
          <div className="flex gap-4">
            <Button className="w-33" variant="secondary" text="Back" onClick={goToPreviousStep} />
            <Button className=" w-33  " text="Accept" onClick={() => nextStep()} />
          </div>
        </div>
      </div>
    </>
  );
}

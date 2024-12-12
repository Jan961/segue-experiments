import { useEffect, useMemo, useState } from 'react';
import { Button, ConfirmationDialog, Table } from 'components/core-ui-lib';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { Spinner } from 'components/global/Spinner';
import { currencyState } from 'state/global/currencyState';
import { globalActivityColDefs, styleProps } from '../table/tableConfig';
import GlobalActivityModal, { ActivityModalVariant, GlobalActivity } from '../modal/GlobalActivityModal';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { startOfDay } from 'date-fns';
import { filterState } from 'state/marketing/filterState';
import fuseFilter from 'utils/fuseFilter';
import axios from 'axios';
import { accessMarketingHome } from 'state/account/selectors/permissionSelector';
import { compareDatesWithoutTime } from 'services/dateService';

type GlobalActivitiesResponse = {
  activities: GlobalActivity[];
  activityTypes: Array<SelectOption>;
};

type TourResponse = {
  data: Array<SelectOption>;
  frequency: string;
};

const GlobalActivityView = () => {
  const permissions = useRecoilValue(accessMarketingHome);
  const [loading, setLoading] = useState<boolean>(false);
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const currency = useRecoilValue(currencyState);
  const [activityTypes, setActivityTypes] = useState<Array<SelectOption>>(null);
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [showGlobalActivityModal, setShowGlobalActivityModal] = useState<boolean>(false);
  const [actModalVariant, setActModalVariant] = useState<ActivityModalVariant>();
  const [actRow, setActRow] = useState(null);
  const bookings = useRecoilValue(bookingJumpState);
  const [tourWeeks, setTourWeeks] = useState([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [allRows, setAllRows] = useState([]);
  const filter = useRecoilValue(filterState);

  const venueList = useMemo(() => {
    try {
      const venues = bookings.bookings.map((option) => {
        return {
          ...option.Venue,
          date: new Date(option.Date),
        };
      });

      venues.unshift({
        Name: 'Charge to this and all future weeks',
        selected: false,
        Code: 'SELECT',
        Id: 0,
        Website: '',
      });

      return venues;
    } catch (error) {
      console.log(error);
    }
  }, [bookings.bookings]);

  const getTourWeeks = async (productionId) => {
    const response = await axios.get(`/api/marketing/sales/tourWeeks/${productionId.toString()}`);

    if (typeof response.data === 'object') {
      const tourData = response.data as TourResponse;
      setTourWeeks(tourData.data);
    }
  };

  const showAddActivity = () => {
    setActModalVariant('add');
    setShowGlobalActivityModal(true);
  };

  const deleteGlobalActivity = async () => {
    await axios.post('/api/marketing/global-activities/delete', actRow);

    const rowIndex = rowData.findIndex((gba) => gba.id === actRow.Id);
    const newRows = [...rowData];
    if (rowIndex !== -1) {
      newRows.splice(rowIndex, 1);
    }

    setRowData(newRows);
    setAllRows(newRows);
    setShowConfirm(false);
  };

  const updateGlobalActivity = async (type: string, data: GlobalActivity) => {
    if (type === 'add') {
      try {
        const response = await axios.post('/api/marketing/global-activities/create', data);

        const tableRow = {
          actName: data.Name,
          actType: activityTypes.find((type) => type.value === data.ActivityTypeId).text,
          actDate: data.Date,
          followUpCheck: data.FollowUpRequired,
          cost: data.Cost,
          notes: data.Notes,
          followUpDt: data.DueByDate,
          id: response.data.Id,
        };

        setRowData([...rowData, tableRow]);
        setAllRows([...rowData, tableRow]);
        setShowGlobalActivityModal(false);
      } catch (error) {
        console.log(error);
      }
    } else if (type === 'edit') {
      await axios.post('/api/marketing/global-activities/update', data);

      const updatedRow = {
        actName: data.Name,
        actType: activityTypes.find((type) => type.value === data.ActivityTypeId).text,
        actDate: data.Date,
        followUpCheck: data.FollowUpRequired,
        cost: data.Cost,
        notes: data.Notes,
        followUpDt: data.DueByDate,
        id: data.Id,
      };

      const rowIndex = rowData.findIndex((act) => act.id === data.Id);
      const newRows = [...rowData];
      newRows[rowIndex] = updatedRow;

      setRowData(newRows);
      setAllRows(newRows);

      setShowGlobalActivityModal(false);
    }
  };

  const toggleModal = async (type: ActivityModalVariant, data: any) => {
    try {
      const response = await axios.get(`/api/marketing/global-activities/production/${productionId.toString()}`);

      if (typeof response.data === 'object') {
        const globalActivities = response.data as GlobalActivitiesResponse;
        const tempRow = {
          Name: data.actName,
          ActivityTypeId: globalActivities.activityTypes.find((type) => type.text === data.actType).value,
          Cost: data.cost,
          Date: data.actDate === '' ? null : startOfDay(data.actDate),
          FollowUpRequired: data.followUpCheck,
          Notes: data.notes,
          ProductionId: productionId,
          DueByDate: data.followUpCheck ? data.followUpDt : null,
          Id: data.id,
        };

        setActRow(tempRow);

        if (type === 'add' || type === 'edit') {
          setActModalVariant(type);
          setShowGlobalActivityModal(true);
        } else if (type === 'delete') {
          setShowConfirm(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGlobalActivities = async () => {
    try {
      const response = await axios.get(`/api/marketing/global-activities/production/${productionId.toString()}`);

      if (typeof response.data === 'object') {
        const globalActivities = response.data as GlobalActivitiesResponse;

        setActivityTypes(globalActivities.activityTypes);

        const globalRows = globalActivities.activities.map((activity) => {
          return {
            actName: activity.Name,
            actType: globalActivities.activityTypes.find((type) => type.value === activity.ActivityTypeId).text,
            actDate: startOfDay(new Date(activity.Date)),
            followUpCheck: activity.FollowUpRequired,
            cost: activity.Cost,
            notes: activity.Notes,
            followUpDt: activity.DueByDate,
            id: activity.Id,
          };
        });

        const sortedActivities = globalRows.sort(
          (a, b) => new Date(a.actDate).getTime() - new Date(b.actDate).getTime(),
        );

        setRowData(sortedActivities);
        setAllRows(sortedActivities);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getGlobalActivities();
    getTourWeeks(productionId);
    setColDefs(
      globalActivityColDefs(
        toggleModal,
        currency.symbol,
        permissions.includes('ACCESS_EDIT_GLOBAL_ACTIVITY'),
        permissions.includes('DELETE_GLOBAL_ACTIVITY'),
      ),
    );
  }, [productionId]);

  useEffect(() => {
    let filterRows = allRows;

    if (filter.searchText && filter.searchText !== '') {
      filterRows = fuseFilter(filterRows, filter.searchText, ['actName', 'actType', 'notes']);
    }

    filterRows = filterRows.filter((gba) => {
      return (
        compareDatesWithoutTime(filter.startDate, gba.actDate, '<=') &&
        compareDatesWithoutTime(filter.endDate, gba.actDate, '>=')
      );
    });

    setRowData(filterRows);
  }, [filter]);

  return (
    <div>
      {loading ? (
        <Spinner size="lg" className="mt-[40px] mr-3 -mb-1" />
      ) : (
        <div>
          <div className="flex flex-row w-full justify-end">
            <Button
              text="Add New Activity"
              className="w-[160px] mb-5"
              onClick={() => showAddActivity()}
              disabled={!permissions.includes('ADD_NEW_GLOBAL_ACTIVITY')}
            />
          </div>

          <Table
            columnDefs={colDefs}
            rowData={rowData}
            styleProps={styleProps}
            gridOptions={{ suppressHorizontalScroll: true }}
          />
        </div>
      )}
      {showGlobalActivityModal && (
        <GlobalActivityModal
          show={showGlobalActivityModal}
          onCancel={() => setShowGlobalActivityModal(false)}
          variant={actModalVariant}
          activityTypes={activityTypes}
          onSave={(variant, data) => updateGlobalActivity(variant, data)}
          data={actRow}
          productionId={productionId}
          productionCurrency={currency.symbol}
          venues={venueList}
          tourWeeks={tourWeeks}
        />
      )}

      <ConfirmationDialog
        variant="delete"
        show={showConfirm}
        onYesClick={deleteGlobalActivity}
        onNoClick={() => setShowConfirm(false)}
        hasOverlay={false}
      />
    </div>
  );
};

GlobalActivityView.displayName = 'GlobalActivityView';
export default GlobalActivityView;

import { useEffect, useState } from 'react';
import { Button, Table } from 'components/core-ui-lib';
import useAxios from 'hooks/useAxios';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { Spinner } from 'components/global/Spinner';
import { currencyState } from 'state/marketing/currencyState';
import { GlobalActivityDTO } from 'interfaces';
import { globalActivityColDefs, styleProps } from '../table/tableConfig';
import GlobalActivityModal, { ActivityModalVariant } from '../modal/GlobalActivityModal';
import { SelectOption } from 'components/core-ui-lib/Select/Select';

type GlobalActivitiesResponse = {
  activities: GlobalActivityDTO[];
  activityTypes: Array<SelectOption>;
};

export interface SalesEntryRef {
  resetForm: (salesWeek: string) => void;
}

const Global = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const currency = useRecoilValue(currencyState);
  const [activityTypes, setActivityTypes] = useState<Array<SelectOption>>(null);
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [showGlobalActivityModal, setShowGlobalActivityModal] = useState<boolean>(false);
  const [actModalVariant, setActModalVariant] = useState<ActivityModalVariant>();
  const [actRow, setActRow] = useState(null);

  const { fetchData } = useAxios();

  const showAddActivity = () => {
    setActModalVariant('add');
    setShowGlobalActivityModal(true);
  };

  const updateGlobalActivity = async (type: string, data: any) => {
    if (type === 'add') {
      try {
        const inputData: GlobalActivityDTO = {
          ActivityTypeId: data.ActivityTypeId,
          Cost: data.Cost,
          Date: new Date(data.Date),
          FollowUpRequired: data.FollowUpRequired,
          Name: data.Name,
          Notes: data.Notes,
          ProductionId: data.ProductionId,
          DueByDate: data.DueByDate,
        };

        await fetchData({
          url: '/api/marketing/globalActivities/create',
          method: 'POST',
          data: inputData,
        });

        const tableRow = {
          actName: data.Name,
          actType: activityTypes.find((type) => type.value === data.ActivityTypeId).text,
          actDate: data.Date,
          followUpCheck: data.FollowUpRequired,
          cost: data.Cost,
          notes: data.Notes,
          followUpDt: data.DueByDate,
        };

        setRowData([...rowData, tableRow]);
        setShowGlobalActivityModal(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleModal = async (type: ActivityModalVariant, data: any) => {
    const actTypeResponse = await fetchData({
      url: '/api/marketing/globalActivities/' + productionId.toString(),
      method: 'POST',
    });

    if (typeof actTypeResponse === 'object') {
      const globalActivities = actTypeResponse as GlobalActivitiesResponse;

      const tempRow = {
        Name: data.actName,
        ActivityTypeId: globalActivities.activityTypes.find((type) => type.text === data.actType).value,
        Cost: data.cost,
        Date: new Date(data.actDate),
        FollowUpRequired: data.followUpCheck,
        Notes: data.notes,
        ProductionId: productionId,
        DueByDate: data.followUpDt,
      };

      setActRow(tempRow);

      setActModalVariant(type);
      setShowGlobalActivityModal(true);
    }
  };

  const getGlobalActivities = async () => {
    try {
      const data = await fetchData({
        url: '/api/marketing/globalActivities/' + productionId.toString(),
        method: 'POST',
      });

      if (typeof data === 'object') {
        const globalActivities = data as GlobalActivitiesResponse;

        setActivityTypes(globalActivities.activityTypes);

        setColDefs(globalActivityColDefs(toggleModal, currency.symbol));
        const globalRows = globalActivities.activities.map((activity) => {
          return {
            actName: activity.Name,
            actType: globalActivities.activityTypes.find((type) => type.value === activity.ActivityTypeId).text,
            actDate: activity.Date,
            followUpCheck: activity.FollowUpRequired,
            cost: activity.Cost,
            notes: activity.Notes,
            followUpDt: activity.DueByDate,
          };
        });

        setRowData(globalRows);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getGlobalActivities();
  }, [productionId]);

  return (
    <div>
      {loading ? (
        <Spinner size="lg" className="mt-2 mr-3 -mb-1" />
      ) : (
        <div>
          <div className="flex flex-row w-full justify-end">
            <Button text="Add New Activity" className="w-[160px] mb-5" onClick={() => showAddActivity()} />
          </div>

          <div className="flex flex-row">
            <div className="w-full h-[500px]">
              <Table columnDefs={colDefs} rowData={rowData} styleProps={styleProps} />
            </div>
          </div>
        </div>
      )}

      <GlobalActivityModal
        show={showGlobalActivityModal}
        onCancel={() => setShowGlobalActivityModal(false)}
        variant={actModalVariant}
        activityTypes={activityTypes}
        onSave={(variant, data) => updateGlobalActivity(variant, data)}
        data={actRow}
        productionId={productionId}
        productionCurrency={currency.symbol}
      />
    </div>
  );
};

Global.displayName = 'Global';
export default Global;

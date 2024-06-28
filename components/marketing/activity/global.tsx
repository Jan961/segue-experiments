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
  // const [actRow, setActRow] = useState(null);

  const { fetchData } = useAxios();

  const showAddActivity = () => {
    setActModalVariant('add');
    setShowGlobalActivityModal(true);
  };

  // const addActivity = async () => {
  //   try {
  //     const inputData: GlobalActivityDTO = {
  //       ActivityTypeId: 1,
  //       Cost: 10,
  //       Date: new Date(),
  //       FollowUpRequired: false,
  //       Name: 'Test global 2',
  //       Notes: 'note field value',
  //       ProductionId: 10,
  //     }

  //     await fetchData({
  //       url: '/api/marketing/globalActivities/create',
  //       method: 'POST',
  //       data: inputData
  //     });

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const updateGlobalActivity = (type: string, data: any) => {
    console.log(type, data);
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

        setColDefs(globalActivityColDefs(updateGlobalActivity, currency.symbol));
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
        data={null} // actRow
        productionId={productionId}
        productionCurrency={currency.symbol}
      />
    </div>
  );
};

Global.displayName = 'Global';
export default Global;

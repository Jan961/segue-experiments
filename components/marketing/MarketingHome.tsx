import { useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import { SalesTable } from 'types/MarketingTypes';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';

const MarketingHome = () => {
  const [currView, setCurrView] = useState<SalesTable>('');
  const selectedBtnClass = '!bg-primary-green/[0.30] !text-primary-navy';
  const { selected: ProductionId } = useRecoilValue(productionJumpState);

  return (
    <div className="flex w-full h-full">
      {/* Green Box */}
      <div className="bg-primary-green/[0.15] w-[291px] h-full rounded-xl p-4 mr-5 flex flex-col">
        <div className="text-base mb-4">Marketing summary will get rendered here</div>
      </div>

      <div className="flex-grow flex flex-col">
        <div className="flex flex-wrap items-center mb-4">
          {' '}
          <Button
            text="Sales"
            className={`w-[155px] ${currView === 'sales' && selectedBtnClass}`}
            disabled={!ProductionId}
            variant="secondary"
            onClick={() => setCurrView('sales')}
          />
          <Button
            text="Archived Sales"
            className={`w-[155px] ${currView === 'archived sales' && selectedBtnClass}`}
            disabled={!ProductionId}
            variant="secondary"
            onClick={() => setCurrView('archived sales')}
          />
          <Button
            text="Activities"
            className={`w-[155px] ${currView === 'activities' && selectedBtnClass}`}
            disabled={!ProductionId}
            variant="secondary"
            onClick={() => setCurrView('activities')}
          />
          <Button
            text="Contact Notes"
            className={`w-[155px] ${currView === 'contact notes' && selectedBtnClass}`}
            disabled={!ProductionId}
            variant="secondary"
            onClick={() => setCurrView('contact notes')}
          />
          <Button
            text="Venue Contacts"
            className={`w-[155px] ${currView === 'venue contacts' && selectedBtnClass}`}
            disabled={!ProductionId}
            variant="secondary"
            onClick={() => setCurrView('venue contacts')}
          />
          <Button
            text="Promoter Holds"
            className={`w-[155px] ${currView === 'promoter holds' && selectedBtnClass}`}
            disabled={!ProductionId}
            variant="secondary"
            onClick={() => setCurrView('promoter holds')}
          />
          <Button
            text="Attachments"
            className={`w-[155px] ${currView === 'attachments' && selectedBtnClass}`}
            disabled={!ProductionId}
            variant="secondary"
            onClick={() => setCurrView('attachments')}
          />
        </div>

        <div className="flex-grow">
          <div className="text base">{currView}</div>
        </div>
      </div>
    </div>
  );
};

export default MarketingHome;

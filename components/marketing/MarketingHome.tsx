import { useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import { SalesTable } from 'types/MarketingTypes';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { Summary } from './Summary';
import Icon from 'components/core-ui-lib/Icon';

const MarketingHome = () => {
  const [currView, setCurrView] = useState<SalesTable>('');
  const selectedBtnClass = '!bg-primary-green/[0.30] !text-primary-navy';
  const { selected: productionId } = useRecoilValue(productionJumpState);

  return (
    <div className="flex w-full h-full">
      {/* Green Box */}
      <div className="bg-primary-green/[0.15] w-[291px] h-[788px] rounded-xl p-4 mr-5 flex flex-col justify-between mb-5">
        <div className="flex-grow overflow-y-auto">
          <Summary />
        </div>
        <div className="flex flex-col border-y-2 border-t-primary-navy border-b-0 py-4 mt-4">
          <div className="flex items-center text-primary-navy">
            <Icon iconName={'user-solid'} fill="#FFF" variant="xs" />
            <div className="ml-4 bg-[#10841C] text-primary-white px-1">Down to single seat</div>
          </div>
          <div className="flex items-center text-primary-navy mt-2">
            <Icon iconName={'book-solid'} fill="#FFF" variant="xs" />
            <div className="ml-4 bg-[#FFE606] text-primary-navy px-1">Brochure released</div>
          </div>
          <div className="flex items-center text-primary-navy mt-2">
            <Icon iconName={'square-cross'} fill="#FFF" variant="xs" />
            <div className="ml-4 bg-[#ED1111] text-primary-white px-1">Not on sale</div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <div className="flex flex-wrap items-center mb-4">
          {' '}
          <Button
            text="Sales"
            className={`w-[155px] ${currView === 'sales' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('sales')}
          />
          <Button
            text="Archived Sales"
            className={`w-[155px] ${currView === 'archived sales' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('archived sales')}
          />
          <Button
            text="Activities"
            className={`w-[155px] ${currView === 'activities' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('activities')}
          />
          <Button
            text="Contact Notes"
            className={`w-[155px] ${currView === 'contact notes' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('contact notes')}
          />
          <Button
            text="Venue Contacts"
            className={`w-[155px] ${currView === 'venue contacts' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('venue contacts')}
          />
          <Button
            text="Promoter Holds"
            className={`w-[155px] ${currView === 'promoter holds' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('promoter holds')}
          />
          <Button
            text="Attachments"
            className={`w-[155px] ${currView === 'attachments' && selectedBtnClass}`}
            disabled={!productionId}
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

import Button from 'components/core-ui-lib/Button';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { productionJumpState } from 'state/booking/productionJumpState';
import { addEditBookingState } from 'state/booking/bookingState';

export const MarketingButtons = () => {
    const [disabled, setDisabled] = useState<boolean>(false);
    const production = useRecoilValue(currentProductionSelector);
    const { selected: ProductionId } = useRecoilValue(productionJumpState);
    const setAddNewBookingModalVisible = useSetRecoilState(addEditBookingState);


    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <Button
                text="Edit Landing Page"
                className="w-[155px]"
            ></Button>

            <Button
                disabled={disabled}
                text="Marketing Reports"
                className="w-[165px]"
                iconProps={{ className: 'h-4 w-3' }}
                sufixIconName={'excel'}
            ></Button>

            <Button
                disabled={disabled}
                text="Veune Website"
                className="w-[155px]"
            ></Button>
        </div>
    );
}

export default MarketingButtons

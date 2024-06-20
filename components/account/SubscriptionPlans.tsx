import Button from 'components/core-ui-lib/Button';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { useState } from 'react';
import { useWizard } from 'react-use-wizard';

export type Plan = {
  planId: number;
  planName: string;
  planDescription: string;
  planPrice: number;
  planFrequency: number;
  planPriceId: string;
  planCurrency: string;
  color?: string;
};

interface SubscriptionPlansProps {
  plans: Plan[];
  onSubmit: (data: Plan) => void;
}
const SubscriptionPlans = ({ plans = [], onSubmit }: SubscriptionPlansProps) => {
  const [showDetails, setShowDetails] = useState<{ [key: number]: boolean }>({});
  const { previousStep, nextStep } = useWizard();
  const toggleDetails = (index: number) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleNexClick = (plan) => {
    onSubmit(plan);
    nextStep();
  };
  return (
    <div className="mx-auto w-[700px]">
      <h1 className="text-2xl font-bold text-center text-primary-input-text mb-4">Select Plan</h1>
      <div className="flex  justify-center items-center w-full pt-8 pb-5">
        <div className="grid grid-cols-3 divide-x-[3px] gap-4 text-primary-input-text">
          {plans.map((plan, index) => {
            return (
              <div key={plan.planId} className=" px-4 flex flex-col gap-y-2 min-w-[240px] max-w-[200px]">
                <Icon iconName="price-plan" fill={plan.color} />
                <div className="flex gap-2  justify-center items-center">
                  <h2 className="font-bold text-center text-responsive-2xl">{plan.planName}</h2>
                  <Icon iconName="info-circle-solid" />
                  <Tooltip body="amsn" />
                </div>
                <div className="flex flex-col">
                  <p className="text-center font-bold">{plan.planDescription}</p>
                </div>
                <p className="max-w-[150px] text-center mx-auto">Some more description</p>

                <div>
                  <p className="text-center">{`${plan.planCurrency} ${plan.planPrice} per month`}</p>
                  <p className="text-center">{`${plan.planCurrency} ${plan.planPrice * 12} per year`}</p>
                </div>
                <Button text={`Choose ${plan.planName}`} className="w-full" onClick={() => handleNexClick(plan)} />
                <Button
                  text={showDetails[index] ? 'Hide Plan Details' : 'Show Plan Details'}
                  onClick={() => toggleDetails(index)}
                  variant="secondary"
                  className="border-2 w-full"
                />
                {showDetails[index] && (
                  <ul className="mx-auto pt-3">
                    {[plan.planDescription].map((point, pointIndex) => (
                      <li key={pointIndex} className="flex flex-row gap-2 items-center">
                        {/* SVG icon */}
                        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Path */}
                          <path
                            d="M15 7.89258C15 12.0347 11.6421 15.3926 7.5 15.3926C3.35785 15.3926 0 12.0347 0 7.89258C0 3.75043 3.35785 0.392578 7.5 0.392578C11.6421 0.392578 15 3.75043 15 7.89258ZM6.63248 11.8638L12.197 6.29925C12.3859 6.1103 12.3859 5.80392 12.197 5.61497L11.5127 4.93068C11.3238 4.7417 11.0174 4.7417 10.8284 4.93068L6.29032 9.46873L4.1716 7.35001C3.98265 7.16106 3.67627 7.16106 3.48729 7.35001L2.803 8.03429C2.61405 8.22324 2.61405 8.52962 2.803 8.71858L5.94817 11.8637C6.13715 12.0527 6.4435 12.0527 6.63248 11.8638Z"
                            fill={plan.color || '#41A29A'}
                          />
                        </svg>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex items-center justify-end mt-5">
        <Button text="Back" variant="secondary" onClick={previousStep} className="w-32 mr-3" />
      </div>
    </div>
  );
};

export default SubscriptionPlans;

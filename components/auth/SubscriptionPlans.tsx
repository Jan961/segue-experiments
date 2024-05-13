import Button from 'components/core-ui-lib/Button';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { useState } from 'react';

interface Plan {
  name: string;
  production: number | string;
  users: number;
  body: string;
  price_per_month: number;
  price_per_year: number;
  currency: string;
  detail_point: string[];
  color?: string;
}

const planData: Plan[] = [
  {
    name: 'Plan A',
    production: 1,
    users: 1,
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id est lorem. Sed accumsan lectus in congue hendrerit.',
    price_per_month: 100,
    price_per_year: 99,
    currency: '£',
    color: '#41a29a',
    detail_point: [
      'Lorem ipsum dolor',
      'Lorem ipsum dolor',
      'Lorem ipsum dolor',
      'Lorem ipsum dolor',
      'Lorem ipsum dolor',
    ],
  },
  {
    name: 'Plan B',
    production: 5,
    users: 5,
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id est lorem. Sed accumsan lectus in congue hendrerit.',
    price_per_month: 100,
    price_per_year: 99,
    currency: '£',
    color: '#0093c0',
    detail_point: [
      'Lorem ipsum dolor',
      'Lorem ipsum dolor',
      'Lorem ipsum dolor',
      'Lorem ipsum dolor',
      'Lorem ipsum dolor',
    ],
  },
  {
    name: 'Plan C',
    production: '10+',
    users: 10,
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id est lorem. Sed accumsan lectus in congue hendrerit.',
    price_per_month: 100,
    price_per_year: 99,
    currency: '£',
    color: '#7b568d',
    detail_point: [
      'Lorem ipsum dolor',
      'Lorem ipsum dolor',
      'Lorem ipsum dolor',
      'Lorem ipsum dolor',
      'Lorem ipsum dolor',
    ],
  },
];
const SubscriptionPlans = () => {
  const [showDetails, setShowDetails] = useState<{ [key: number]: boolean }>({});

  const toggleDetails = (index: number) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  return (
    <div className="flex  justify-center items-center w-full pt-8 pb-5">
      <div className="text-primary-input-text">
        <h1 className="text-responsive-2xl font-bold text-center ">Select Plan</h1>
        <div className="grid grid-cols-3 divide-x-[3px] gap-4 ">
          {planData.map((plan, index) => {
            return (
              <div key={index} className=" px-4 flex flex-col gap-y-2 min-w-[240px] max-w-[200px]">
                <svg
                  width="122"
                  height="122"
                  viewBox="0 0 122 122"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto"
                >
                  <g filter="url(#filter0_d_1024_3475)">
                    <circle cx="61" cy="57" r="57" fill={plan.color} />
                    <g clipPath="url(#clip0_1024_3475)">
                      <path
                        d="M64.3648 69.1537C65.1338 69.0987 66.0627 68.9763 67.1515 68.7867C68.2403 68.5971 69.3661 68.4319 70.5164 68.2974C71.6667 68.1628 72.7679 68.0527 73.8382 67.9732C74.9025 67.8937 75.8191 67.9059 76.5819 68.016C77.0186 68.1261 77.32 68.2912 77.4861 68.5053C77.5907 68.8846 77.32 69.1537 76.668 69.3189C76.1758 69.484 75.4131 69.7409 74.3734 70.0896C73.3338 70.4443 72.2388 70.7991 71.0946 71.1539C69.9443 71.5025 68.8801 71.8756 67.8958 72.2549C66.9116 72.6341 66.2595 72.9644 65.9273 73.2336C65.872 76.3347 65.466 79.0934 64.697 81.5095C63.9281 83.9256 62.5378 86.1153 60.5139 88.0727C57.9426 90.4643 55.0329 92.1648 51.7849 93.1679C48.5368 94.1711 45.1535 94.2689 41.6594 93.4554C39.6355 92.911 38.1037 91.8956 37.0703 90.397C36.0307 88.8985 35.7538 87.2041 36.2521 85.3018C36.6889 83.6136 37.5378 82.0661 38.7927 80.6531C40.0476 79.2341 41.524 77.974 43.2219 76.8608C44.9135 75.7475 46.7467 74.7688 48.7152 73.9247C50.6837 73.0806 52.6276 72.365 54.5346 71.7655C55.4635 72.0347 55.9802 72.5546 56.091 73.3131C56.2017 74.0715 56.091 74.8361 55.7649 75.5946C52.8122 76.5182 50.3269 77.552 48.3031 78.6958C46.2792 79.8396 44.3353 81.2526 42.4837 82.9347C41.7147 83.7482 41.1672 84.5617 40.8412 85.3813C40.5152 86.201 40.4413 86.8922 40.6382 87.461C40.8289 88.0299 41.278 88.3969 41.9915 88.562C42.7051 88.7272 43.7386 88.562 45.1104 88.0727C46.5868 87.5834 48.0262 86.9839 49.4165 86.2805C50.8129 85.571 52.1109 84.7024 53.3166 83.6748C54.2455 82.8613 55.1436 81.9254 56.0233 80.8611C56.8968 79.8029 57.5673 78.6897 58.0349 77.5153C58.4962 76.347 58.6869 75.1542 58.6069 73.9309C58.5208 72.7075 58.0225 71.5576 57.0875 70.4688C56.1586 69.4901 55.1867 68.6215 54.1778 67.857C53.1628 67.0985 52.1416 66.3645 51.102 65.6549C50.0624 64.9454 49.0412 64.242 48.0262 63.5324C47.0112 62.8229 46.07 62.0339 45.1965 61.1653C42.6252 58.4984 41.3456 55.3789 41.3456 51.7884C41.5609 49.0175 42.2745 46.2038 43.4802 43.3473C44.6798 40.4969 46.2238 37.7872 48.1124 35.2365C50.0009 32.6859 52.1539 30.3615 54.59 28.2635C57.0198 26.1716 59.6158 24.4344 62.3779 23.0459C65.1399 21.6574 67.9327 20.7399 70.7994 20.275C73.666 19.8163 76.4957 19.9386 79.2824 20.6421C82.2351 21.8348 84.1913 23.6698 85.1448 26.1471C86.1045 28.6182 86.2521 31.1873 85.6001 33.848C84.5051 38.142 82.7826 41.9771 80.4327 45.3413C78.0828 48.7116 75.3208 51.6477 72.1527 54.1494C71.1685 54.914 70.1412 55.5929 69.0769 56.1924C68.0066 56.7918 66.8501 57.3056 65.589 57.7399C64.0019 58.3394 62.4332 58.321 60.8769 57.6971C59.3205 57.0671 58.1825 56.0517 57.4751 54.6387C56.7615 53.2808 56.5585 51.8006 56.8599 50.198C57.1613 48.5893 57.555 47.1947 58.0472 45.9958C59.4128 42.8457 61.3013 39.9097 63.7066 37.1878C64.9062 35.94 66.2164 34.8512 67.6375 33.9276C69.0585 33.0039 70.5902 32.429 72.2327 32.2149C72.7248 32.1048 73.2969 32.1048 73.9551 32.2149C74.6072 32.325 75.21 32.5268 75.7575 32.8265C76.2989 33.1263 76.6864 33.4933 76.9079 33.9276C77.1232 34.3618 77.0125 34.8756 76.5757 35.4751C75.9236 36.3987 75.1547 37.2122 74.2812 37.9218C73.4076 38.6313 72.5833 39.3592 71.8205 40.1238C70.5102 41.3716 69.3476 42.6928 68.3326 44.0813C67.3237 45.4698 66.4071 46.95 65.589 48.5281C65.4229 48.8523 65.2199 49.2622 64.9738 49.7515C64.7278 50.2408 64.5063 50.773 64.3156 51.3418C64.1249 51.9107 64.0142 52.4551 63.9896 52.9689C63.9588 53.4888 64.0818 53.9047 64.3587 54.235C65.2876 54.1249 66.2041 53.8375 67.1084 53.3787C68.0066 52.9199 68.8186 52.4123 69.526 51.8679C70.6148 51.0543 71.6298 50.1674 72.5587 49.2193C73.4876 48.2651 74.3919 47.2498 75.2654 46.161C77.0678 43.7143 78.5996 41.2982 79.8545 38.9066C81.1094 36.5149 81.743 33.7379 81.743 30.5878C81.5769 29.0709 81.0725 27.9515 80.2236 27.242C79.3747 26.5386 78.3781 26.1165 77.2278 25.9758C76.0774 25.8413 74.8902 25.9085 73.6599 26.1838C72.4295 26.4529 71.3776 26.8077 70.5041 27.242C67.7174 28.5999 65.183 30.2759 62.9192 32.2577C60.6554 34.2395 58.6439 36.3742 56.8907 38.6558C55.4143 40.5581 54.0855 42.5949 52.9106 44.7725C51.7356 46.95 51.0897 49.1765 50.9851 51.4581C50.9851 52.712 51.2989 53.8558 51.9263 54.8834C52.5538 55.911 53.3227 56.8836 54.2209 57.7766C55.1252 58.6697 56.0786 59.5199 57.0875 60.3028C58.0964 61.0919 59.0191 61.8381 59.8373 62.5477C60.8215 63.4713 61.7073 64.4622 62.5009 65.5265C63.2944 66.5847 63.9096 67.7958 64.3464 69.1537H64.3648Z"
                        fill="white"
                        fillOpacity="0.4"
                      />
                    </g>
                  </g>
                  <defs>
                    <filter
                      id="filter0_d_1024_3475"
                      x="0"
                      y="0"
                      width="122"
                      height="122"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1024_3475" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1024_3475" result="shape" />
                    </filter>
                    <clipPath id="clip0_1024_3475">
                      <rect width="50" height="74" fill="white" transform="translate(36 20)" />
                    </clipPath>
                  </defs>
                </svg>
                <div className="flex gap-2  justify-center items-center">
                  <h2 className="font-bold text-center text-responsive-2xl">{plan.name}</h2>
                  <Icon iconName="info-circle-solid" />
                  <Tooltip body="amsn" />
                </div>
                <div className="flex flex-col">
                  <p className="text-center font-bold">{plan.production} Production</p>
                  <p className="text-center font-bold">{plan.users} Users</p>
                </div>
                <p className="max-w-[150px] text-center mx-auto">{plan.body}</p>

                <div>
                  <p className="text-center">
                    {plan.currency}
                    {plan.price_per_month} per month
                  </p>
                  <p className="text-center">
                    {plan.currency}
                    {plan.price_per_year} per year
                  </p>
                </div>
                <Button text={`Choose ${plan.name}`} className="w-full" />
                <Button
                  text={showDetails[index] ? 'Hide Plan Details' : 'Show Plan Details'}
                  onClick={() => toggleDetails(index)}
                  variant="secondary"
                  className="border-2 w-full"
                />
                {showDetails[index] && (
                  <ul className="mx-auto pt-3">
                    {plan.detail_point.map((point, pointIndex) => (
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
    </div>
  );
};

export default SubscriptionPlans;

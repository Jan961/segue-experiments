import { useCallback, useState } from 'react';
import { RadioGroup, Select, TextInput, Tooltip, Icon } from 'components/core-ui-lib';
import { Direction } from 'components/core-ui-lib/RadioGroup/RadioGroup';
import { salaryPaidToOptions } from 'config/contracts';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { BankAccount } from '../types';

export const defaultBankAccount = {
  paidTo: '',
  accountName: '',
  accountNumber: '',
  sortCode: '',
  swift: '',
  iban: '',
  country: null,
};

interface Props {
  details?: Partial<BankAccount>;
  accountType: string;
  countryOptionList: SelectOption[];
  onChange: (data: Partial<BankAccount>) => void;
}

const SalaryDetailsForm = ({ details, countryOptionList, onChange, accountType = 'Salary' }: Props) => {
  const [formData, setFormData] = useState<BankAccount>({ ...defaultBankAccount, ...details });
  const { paidTo, accountName, accountNumber, sortCode, swift, iban, country } = formData;
  const handleChange = useCallback(
    (key: string, value: number | string | null) => {
      const updatedData = { ...formData, [key]: value };
      setFormData(updatedData);
      onChange({ ...details, [key]: value });
    },
    [onChange, setFormData, formData],
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">{`${accountType} to be Paid to`}</div>
        <div className="grow">
          <RadioGroup
            testId={`${accountType}-paid-to`}
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(value) => handleChange('paidTo', value)}
            value={paidTo}
            options={salaryPaidToOptions}
            direction={Direction.HORIZONTAL}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">Bank Account Name</div>
        <div className="grow">
          <TextInput
            testId={`${accountType}-bank-account-name`}
            placeholder="Enter Bank Account Name"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('accountName', e.target.value)}
            value={accountName}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">Sort Code</div>
        <div className="grow">
          <TextInput
            testId={`${accountType}-sort-code`}
            placeholder="Enter Sort Code"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('sortCode', e.target.value)}
            value={sortCode}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">Account Number</div>
        <div className="grow">
          <TextInput
            testId={`${accountType}-account-number`}
            placeholder="Enter Account Number"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            value={accountNumber}
            max={8}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">SWIFT(if applicable)</div>
        <div className="grow">
          <TextInput
            testId={`${accountType}-account-swift`}
            placeholder="Enter Bank Account Name"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('swift', e.target.value)}
            value={swift}
            max={11}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">IBAN(if applicable)</div>
        <div className="grow">
          <TextInput
            testId={`${accountType}-account-iban`}
            placeholder="Enter Bank Account Name"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('iban', e.target.value)}
            value={iban}
            max={34}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="flex items-center gap-2 text-primary-input-text font-bold w-44">
          <span>Country</span>
          <Tooltip
            body="For addresses in the United Kingdom, please select Scotland, England, Wales or Northern Ireland"
            position="left"
            width="w-[140px]"
            bgColorClass="primary-input-text"
          >
            <Icon iconName="info-circle-solid" variant="xs" />
          </Tooltip>
        </div>
        <div className="grow">
          <Select
            testId={`${accountType}-account-country`}
            placeholder="Select Country"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(value) => handleChange('country', value as number)}
            options={countryOptionList}
            value={country}
            isSearchable
            isClearable
          />
        </div>
      </div>
    </div>
  );
};

export default SalaryDetailsForm;

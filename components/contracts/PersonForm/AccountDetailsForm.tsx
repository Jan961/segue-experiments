import { useCallback, useState } from 'react';
import { RadioGroup, Select, TextInput } from 'components/core-ui-lib';
import { Direction } from 'components/core-ui-lib/RadioGroup/RadioGroup';
import { salaryPaidToOptions } from 'config/contracts';
import { SelectOption } from 'components/core-ui-lib/Select/Select';

const defaultBankAccount = {
  paidTo: '',
  accountName: '',
  accountNumber: '',
  sortCode: '',
  swift: '',
  iban: '',
  country: null,
};

interface BankAccount {
  paidTo: string | null;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  swift?: string;
  iban?: string;
  country: number | null;
}

interface Props {
  accountType: string;
  countryOptionList: SelectOption[];
  onChange: (data: BankAccount) => void;
}

const SalaryDetailsForm = ({ countryOptionList, onChange, accountType = 'Salary' }: Props) => {
  const [formData, setFormData] = useState<BankAccount>(defaultBankAccount);
  const { paidTo, accountName, accountNumber, sortCode, swift, iban, country } = formData;
  const handleChange = useCallback(
    (key: string, value: number | string | null) => {
      const updatedData = { ...formData, [key]: value };
      setFormData(updatedData);
      onChange(updatedData);
    },
    [onChange, setFormData, formData],
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">{`${accountType} to be Paid to`}</div>
        <div className="w-[22vw] ml-4">
          <RadioGroup
            testId={`${accountType}-paid-to`}
            className=" text-primary-input-text font-bold w-full"
            onChange={(value) => handleChange('paidTo', value)}
            value={paidTo}
            options={salaryPaidToOptions}
            direction={Direction.HORIZONTAL}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Bank Account Name</div>
        <div className="w-[22vw] ml-4">
          <TextInput
            testId={`${accountType}-bank-account-name`}
            placeholder="Enter Bank Account Name"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('accountName', e.target.value)}
            value={accountName}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Sort Code</div>
        <div className="w-[22vw] ml-4">
          <TextInput
            testId={`${accountType}-sort-code`}
            placeholder="Enter Sort Code"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('sortCode', e.target.value)}
            value={sortCode}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Account Number</div>
        <div className="w-[22vw] ml-4">
          <TextInput
            testId={`${accountType}-account-number`}
            placeholder="Enter Account Number"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            value={accountNumber}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">SWIFT(if applicable)</div>
        <div className="w-[22vw] ml-4">
          <TextInput
            testId={`${accountType}-account-swift`}
            placeholder="Enter Bank Account Name"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('swift', e.target.value)}
            value={swift}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">IBAN(if applicable)</div>
        <div className="w-[22vw] ml-4">
          <TextInput
            testId={`${accountType}-account-iban`}
            placeholder="Enter Bank Account Name"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('iban', e.target.value)}
            value={iban}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Country</div>
        <div className="w-[22vw] ml-4">
          <Select
            testId={`${accountType}-account-country`}
            placeholder="Select Country"
            className=" text-primary-input-text font-bold w-full"
            onChange={(value) => handleChange('country', value as number)}
            options={countryOptionList}
            value={country}
          />
        </div>
      </div>
    </div>
  );
};

export default SalaryDetailsForm;

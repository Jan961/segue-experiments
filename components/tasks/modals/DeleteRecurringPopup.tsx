import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { Select } from 'components/core-ui-lib';
import { useState } from 'react';
import { SelectOption } from 'components/core-ui-lib/Select/Select';

interface DeleteRecurringPopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (option: string) => void;
}

export const DeleteRecurringPopup = ({ visible, onClose, onSubmit }: DeleteRecurringPopupProps) => {
  const [selectedOption, setSelectedOption] = useState<number>(null);

  const createOptions = () => {
    const dropDownText = [
      'Delete this occurrence only',
      'Delete this and all future occurrence of this task',
      'Delete every occurrence of this task',
    ];
    const dropDownOptions: SelectOption[] = [];
    dropDownText.forEach((text) => {
      dropDownOptions.push({ text, value: dropDownOptions.length });
    });

    return dropDownOptions;
  };
  const optionList = createOptions();
  return (
    <PopupModal show={visible} onClose={onClose}>
      <div>
        <h1>This is a repeating task. Do you want to:</h1>
        <Select
          testId="select-recurring-delete"
          options={optionList}
          value={selectedOption}
          onChange={(option: number) => {
            setSelectedOption(option);
          }}
        />
      </div>
      <Button variant="primary" className="bg-primary-red" onClick={onClose} testId="btn-delete-cancel">
        Cancel
      </Button>
      <Button
        testId="btn-delete-confirm"
        variant="secondary"
        disabled={selectedOption === null}
        onClick={() => {
          onSubmit(optionList[selectedOption].text);
        }}
      >
        Continue
      </Button>
    </PopupModal>
  );
};

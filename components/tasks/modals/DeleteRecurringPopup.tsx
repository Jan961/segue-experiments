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
    <PopupModal
      show={visible}
      onClose={onClose}
      title="This is a repeating task"
      titleClass="text-primary-navy text-xl mb-2"
      hasOverlay={false}
    >
      <form className="flex flex-col gap-2">
        <p>Would you like to...</p>
        <Select
          testId="select-recurring-delete"
          options={optionList}
          value={selectedOption}
          onChange={(option: number) => {
            setSelectedOption(option);
          }}
        />

        <div className="flex mt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            className="mr-4 w-[132px]"
            text="Cancel"
            testId="btn-recurring-cancel"
          />
          <Button
            variant="primary"
            className="w-[132px]"
            onClick={() => {
              onSubmit(optionList[selectedOption].text);
            }}
            text="OK"
            testId="btn-recurring-confirm"
          />
        </div>
      </form>
    </PopupModal>
  );
};

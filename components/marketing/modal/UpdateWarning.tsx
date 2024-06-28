import PopupModal from 'components/core-ui-lib/PopupModal';
import Button from 'components/core-ui-lib/Button';
import { Table } from 'components/core-ui-lib';
import { styleProps, updateWarningColDefs } from '../table/tableConfig';

interface UpdateWarningProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
  data: any;
  type: string;
  name: string;
}

export const UpdateWarningModal = ({ visible = false, onCancel, data, type, name, onSave }: UpdateWarningProps) => {
  return (
    <PopupModal
      show={visible}
      title="Update Warning"
      titleClass="text-xl text-primary-navy text-bold mb-4 -mt-2 text-primary-red"
      onClose={onCancel}
    >
      <div className="w-[500px] h-auto mb-5 mt-5">
        <div className="text-base fort-bold text-primary-red mb-5">
          By clicking update below, the following values for {name} will be updated.
        </div>

        <Table columnDefs={updateWarningColDefs(type)} rowData={data} styleProps={styleProps} />

        <div className="float-right flex flex-row mt-5">
          <Button className="ml-4 mr-10 w-32" onClick={onCancel} variant="secondary" text="Cancel" />
          <Button className="w-32" variant="primary" text="Proceed" onClick={onSave} />
        </div>
      </div>
    </PopupModal>
  );
};

import { PropsWithChildren } from 'react';
import { Button, PopupModal } from 'components/core-ui-lib';

interface ProdCompanyDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  text: string;
}

export const ProdCompanyDeleteModal = ({
  onConfirm,
  onCancel,
  text,
  title,
}: PropsWithChildren<ProdCompanyDeleteModalProps>) => {
  return (
    <PopupModal onClose={() => onCancel()} show>
      <div className="w-[350px]">
        <p className="font-extrabold text-primary text-center text-xl">{title}</p>
        <p className="font-extrabold text-primary text-center text-xl">{text}</p>
        <div className="flex justify-center space-x-2 m-1">
          <Button variant="secondary" onClick={() => onCancel()} className="w-[100px]">
            No
          </Button>
          <Button className="bg-primary-red text-primary-white w-[100px]" onClick={() => onConfirm()}>
            Yes
          </Button>
        </div>
      </div>
    </PopupModal>
  );
};

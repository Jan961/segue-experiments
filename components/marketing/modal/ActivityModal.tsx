import { useEffect, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';

interface ActivityModalProps {
  show: boolean;
  onCancel: () => void;
}

export default function ActivityModal({ show = false, onCancel }: Partial<ActivityModalProps>) {
  const [visible, setVisible] = useState<boolean>(show);
  // const [showConfirm, setShowConfirm] = useState<boolean>(false);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  return (
    <PopupModal show={visible} onClose={onCancel} showCloseIcon={true} hasOverlay={false}>
      <div className="h-[526px] w-[404px]" />
    </PopupModal>
  );
}

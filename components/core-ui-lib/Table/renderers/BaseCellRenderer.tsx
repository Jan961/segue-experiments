import React, { useEffect } from 'react';

const emptyFn = () => null;

interface BaseCellRendererProps {
  eGridCell: HTMLElement;
  onFocus?: () => void;
  onBlur?: () => void;
  children: React.ReactNode;
}

const BaseCellRenderer = ({ children, eGridCell, onBlur = emptyFn, onFocus = emptyFn }: BaseCellRendererProps) => {
  useEffect(() => {
    if (eGridCell) {
      eGridCell.addEventListener('focusin', onFocus);
      eGridCell.addEventListener('focusout', onBlur);

      return () => {
        eGridCell.removeEventListener('focusin', onFocus);
        eGridCell.removeEventListener('focusout', onBlur);
      };
    }
  }, [eGridCell]);

  return children;
};

export default BaseCellRenderer;

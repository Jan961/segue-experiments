import React, { useEffect, forwardRef } from 'react';

const emptyFn = () => null;

interface BaseCellRendererProps {
  eGridCell: HTMLElement;
  onFocus?: () => void;
  onBlur?: () => void;
  children: React.ReactNode;
}

const BaseCellRenderer = forwardRef<HTMLDivElement, BaseCellRendererProps>(
  ({ children, eGridCell, onBlur = emptyFn, onFocus = emptyFn }, ref) => {
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

    return <div ref={ref}>{children}</div>;
  },
);
BaseCellRenderer.displayName = 'BaseCellRenderer';

export default BaseCellRenderer;

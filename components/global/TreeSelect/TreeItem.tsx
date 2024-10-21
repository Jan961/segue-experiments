import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { TreeItemOption } from './types';
import React, { useEffect, useState, memo } from 'react';

import { mapRecursive } from 'utils';
import { Checkbox, Label } from 'components/core-ui-lib';
import classNames from 'classnames';

export interface TreeItemProps {
  defaultOpen: boolean;
  value: TreeItemOption;
  onChange: (v: TreeItemOption) => void;
}

export default memo(function TreeItem({ value, onChange, defaultOpen }: TreeItemProps) {
  const { id, label, options, checked, groupHeader, isPartiallySelected, disabled } = value;
  const isLeafNode = !options || options.length === 0;
  const labelClass = groupHeader ? 'text-responsive-sm font-semibold' : 'text-responsive-sm';
  const [itemOptions, setItemOptions] = useState(options || []);
  const [selected, setSelected] = useState<boolean>(checked || false);
  const [showIntermediateState, setShowIntermediateState] = useState<boolean>(isPartiallySelected);

  const handleSelectionChange = (checked) => {
    let updatedOptions = [];
    if (!isLeafNode) {
      updatedOptions = mapRecursive(itemOptions, (o) => ({ ...o, checked }));
      setItemOptions(updatedOptions);
    }
    setSelected(checked);
    return updatedOptions;
  };

  const hasPartiallySelectedChildren = (options) => {
    // partial selection
    const partiallySelectedNode = options.find(({ isPartiallySelected }) => !!isPartiallySelected);
    if (partiallySelectedNode) {
      return true;
    }
    const selectedNodes = options.filter(({ checked }) => checked);
    return selectedNodes.length !== 0 && selectedNodes.length < itemOptions.length;
  };

  const areAllChildrenSelected = (options) => {
    const selectedNodes = options.filter(({ checked }) => checked);
    return selectedNodes.length !== 0 && selectedNodes.length === itemOptions.length;
  };

  useEffect(() => {
    setSelected(checked);
  }, [checked]);

  useEffect(() => {
    const isPartiallySelected = hasPartiallySelectedChildren(options);
    setShowIntermediateState(isPartiallySelected);
    setItemOptions(options);
  }, [options]);

  const handleGroupToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const updatedOptions = handleSelectionChange(isChecked);
    if (isChecked) {
      setShowIntermediateState(false);
    } else {
      setShowIntermediateState(areAllChildrenSelected(updatedOptions));
    }

    onChange({ ...value, options: updatedOptions, checked: isChecked, isPartiallySelected: false });
  };

  const handleLeafToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    onChange({ ...value, checked: isChecked, isPartiallySelected: false });
  };

  const handleOptionToggle = (toggledOption: TreeItemOption) => {
    const updatedOptions = itemOptions.map((o) => (o.id === toggledOption.id ? { ...toggledOption } : { ...o }));
    let isPartiallySelected = toggledOption.isPartiallySelected;
    // If child node is partially selected, then this node will be partially selected as well
    if (isPartiallySelected) {
      setShowIntermediateState(true);
    } else {
      // If this is not a leaf node, evaluate if this node should be partially selected
      isPartiallySelected = hasPartiallySelectedChildren(updatedOptions);
      setShowIntermediateState(isPartiallySelected);
    }
    const allChildrenSelected = areAllChildrenSelected(updatedOptions);
    setSelected(allChildrenSelected);

    setItemOptions(updatedOptions);
    onChange({
      ...value,
      options: updatedOptions,
      checked: allChildrenSelected,
      isPartiallySelected,
    });
  };

  return isLeafNode ? (
    <div className="flex items-center gap-3">
      <Checkbox
        id={id}
        testId={label}
        name={`${id}`}
        checked={selected}
        value={id}
        disabled={disabled}
        onChange={groupHeader ? handleGroupToggle : handleLeafToggle}
      />

      <Label text={label} className={classNames(labelClass, disabled && 'bg-disabled-input')} />
    </div>
  ) : (
    <div>
      <Disclosure as="div" key={id} className="py-1" defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <div className="flex items-center gap-3">
              <Checkbox
                id={id}
                testId={label}
                name={`${id}`}
                checked={selected}
                disabled={disabled}
                value={id}
                onChange={handleGroupToggle}
                showIntermediate={showIntermediateState}
              />

              <Disclosure.Button className="flex w-full items-center">
                <Label text={label} className={classNames(labelClass, disabled && 'bg-disabled-input')} />
                <span className="flex items-center ml-2">
                  {open ? (
                    <ChevronUpIcon data-testid="tree-item-open" className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <ChevronDownIcon data-testid="tree-item-close" className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
              </Disclosure.Button>
            </div>

            <Disclosure.Panel className="ml-7 mt-1">
              {itemOptions.map((option) => (
                <TreeItem key={option.id} value={option} onChange={handleOptionToggle} defaultOpen={defaultOpen} />
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
});

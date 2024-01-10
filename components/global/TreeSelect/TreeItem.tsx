import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { TreeItemOption } from './types';
import React, { useEffect, useState, memo } from 'react';
import { FormInputCheckbox } from '../forms/FormInputCheckbox';

export interface TreeItemProps {
  value: TreeItemOption;
  onChange: (v: TreeItemOption) => void;
}

function mapRecursive<T>(oldArray: Array<T & { options?: T[] }>, callback: (item: T) => T, newArray: T[] = []): T[] {
  if (oldArray.length <= 0) {
    // if all items have been processed return the new array
    return newArray;
  } else {
    // destructure the first item from old array and put remaining in a separate array
    let [item, ...theRest] = oldArray;
    if (item.options) {
      // item with options is cloned to avoid mutating the original object
      item = { ...item, options: mapRecursive<T>(item.options, callback) };
    }
    // create an array of the current new array and the result of the current item and the callback function
    const interimArray = [...newArray, callback(item)];
    // return a recursive call to to map to process the next item.
    return mapRecursive<T>(theRest, callback, interimArray);
  }
}

export default memo(function TreeItem({ value, onChange }: TreeItemProps) {
  const { id, label, options, checked, groupHeader } = value;
  const isLeafNode = !options || options.length === 0;
  const labelClass = groupHeader ? 'text-responsive-sm font-semibold' : 'text-responsive-sm';
  const [itemOptions, setItemOptions] = useState(options || []);
  const [selected, setSelected] = useState<boolean>(checked || false);
  const [showIntermediateState, setShowIntermediateState] = useState<boolean>(false);

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
    setItemOptions(options);
  }, [options]);

  const handleGroupToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const updatedOptions = handleSelectionChange(isChecked);
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
      // If this is not a leaf node, eavluate if this node should be partially selected
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
      <FormInputCheckbox testid={id} name={`${id}`} value={selected} onChange={handleLeafToggle} />

      <span className={labelClass}>{label}</span>
    </div>
  ) : (
    <div>
      <Disclosure as="div" key={id} className="py-1">
        {({ open }) => (
          <>
            <div className="flex items-center gap-3">
              <FormInputCheckbox
                testid={id}
                name={`${id}`}
                value={selected}
                onChange={handleGroupToggle}
                showIntermediate={showIntermediateState}
              />

              <Disclosure.Button className="flex w-full items-center bg-white">
                <span className={labelClass}>{label}</span>
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
                <TreeItem key={option.id} value={option} onChange={handleOptionToggle} />
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
});

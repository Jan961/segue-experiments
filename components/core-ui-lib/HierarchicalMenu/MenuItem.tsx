import { Disclosure } from '@headlessui/react';
import Icon from '../Icon';
import { MenuOption } from './types';
import React, { useEffect, useState, memo, useRef } from 'react';
import classNames from 'classnames';

export interface MenuItemProps {
  option: MenuOption;
  onClick?: (o: MenuOption) => void;
  onToggle?: (o: MenuOption, ref: React.RefObject<HTMLDivElement>) => void;
}

export default memo(function MenuItem({ option, onClick, onToggle }: MenuItemProps) {
  const { label, value, options, groupHeader, icon, expanded, labelClass, testId = `menu-item-${label}` } = option;
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded);
  const isLeafNode = !options || options.length === 0;
  const baseClass = 'cursor-pointer';

  const [itemOptions, setItemOptions] = useState(options || []);
  const menuItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItemOptions(options);
  }, [options]);

  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  const handleBtnClick = () => {
    onClick(option);
  };

  const handleMenuToggle = () => {
    onToggle({ ...option, expanded: !expanded }, menuItemRef);
    setIsExpanded(!expanded);
  };

  return isLeafNode ? (
    <div className={`flex items-center gap-3 ${groupHeader ? 'mt-4' : ''}`}>
      {icon && (
        <div className="w-6">
          <Icon iconName={icon.default.iconName} stroke={icon.default.stroke} fill={icon.default.fill} variant="lg" />
        </div>
      )}
      <span onClick={() => onClick(option)} className={classNames(baseClass, labelClass)} data-testid={testId}>
        {label}
      </span>
    </div>
  ) : (
    <div ref={menuItemRef} className={groupHeader ? 'mt-4' : ''}>
      <Disclosure as="div" key={value} className="" defaultOpen={isExpanded}>
        {({ open }) => (
          <>
            <div className="flex items-center gap-3">
              {icon && (
                <div className="w-6">
                  <Icon
                    iconName={open ? icon.active.iconName : icon.default.iconName}
                    stroke={open ? icon.active.stroke : icon.default.stroke}
                    fill={open ? icon.active.fill : icon.default.fill}
                    variant="lg"
                  />
                </div>
              )}
              <div className="flex w-full items-center">
                <span onClick={handleBtnClick} className={classNames(baseClass, labelClass)} data-testid={testId}>
                  {label}
                </span>
                <Disclosure.Button onClick={handleMenuToggle}>
                  <span className="flex items-center ml-2">
                    <Icon
                      iconName="chevron-down"
                      variant="xs"
                      stroke="#FFF"
                      fill="#21345B"
                      data-testid="tree-item-open"
                      className={open ? '' : '-rotate-90 transform'}
                    />
                  </span>
                </Disclosure.Button>
              </div>
            </div>

            <Disclosure.Panel className="">
              {itemOptions.map((option) => (
                <div key={option.id} className={icon ? 'ml-11' : 'ml-6'}>
                  <MenuItem option={option} onClick={onClick} onToggle={onToggle} />
                </div>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
});

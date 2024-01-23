import { Disclosure } from '@headlessui/react';
import Icon from '../Icon';
import { MenuOption } from './types';
import { useEffect, useState, memo } from 'react';
import classNames from 'classnames';

export interface MenuItemProps {
  option: MenuOption;
  onClick?: (o: MenuOption) => void;
}

export default memo(function MenuItem({ option, onClick }: MenuItemProps) {
  const { label, value, options, groupHeader, icon } = option;
  const isLeafNode = !options || options.length === 0;
  const baseClass = 'text-[0.9375rem] cursor-pointer';
  const labelClass = groupHeader ? 'text-[1.0625rem] font-bold' : isLeafNode ? '' : 'font-bold';
  const [itemOptions, setItemOptions] = useState(options || []);

  useEffect(() => {
    setItemOptions(options);
  }, [options]);

  return isLeafNode ? (
    <div className="py-1 flex items-center gap-3">
      {icon && (
        <Icon iconName={icon.default.iconName} stroke={icon.default.stroke} fill={icon.default.fill} variant="lg" />
      )}
      <span onClick={() => onClick(option)} className={classNames(baseClass, labelClass)}>
        {label}
      </span>
    </div>
  ) : (
    <div>
      <Disclosure as="div" key={value} className="py-1">
        {({ open }) => (
          <>
            <div className="flex items-center gap-3">
              {icon && (
                <Icon
                  iconName={open ? icon.active.iconName : icon.default.iconName}
                  stroke={open ? icon.active.stroke : icon.default.stroke}
                  fill={open ? icon.active.fill : icon.default.fill}
                  variant="lg"
                />
              )}
              <Disclosure.Button className="flex w-full items-center">
                <span onClick={() => onClick(option)} className={classNames(baseClass, labelClass)}>
                  {label}
                </span>
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

            <Disclosure.Panel className="ml-7 mt-1">
              {itemOptions.map((option) => (
                <MenuItem key={option.value} option={option} />
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
});

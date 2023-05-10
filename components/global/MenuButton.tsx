import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PropsWithChildren } from 'react'

interface MenuButtonProps {
  onClick: () => void;
  iconRight?: IconDefinition;
  iconLeft?: IconDefinition;
}

export const MenuButton = ({ children, iconLeft, iconRight, onClick }: PropsWithChildren<MenuButtonProps>) => {
  return (
    <button
      className="bg-primary-blue text-white ml-2
        hover:bg-blue-400 active:bg-blue-600 font-bold
         text-sm px-3 py-2 rounded shadow hover:shadow-lg
         outline-none focus:outline-none mr-1 mb-1 ease-linear
         transition-all duration-150"
      type="button"
      onClick={onClick}
    >
      { iconLeft && (<FontAwesomeIcon icon={iconLeft} className="mr-2"/>) }
      { children }
      { iconRight && (<FontAwesomeIcon icon={iconRight} className="ml-2"/>) }
    </button>
  )
}

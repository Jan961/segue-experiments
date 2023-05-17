import { PropsWithChildren } from 'react'

interface FormInfoProps {
  intent?: undefined | 'DANGER'
  header: string;
}

export const FormInfo = ({ intent, children, header }: PropsWithChildren<FormInfoProps>) => {
  let baseClass = 'p-3 rounded bg-blue-200 mb-4 '

  switch (intent) {
  case 'DANGER':
    baseClass += ' bg-red-200'
    break
  }

  return (
    <div className={baseClass}>
      { header && (<h3 className="text-lg mb-4">{header}</h3>)}
      {children}
    </div>
  )
}

import { ReactNode, useState } from 'react'
import Head from 'next/head'
import { HeaderNav } from 'components/HeaderNav'
import { PopoutMenu } from 'components/PopoutMenu'

type Props = {
    children?: ReactNode
    title?: string
    flush?: boolean
}

const Layout = ({ children, title = 'Your tour assistant', flush = false }: Props) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  return (
    <div className="background-gradient font-primary">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      </Head>
      <header className="flex flex-col">
        <HeaderNav menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen}></HeaderNav>
      </header>
      <main className="h-full w-full flex flex-rows  ">
        <PopoutMenu menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen}/>
        <div className={flush ? 'flex-1' : 'flex-1 px-4'}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout

import Head from 'next/head'
import { ReactNode } from 'react'

type Props = {
    children?: ReactNode
    title?: string
}

const LayoutAccountLocked = ({children, title = 'This is the default title'}: Props) => (
    <div>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        </Head>
        <header className="flex flex-col">

        </header>
        <main className="screen-h mb-0 bg-white">{children}</main>

    </div>
)

export default LayoutAccountLocked

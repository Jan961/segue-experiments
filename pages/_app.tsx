import '../styles/globals.css'
import 'react-range-slider-input/dist/style.css'

import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { ClientStateSetter, setInitialStateServer } from 'lib/recoil'
import { ClerkProvider } from '@clerk/nextjs'
import { useRouter } from 'next/router'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

// Login disabled due to lack of support. DO NOT PUT PUBLIC
export default function MyApp ({ Component, pageProps }: AppPropsWithLayout) {
  const { initialState } = pageProps
  const router = useRouter()

  return (
    <ClerkProvider {...pageProps}
      navigate={(to) => router.push(to)}
    >
      <RecoilRoot initializeState={(snapshot) => setInitialStateServer(snapshot, initialState)}>
        <ClientStateSetter intitialState={initialState} />
        <Component {...pageProps} />
      </RecoilRoot>
    </ClerkProvider>
  )
}

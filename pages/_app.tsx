import '../styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import {useContext, useEffect, useState} from "react";
import { userService } from '../services/user.service';
import {useRouter} from "next/router";
library.add(fab, fas)

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(false);
    const [setTour, setSetTour] = useState(0);

    useEffect(() => {
        // on initial load - run auth check
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in
        //const appState = useContext(AppState);
        setUser(userService.userValue);
        const userDetails = userService.userValue
        const publicPaths = ['/login', '/register', '/forgotten-password', '/register/[registrationInviteCode]', '/privacy', '/terms', '/account-actions/[userId]/activate/[hash]' , '/account-actions/[userId]/reset/[hash]'];
        const path = url.split('?')[0];
        if (!userService.userValue && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/login',
                query: { returnUrl: router.asPath }
            });
        } else {
            setAuthorized(true);
            //Top Level permission Permissions
            // Segue admin Users Allows to global data
            if(userDetails !== null) {
                if (router.pathname.startsWith("/administration") && !userDetails.segueAdmin) {
                    router.push({
                        pathname: '/unauthorised',
                    });
                }
                // if User is logged in but has no access to top level Account Permission

                if (router.pathname.startsWith("/accounts") && !userDetails.accountAdmin || !userDetails.accountOwner) {
                    router.push({
                        pathname: '/unauthorised',
                    });
                }
            }
            setAuthorized(true);
        }
    }

    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout ?? ((page) => page)

    return getLayout(<Component {...pageProps} />)
}

import Router from 'next/router';

export const forceNavigate = (route) => {
    Router.replace(route).then(r => {});
}

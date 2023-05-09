
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import {  AlertType } from 'services/alert.service';
import { alertService } from 'services/alert.service';
import {XCircleIcon} from "@heroicons/react/20/solid";

export { Alert };

Alert.propTypes = {
    id: PropTypes.string,
    fade: PropTypes.bool
};

Alert.defaultProps = {
    id: 'default-alert',
    fade: true
};

function Alert({ id, fade }) {
    const router = useRouter();
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // subscribe to new alert notifications
        const subscription = alertService.onAlert(id)
            .subscribe(alert => {
                // clear alerts when an empty alert is received
                // @ts-ignore
                if (!alert.message) {
                    setAlerts(alerts => {
                        // filter out alerts without 'keepAfterRouteChange' flag
                        const filteredAlerts = alerts.filter(x => x.keepAfterRouteChange);

                        // set 'keepAfterRouteChange' flag to false on the rest
                        filteredAlerts.forEach(x => delete x.keepAfterRouteChange);
                        return filteredAlerts;
                    });
                } else {
                    // add alert to array
                    setAlerts(alerts => ([...alerts, alert]));

                    // auto close alert if required
                    // @ts-ignore
                    if (alert.autoClose) {
                        setTimeout(() => removeAlert(alert), 3000);
                    }
                }
            });


        // clear alerts on location change
        const clearAlerts = () => {
            setTimeout(() => alertService.clear(id));
        };
        router.events.on('routeChangeStart', clearAlerts);

        // clean up function that runs when the component unmounts
        return () => {
            // unsubscribe to avoid memory leaks
            subscription.unsubscribe();
            router.events.off('routeChangeStart', clearAlerts);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function removeAlert(alert) {
        if (fade) {
            // fade out alert
            const alertWithFade = { ...alert, fade: true };
            setAlerts(alerts => alerts.map(x => x === alert ? alertWithFade : x));

            // remove alert after faded out
            setTimeout(() => {
                setAlerts(alerts => alerts.filter(x => x !== alertWithFade));
            }, 500);
        } else {
            // remove alert
            setAlerts(alerts => alerts.filter(x => x !== alert));
        }
    };

    function cssClasses(alert) {
        if (!alert) return;

        const classes = ['alert', 'alert-dismissable'];

        const alertTypeClass = {
            [AlertType.Success]: 'alert-success',
            [AlertType.Error]: 'alert-danger',
            [AlertType.Info]: 'alert-info',
            [AlertType.Warning]: 'alert-warning'
        }

        classes.push(alertTypeClass[alert.type]);

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }

    if (!alerts.length) return null;
   // TODO: create better success alert
    return (
        <div className="container">
            <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">There were {alerts.length} errors with your submission</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <ul role="list" className="list-disc space-y-1 pl-5">
                                {alerts.map((alert, index) =>
                                    <div key={index} className={cssClasses(alert)}>
                                        <a className="close" onClick={() => removeAlert(alert)}>&times;</a>
                                        <span dangerouslySetInnerHTML={{ __html: alert.message }}></span>
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="m-3">

            </div>
        </div>
    );
}
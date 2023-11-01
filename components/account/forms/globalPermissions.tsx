import React from 'react';

export default function GlobalPermissions(tab) {
  if (tab.data.Active == true) {
    return (
      <>
        <div className={'grid grid-cols-1'}>
          <div className={'grid-rows-1'}>
            <h1>Global</h1>
          </div>
          <div className={'grid grid-rows-1'}>
            <label htmlFor={''}>Manage Users</label>
            <input id={''} key={''} type={'checkbox'} />
          </div>
          <div className={'grid grid-rows-1'}>
            <label htmlFor={''}>Manage Account</label>
            <input id={''} key={''} type={'checkbox'} />
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}

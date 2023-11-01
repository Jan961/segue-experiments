import * as React from 'react';
import { useState } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';
import { settingsService } from '../../../services/settingsService';

/**
 * This Feature can be tuner on in the settingsService`
 *
 */
export default function () {
  let email = '123@parser.seguesite.co.uk';
  const [emailAddress, setEmail] = useState(email);
  const [copied, setCopied] = useState(false);

  if (settingsService.getSetting('EmailIngest')) {
    return (
      <div>
        <input value={email} type={'hidden'} onChange={({ target: { value } }) => setCopied(false)} />

        <CopyToClipboard text={emailAddress} onCopy={() => setCopied(true)}>
          <span>
            Your unique email address is <FontAwesomeIcon icon={faEnvelopeOpen} /> {email}
          </span>
        </CopyToClipboard>

        <CopyToClipboard text={emailAddress} onCopy={() => setCopied(true)}>
          <button>
            <FontAwesomeIcon icon={faCopy} />{' '}
            {copied ? <span style={{ color: 'green' }}>Copied.</span> : <span>Copy</span>}- forward sales data here for
            automatic parsing
          </button>
        </CopyToClipboard>
      </div>
    );
  } else {
    return (
      <>
        <div>&nbsp;</div>
      </>
    );
  }
}

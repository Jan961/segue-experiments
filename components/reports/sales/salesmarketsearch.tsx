import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faEnvelopesBulk, faFilePdf, faTable } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import SideNavBar from '../../sideMenu';

export default function Salesmarketsearch() {
  return (
    <>
      <SideNavBar></SideNavBar>
      <div className="flex flex-auto flex-col bg-yellow-100 w-9/12">
        <div className="grid grid-cols-1 gap-4">
          <div className="">Sales and Marketing - Sales Summary</div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <select>
                <option>Show / Production</option>
              </select>
            </div>
            <div>
              <select>
                <option>Sales Week Number</option>
              </select>
            </div>
            <div>
              <select>
                <option>Number of Weeks</option>
              </select>
            </div>
            <div>
              <select>
                <option>Sort By</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <input type={'date'} />
            </div>
            <div>
              <input type={'date'} />
            </div>
            <div>
              <select>
                <option>Number of Weeks</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <button>
                <FontAwesomeIcon icon={faCode as IconProp} /> View On screen
              </button>
            </div>
            <div>
              <button>
                <FontAwesomeIcon icon={faFilePdf as IconProp} /> View On screen
              </button>
            </div>
            <div>
              <button>
                <FontAwesomeIcon icon={faTable as IconProp} /> View On screen
              </button>
            </div>
            <div>
              <button>
                <FontAwesomeIcon icon={faEnvelopesBulk as IconProp} /> View On screen
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import styled from 'styled-components';
import { dateToSimple } from 'services/dateService';
import { IContractSchedule, IContractDetails } from './types';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { contractsVenueState } from 'state/contracts/contractsVenueState';
import { currencyListState } from 'state/productions/currencyState';
import charCodeToCurrency from 'utils/charCodeToCurrency';
import { productionJumpState } from 'state/booking/productionJumpState';
import { ProductionCompanyDTO } from 'interfaces';

export interface JendagiContractProps {
  contractPerson: any;
  contractSchedule: Partial<IContractSchedule>;
  contractDetails: Partial<IContractDetails>;
  productionCompany: Partial<ProductionCompanyDTO>;
  currency?: string;
}

const defaultContractDetails = {
  currency: null,
  firstDayOfWork: null,
  lastDayOfWork: null,
  specificAvailabilityNotes: '',
  publicityEventList: null,
  rehearsalVenue: {
    townCity: '',
    venue: null,
    notes: '',
  },
  isAccomodationProvided: false,
  accomodationNotes: '',
  isTransportProvided: false,
  transportNotes: '',
  isNominatedDriver: false,
  nominatedDriverNotes: '',
  paymentType: null,
  weeklyPayDetails: null,
  totalPayDetails: null,
  paymentBreakdownList: null,
  cancellationFee: 0,
  cancellationFeeNotes: '',
  includeAdditionalClauses: false,
  additionalClause: null,
  customClauseList: null,
};

const Container = styled.div`
  height: fit-content;
  background-color: #fff;
  padding: 40px;
  width: 50%;
  min-width: 700px;
  font-family: 'Times New Roman', Times, serif;

  .title-container {
    padding-bottom: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .toursummary-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 100px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 auto;
    margin-bottom: 100px;
  }

  table,
  th,
  td {
    border: 1px solid black;
  }

  th,
  td {
    padding: 5px;
    text-align: left;
  }

  .highlight {
    color: red;
    font-weight: bold;
  }

  .details {
    margin-top: 20px;
  }

  .details p {
    margin-bottom: 20px;
  }

  .details-title {
    display: flex;
    column-gap: 45px;
  }

  .details-subsection {
    margin-left: 60px;
    margin-top: 20px;
  }

  .footer div {
    margin-bottom: 15px;
  }

  .footer img {
    width: 20%;
    height: 20%;
  }

  ul {
    list-style-type: none;
    padding-left: 20px;
  }

  ul li {
    position: relative;
    padding-left: 15px;
  }

  ul li::before {
    content: '-';
    position: absolute;
    left: 0;
    color: black;
  }
`;

const JendagiContract = ({
  contractPerson,
  contractSchedule,
  contractDetails,
  productionCompany,
}: JendagiContractProps) => {
  const { productions } = useRecoilValue(productionJumpState);
  const [personState] = useState({ ...contractPerson });
  const [scheduleState] = useState<Partial<IContractSchedule>>({ ...contractSchedule });
  const [detailsState] = useState<Partial<IContractDetails>>({ ...defaultContractDetails, ...contractDetails });
  const venueMap = useRecoilValue(contractsVenueState);
  const currencyList = useRecoilValue(currencyListState);

  const { personDetails, agencyDetails } = personState;

  const currentDate = dateToSimple(new Date().toISOString());

  const getVenueNameFromId = (venueId) => {
    return Object.values(venueMap).find((venue) => venue.Id === venueId).Name;
  };

  const getCurrencySymbolFromCode = (currencyCode) => {
    return charCodeToCurrency(
      Object.values(currencyList).find((currency) => currency.code === currencyCode).symbolUnicode,
    );
  };

  const formatPayment = (payment) => {
    return (detailsState.currency ? getCurrencySymbolFromCode(detailsState.currency) : '') + (payment || 'N/A');
  };

  const filterPaymentBreakdownList = (breakdownArray) => {
    return breakdownArray.map((list) => {
      return (
        dateToSimple(list.date) +
        ': ' +
        (detailsState.currency ? getCurrencySymbolFromCode(detailsState.currency) : '') +
        String(list.amount)
      );
    });
  };

  const filterPublicityEventList = (publicityArray) => {
    return publicityArray.map((list) => {
      return (
        dateToSimple(list.date) +
        ': ' +
        (detailsState.currency ? getCurrencySymbolFromCode(detailsState.currency) : '') +
        list.notes
      );
    });
  };

  const getShowNameFromId = (id) => {
    const result = productions.find((prod) => {
      return prod.Id === id;
    });
    return result.ShowName;
  };

  return (
    <Container>
      <div className="title-container">
        <strong>{scheduleState.department} - CONTRACT SCHEDULE</strong>
        <span>THIS SCHEDULE SHALL BE DEEMED ANNEXED</span>
        <span>AND FORMS PART OF THE CONTRACT BELOW</span>
      </div>

      <table>
        <tr>
          <td>1</td>
          <td>DOCUMENT ISSUE DATE</td>
          <td>{currentDate}</td>
        </tr>
        <tr>
          <td>2</td>
          <td>{scheduleState.department} - NAME/ADDRESS</td>
          <td>
            {[
              personDetails.firstName + ' ' + personDetails.lastName,
              personDetails.address1,
              personDetails.address2,
              personDetails.town,
              personDetails.postcode,
              personDetails.country,
            ]
              .filter((detail) => detail)
              .join(', ')}
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td>AGENT NAME/ADDRESS</td>
          <td>
            {agencyDetails
              ? [
                  agencyDetails.firstName + ' ' + agencyDetails.lastName,
                  agencyDetails.agencyName,
                  agencyDetails.address1,
                  agencyDetails.address2,
                  agencyDetails.town,
                  agencyDetails.postcode,
                  agencyDetails.country,
                ]
                  .filter((detail) => detail)
                  .join(', ')
              : 'N/A'}
          </td>
        </tr>
        <tr>
          <td>4</td>
          <td>The PRODUCTION</td>
          <td>{getShowNameFromId(scheduleState.production)}</td>
        </tr>
        <tr>
          <td>5</td>
          <td>ENGAGED AS</td>
          <td>{scheduleState.role}</td>
        </tr>
        <tr>
          <td>6</td>
          <td>FIRST DAY OF WORK</td>
          <td>{detailsState.firstDayOfWork ? 'On or around ' + dateToSimple(detailsState.firstDayOfWork) : 'N/A'}</td>
        </tr>
        <tr>
          <td>7</td>
          <td>REHEARSAL TOWN/CITY</td>
          <td>{detailsState.rehearsalVenue.townCity ? detailsState.rehearsalVenue.townCity : 'N/A'}</td>
        </tr>
        <tr>
          <td>8</td>
          <td>REHEARSAL VENUES</td>
          <td>
            {detailsState.rehearsalVenue.venue
              ? 'Likely to be ' +
                getVenueNameFromId(detailsState.rehearsalVenue.venue) +
                (detailsState.rehearsalVenue.notes !== '' ? ' - ' + detailsState.rehearsalVenue.notes : '')
              : 'N/A'}
          </td>
        </tr>
        <tr>
          <td>9</td>
          <td>REHEARSAL SALARY</td>
          <td>
            {detailsState.paymentType
              ? detailsState.paymentType === 'W'
                ? formatPayment(detailsState.weeklyPayDetails?.rehearsalFee) +
                  ' buyout per week plus ' +
                  formatPayment(detailsState.weeklyPayDetails?.rehearsalHolidayPay) +
                  ' per week holiday pay, to include any and all additional payments. Pro-rated for part weeks.'
                : 'Included in Total Fee'
              : 'N/A'}
          </td>
        </tr>
        <tr>
          <td>10</td>
          <td>FIRST PAID PERFORMANCE DATE</td>
          <td>On or around !FIRST PERFORMANCE DATE!</td>
        </tr>
        <tr>
          <td>11</td>
          <td>NORMAL PLACE OF WORK</td>
          <td>
            At 8] as required and at [Either !VENUE! if all performance bookings are at the same venue or ‘On Tour’]
          </td>
        </tr>
        <tr>
          <td>12</td>
          <td>END DATE</td>
          <td>
            {contractDetails.lastDayOfWork
              ? dateToSimple(contractDetails.lastDayOfWork) +
                ' ' +
                'or upon issue of two weeks’ notice by producer, whichever shall come first.'
              : 'N/A'}
          </td>
        </tr>
        <tr>
          <td>13</td>
          <td>NOMINATED DRIVER STATUS</td>
          <td>{contractDetails.isNominatedDriver ? contractDetails.nominatedDriverNotes : 'N/A'}</td>
        </tr>
        <tr>
          <td>14</td>
          <td>
            {detailsState.paymentType
              ? detailsState.paymentType === 'W'
                ? 'PERFORMANCE FEE'
                : 'TOTAL FEE'
              : ' PERFORMANCE/TOTAL FEE '}
          </td>
          <td>
            {detailsState.paymentType
              ? detailsState.paymentType === 'W'
                ? formatPayment(detailsState.weeklyPayDetails?.performanceFee) +
                  ' buyout plus ' +
                  formatPayment(detailsState.weeklyPayDetails?.performanceHolidayPay) +
                  ' holiday pay per performance week. Performance fee will be pro-rated for part weeks and for part rehearsal / part performance weeks.'
                : formatPayment(detailsState.totalPayDetails?.totalFee) +
                  ' plus ' +
                  formatPayment(detailsState.totalPayDetails?.totalHolidayPay) +
                  ' ' +
                  detailsState.totalPayDetails?.feeNotes
              : 'N/A'}
            <br />
            <br />
            Payments are fully inclusive of (but not restricted to) overtime / additional performances / travel and
            accommodation except as detailed at clause 17/18.
            <br />
            You must advise prior to signing this contract if you are VAT registered.
          </td>
        </tr>
        <tr>
          <td>15</td>
          <td>TOURING ALLOWANCE</td>
          <td>
            {detailsState.weeklyPayDetails?.touringAllowance
              ? formatPayment(detailsState.weeklyPayDetails.touringAllowance) +
                ' ' +
                detailsState.weeklyPayDetails.subsNotes
              : 'N/A'}
          </td>
        </tr>
        <tr>
          <td>16</td>
          <td>PAYMENTS</td>
          <td>
            {detailsState.paymentType && (
              <>
                {detailsState.paymentType === 'W' ? (
                  <>
                    Payments of rehearsal salary and performance fee will be made weekly to a nominated bank account,
                    following receipt of an invoice. Invoices should be submitted in advance.
                    <br />
                    <br />
                  </>
                ) : detailsState.totalPayDetails?.feeNotes ? (
                  <>
                    detailsState.totalPayDetails.feeNotes
                    <br />
                  </>
                ) : (
                  ''
                )}
              </>
            )}
            {detailsState.paymentBreakdownList && (
              <>
                Please note: this clause is not contractual; it is a guide only. Dates and exact payment breakdown may
                differ.
                {filterPaymentBreakdownList(detailsState.paymentBreakdownList).map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
                <br />
                <br />
              </>
            )}
            Holidays may be declared by{' '}
            {productionCompany?.ProdCoName ? productionCompany.ProdCoName : '!PRODUCTION COMPANY!'}. Holiday pay shall
            be accrued and paid during declared holidays. Any outstanding holiday pay will be paid at the end of the
            contract. Holiday pay shall be at the rate stated in Clause 14.
          </td>
        </tr>
        <tr>
          <td>17</td>
          <td>ACCOMMODATION</td>
          <td>
            {detailsState.isAccomodationProvided
              ? detailsState.accomodationNotes ?? ''
              : 'The Contractor is responsible for arranging and paying for their own accommodation throughout'}
          </td>
        </tr>
        <tr>
          <td>18</td>
          <td>TRANSPORT</td>
          <td>
            {detailsState.isTransportProvided
              ? detailsState.transportNotes ?? ''
              : 'The Contractor is responsible for arranging and paying for their own transport throughout.'}
          </td>
        </tr>
        <tr>
          <td>19</td>
          <td>
            <span>{scheduleState.department}</span> AVAILABILITY
          </td>
          <td>
            The Contractor shall make themselves available on such dates and times as the producer may reasonably
            request in order that they may discuss matters pertaining to the production. The Contractor may also be
            required for costume fittings and photocalls prior to the commencement of contract. If the Contractor is
            required to attend meetings prior to commencement of contract (as detailed at clause 6 above) then receipted
            out of pocket expenses shall be reimbursed.
            <br />
            <br />
            Additional rehearsals or technical sessions may be scheduled throughout the contract and the Contractor will
            be required to attend these if advised by the CSM or the Producer.
            {detailsState.specificAvailabilityNotes ? (
              <>
                <br />
                <br />
                {detailsState.specificAvailabilityNotes}
              </>
            ) : (
              ''
            )}
          </td>
        </tr>
        <tr>
          <td>20</td>
          <td>PUBLICITY AND SPONSORSHIP</td>
          <td>
            {detailsState.publicityEventList && (
              <>
                The Contractor will be required to attend the following events:
                {filterPublicityEventList(detailsState.publicityEventList).map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
                <br />
                <br />
              </>
            )}
            It is a condition of our contracts that the Contractor is available for such press interviews as the
            management deem reasonable. The Contractor shall promote the show at every press opportunity they have
            (whether specifically for this show or otherwise) from the date of the first public announcement of
            Contractor’s participation until the show closes. This includes positive promotion of the show through
            posting - or sharing of official venue or company posts - on any active social media accounts. Where the
            Producer has agreed to permit Sponsorship of the show, the Contractor shall assist in promotional activity
            during the term of the contract, including personal appearances and post-show meet and greets as required.
            The Producer must be informed – and give consent – prior to the Contractor giving interviews which include
            information relating to this show. The Contractor undertakes not to make public (including on social media)
            any criticism of the show, producers or fellow workers employed in any capacity on the production. This
            clause is effective from the date first written above, for the duration of the contract and remains in place
            once The Production has closed.
          </td>
        </tr>
        <tr>
          <td>21</td>
          <td>DRIVING COMPANY VEHICLES</td>
          <td>!YES/NO!</td>
        </tr>
        <tr>
          <td>22</td>
          <td>PERFORMANCE DATES</td>
          <td>
            The dates listed below are for information purposes only, are not exhaustive, are subject to changes,
            additions, and deletions.
          </td>
        </tr>
        <tr>
          <td>23</td>
          <td>EUROPEAN WORKTIME DIRECTIVE OPT-OUT</td>
          <td>
            By signing this contract, you agree that you have waived your right to the European work-time directive (and
            its successors) limit on a 48hr working week.
          </td>
        </tr>
        <tr>
          <td>24</td>
          <td>ADDITIONAL CLAUSES</td>
          <td>
            {detailsState.includeAdditionalClauses
              ? detailsState.customClauseList &&
                detailsState.customClauseList.map((item, index) => <div key={index}>{item}</div>)
              : 'N/A'}
          </td>
        </tr>
        <tr>
          <td>25</td>
          <td>MANAGER OR PRODUCER</td>
          <td>{productionCompany?.ProdCoName ? productionCompany.ProdCoName : '!PRODUCTION COMPANY!'}</td>
        </tr>
      </table>

      <div className="toursummary-container">
        <u>
          <strong>All dates and performance times remain subject to change at any time.</strong>
        </u>
        <div>INSERT PDF of Tour Summary</div>
        <u>
          <strong>All dates and performance times remain subject to change at any time.</strong>
        </u>
      </div>

      <div className="details-container">
        <p>
          {productionCompany?.ProdCoName ? productionCompany.ProdCoName : 'PRODUCTION COMPANY'} (“The Producer”) hereby
          engages The Contractor to render their services in connection with The Producer’s production (“the
          Production”) of the dramatic work as detailed at clause 4 of the foregoing schedule, on the terms and subject
          to the conditions set out in this Agreement.
        </p>
        <p>
          <strong>NOW IT IS HEREBY AGREED</strong> as follows:{' '}
        </p>

        <div className="details">
          <div className="details-title">
            <strong>A.</strong>
            <strong>ENGAGEMENT</strong>
          </div>
          <div>
            <p>
              The Producer hereby engages The Contractor to perform the role as detailed at clause 5 of the foregoing
              schedule in The Production.
            </p>
            <p>
              The Contractor ’s engagement hereunder shall commence upon the start of rehearsals, or as detailed at
              clause 6 of the foregoing schedule and shall continue for the run of the Production.
            </p>
            <p>
              The contract ends as detailed at clauses 12 and 24 of the foregoing schedule or upon 2 weeks’ notice by
              The Producer - whichever shall come first.
            </p>
            <p>
              A fee as detailed at clauses 9 and 14 of the foregoing schedule shall be paid. This payment is fully
              inclusive of all additional payments including (but not restricted to) an allowance for push and pull and
              EPK, and any statutory pay resulting from Annual Leave or Bank Holidays.
            </p>
            <p>
              Payments can be made in Euro to an Irish bank or in Sterling to a UK bank – however the same currency and
              bank account must be used for the duration of the contract.{' '}
            </p>
            <p>
              The Contractor undertakes that they will perform their duties in accordance with the Company’s
              requirements as outlined in this agreement and as directed by the Creative and Production team. They will
              do so willingly and to the best of their skill and ability, and with due regard to the efficient creation
              and running of The Production. The Contractor will render all such other services as are usually rendered
              by The Contractor s of first-class repute.
            </p>
          </div>
        </div>

        <div className="details">
          <div className="details-title">
            <strong>B.</strong>
            <strong>COMPENSATION DETAILS</strong>
          </div>
          <div>
            <p>
              Subject to The Contractor providing their services as required by this Agreement and to the performance by
              The Contractor of all their other obligations under this agreement, The Producer shall pay to The
              Contractor a salary as follows:
            </p>
            <p>
              Fees and Subsistence/Touring Allowance as detailed at clauses 9 and 14 of the foregoing schedule. Unless
              otherwise stated, payment made weekly one full week in arrears, on Fridays. Where a full-week holiday is
              declared, payment shall be made for a full week if sufficient holiday pay has been accrued, or up to the
              amount accrued if there is an insufficient amount for a full week’s fee.
            </p>
            <strong>Please see attached Rehearsal/performance schedule.</strong>
          </div>
        </div>

        <div className="details">
          <div className="details-title">
            <strong>C.</strong>
            <strong>CREDIT</strong>
          </div>
          <div>
            <p>
              The Contractor hereby consents to the use by The Producer of their name, likeness, and biographical
              material in connection with publicity for the Production.
            </p>
          </div>
        </div>

        <div className="details">
          <div className="details-title">
            <strong>D.</strong>
            <strong>PUBLICITY</strong>
          </div>
          <div>
            <p>
              The Contractor shall participate without additional payment in publicising the production through press
              and publicity interviews, photocalls etc. Any such commitments will be scheduled in consultation with The
              Contractor, whose agreement shall not be unreasonably withheld.
            </p>
            <p>
              The Contractor shall not seize publicity opportunities without the prior permission of the Producer. This
              includes, but is not limited to, any portrayal of the production (or any associated persons or venues) on
              Social Media. Marketing materials containing The Contractor ’s image (but not their name) may be used
              subsequent to this agreement subject to the caveat “Previous Cast” shall be displayed on said materials.
            </p>
          </div>
        </div>

        <div className="details">
          <div className="details-title">
            <strong>E.</strong>
            <strong>THE CONTRACTOR ’S WARRANTIES AND UNDERTAKINGS</strong>
          </div>
          <div>
            <p>
              The Contractor hereby warrants and represents that they have the full power and authority to enter into
              this Agreement and to perform their services as herein provided.
            </p>
            <p>The Contractor undertakes and agrees:</p>
            <ul>
              <li>
                to provide the services as specified in this agreement, when and where required by The Producer; Please
                see attached draft rehearsal/performance schedule.
              </li>
              <li>
                Where required; to provide The Producer with appropriate invoices / tax certificates / PRSI number and
                bank account details. This must be prior to the first day of rehearsal;
              </li>
              <li>
                to present, before signing the contract, appropriate and current right to work documentation. The
                document must be a UK or Irish passport, or Visa documentation that grants full right to work in the UK
                and Ireland for the duration of the contract. The document must be an original – no photocopies – which
                the Producer will make a copy of. This copy will be retained on file for 2 years following the
                completion of the contract.{' '}
              </li>
              <li>
                to participate without additional payment in promotional and publicity events on behalf of The
                Production (and any sponsorship activity around the production) during any period leading up to the
                presentation of The Production at any venue and during its presentation at any venue, in accordance with
                Clause D [Publicity] of this contract; undertakes not to appear on the following programmes without the
                prior written permission of the Producer, The One Show, Loose Women, BBC or ITV Breakfast TV, This
                Morning or any RTÉ, TV3, Virgin Media or national interview or magazine programme.
              </li>
              <li>
                at all times during the period of this Agreement, to conduct themselves in a professional and proper
                manner and in accordance with company rules and standard industry practice, and not in any way to
                conduct themselves so as to bring The Producer’s name or the name of The Production into disrepute;
              </li>
              <li>
                to maintain a proper and professional standard of care towards any property of The Production which The
                Producer’s services require The Contractor to use, and to act upon instructions of The Producer’s
                appointed personnel with regard to such care;
              </li>
              <li>
                as this is an exclusive contract, for the duration of the term detailed above, not to enter into any
                other professional commitments unless approved in writing, in advance, by The Producer;
              </li>
              <li>
                to, at no time during the period of this Agreement, travel more than 30 miles from the venue where the
                Production is being presented or is about to be presented without informing, and receiving consent from,
                The Producer in advance of this travel. If The Contractor does so travel (with or without permission),
                they commit to take all reasonable steps to keep the Producer informed as to their whereabouts and to
                return to within 30 miles of the location of their next call two hours prior to the call time.
              </li>
              <li>
                In consequence The Contractor fails to provide The Producer services as required by this agreement, such
                failure shall be deemed to be a material breach of this agreement. The Producer may, at its sole
                discretion withhold payments for any missed publicity calls, rehearsals and performances.{' '}
              </li>
              <li>
                not to make any statement or appearance in the press or in any other media relating to the Production or
                to The Producer’s involvement with The Production, before during or after the production, without the
                prior approval of The Producer or of its appointed press representative;
              </li>
              <li>
                The Contractor undertakes not to the return to the venue in any Christmas or Pantomime production for a
                period of three years from the last performance given under this contract except for a show under the
                control of The Producer{' '}
              </li>
              <li>
                to adhere at all times to any instructions, regulations or policies regarding Health and Safety issued
                by The Producer or its appointed representatives. The Contractor also agrees to act in accordance with
                all practices as may be sought to be implemented by The Producer or its representatives which have the
                purpose of safeguarding The Producer’s health and safety policies while providing services under this
                agreement. The Contractor agrees to inform the Producer immediately of any concern regarding, or breach
                of, these Health and Safety policies or industry best practice regarding Health and Safety.
              </li>
              <li>
                to accept full responsibility for all of The Producer’s personal property and guard against loss of or
                damage to such property. The Contractor acknowledges that The Producer shall have no responsibility for
                any loss or damage thereto The Contractor ’s personal property unless prior approval has been sought and
                granted for its use on the production.
              </li>
              <li>
                The Contractor hereby indemnifies The Producer against all actions, costs, claims, losses, expenses or
                damages arising from any breach by The Contractor of these warranties, representations and undertakings
                or any other provision of this Agreement.
              </li>
              <li>
                The Producer hereby indemnifies The Contractor against all actions, costs, claims, losses, expenses or
                damages arising from any breach by The Producer of these warranties, representations and undertakings or
                any other provision of this Agreement.
              </li>
            </ul>
          </div>
        </div>

        <div className="details">
          <div className="details-title">
            <strong>E.</strong>
            <strong>ABSENCE</strong>
          </div>

          <div className="details-subsection">
            <strong>1.Notification</strong>
          </div>
          <p>
            If The Contractor is unable to attend rehearsals or performances, they must advise The Producer as soon as
            possible for cover to be arranged. The Contractor should let The Producer know as soon as possible on each
            day of a continued absence (unless The Producer already knows how long The Contractor shall be absent). The
            Contractor must also inform The Producer where and how they shall be able to contact The Contractor during
            the absence.{' '}
          </p>

          <div className="details-subsection">
            <strong>2.Illness and Injury</strong>
            <div className="details-subsection">
              <strong>i. Certificates</strong>
            </div>
          </div>
          <p>
            As soon as practicable The Contractor should provide The Producer with a self-certificate indicating the
            nature of illness or injury and the likely date of their return. In any event, if the absence is longer than
            seven days, The Contractor must provide The Producer with a doctor’s certificate. If at any time The
            Producer wants The Contractor to see a doctor, then provided that The Producer pays the costs, The
            Contractor agrees to be examined by them.
          </p>

          <div className="details-subsection">
            <div className="details-subsection">
              <strong>ii. Payment During Absence – Initial rehearsals</strong>
            </div>
          </div>
          <p>
            If The Contractor is absent from work in the rehearsal period as a result of illness or injury, and provided
            that they have followed the procedure above, The Producer shall continue to pay The Contractor at 1/6
            (one-sixth) of their basic rehearsal salary for each day of absence to a maximum of three days in each
            absence period.
          </p>
          <p>
            This rate shall be payable for a maximum of 24 days (four weeks) of absence in each twelve-month period
            (pro-rated for shorter contracts) running from the date of The Contractor ’s first attendance. If The
            Contractor reaches the maximum number of days of absence, then the right to terminate as set out below shall
            apply. However, in advance of that, if it becomes impossible for The Contractor to return to work because of
            the number of rehearsals missed then the contract shall be terminated by The Producer when that point is
            reached. Alternatively, if The Contractor returns to work and it becomes clear to The Producer that The
            Contractor will be unable to work effectively on The Production because of the time missed or the illness or
            injury persisting, then The Producer will be entitled to end the contract at that time with no notice due.
          </p>
          <p>
            In no event, however, shall The Contractor be entitled to more weeks of paid absence than the number of
            weeks for which they have been employed.
          </p>

          <div className="details-subsection">
            <div className="details-subsection">
              <strong>iii. Payment during absence – Performance</strong>
            </div>
          </div>
          <p>
            If The Contractor is absent from work after their first paid performance as a result of illness. or injury
            and provided they have followed the procedure above, The Contractor shall continue to be paid on a pro-rata
            basis of their basic performance salary (inclusive of any contractual responsibility payments due to The
            Contractor), capped at pro-rata of The Contractor’s Ceiling Salary, for each performance missed.
          </p>
          <p>
            This rate shall be payable for a maximum of 24 days (four weeks) of absence in each twelve-month period
            (pro-rated for shorter contracts) running from the date of The Contractor’s first rehearsal. If The
            Contractor reaches the maximum number of days, the right to terminate the Contract as set out below can be
            exercised. However, any absence payments made during the rehearsal periods for illness or injury will be
            deducted from the total allowances.
          </p>
          <p>
            In the exceptional circumstance when The Contractor is too ill to attend some calls in a day, but well
            enough to attend others, they shall be paid a combination of full pay and illness pay. This shall be
            proportional to the calls that The Contractor did attend in relation to those for which they were called,
            calculated in units of fifteen minutes.
          </p>

          <div className="details-subsection">
            <div className="details-subsection">
              <strong>iv. Ongoing absence</strong>
            </div>
          </div>
          <p>
            In the event that The Contractor is absent from work as a result of illness or injury for more than the 24
            (twenty four) days (pro-rated for shorter contracts) for which payment is made as above, The Producer may
            either continue to pay The Contractor’s basic performance salary (exclusive of any contractual
            responsibility payments due to The Contractor), or give The Contractor written notice of the termination of
            their Contract. If The Producer does not terminate The Contractor ‘s Contract, The Producer shall continue
            to pay to The Contractor their basic performance salary without prejudice to The Producer’s right to
            terminate The Contractor’s Contract, should absence through illness or injury continue.
          </p>

          <div className="details-subsection">
            <div className="details-subsection">
              <strong>v. Statutory Sick Pay (SSP)</strong>
            </div>
          </div>
          <p>
            The payments described above in relation to absence from rehearsals and performances due to illness or
            injury shall be deemed to be inclusive of any SSP that The Contractor may be entitled to receive. For the
            avoidance of doubt, The Contractor is not entitled to SSP in addition to the payments set out in above, save
            that once the payments above have ceased any remaining entitlement to SSP shall be payable.
          </p>

          <div className="details-subsection">
            <div className="details-subsection">
              <strong>vi. Treatment Costs</strong>
            </div>
          </div>
          <p>
            The Contractor must consult with The Producer and receive The Producer’s approval in advance of any
            treatment being carried out. The Producer has the right of approval of the healthcare provider, the type of
            treatment. (including whether treatment is to be provided privately or by the NHS) and any costs of the
            treatment.
          </p>
          <p>
            In the highly unlikely event of The Producer electing to meet the costs of treatment; only where their prior
            approval has been given of the healthcare provider, the type of treatment and of any costs if applicable,
            may treatment be booked. The Contractor must provide The Producer with full information relating to
            treatment, including details of any ongoing treatment where applicable.{' '}
          </p>
          <p>
            Where it is the opinion (given in writing) of The Contractor ‘s medical professional (e.g. (but not limited
            to) physician, dentist, chiropractor, physiotherapist or osteopath) that treatment needs to continue after
            the end of the Contract with The Producer, The Producer will not pay ongoing treatment once The Contractor
            has ceased to be employed.
          </p>
          <p>
            The Producer may, in the interests of The Production and, at The Producer’s sole discretion, elect to meet
            the cost of any treatment required. This does not, in any way, indicate The Producer’s responsibility or
            liability for the injury nor create an ongoing liability to pay for such treatment.
          </p>
        </div>

        <div className="details">
          <div className="details-title">
            <strong>G.</strong>
            <strong>CONSENTS</strong>
          </div>
          <p>
            The Contractor hereby grants the company the right, without making additional payment, to record their
            performance for archival purposes. Furthermore, The Contractor will allow The Producer at no cost to arrange
            television or radio performances of excerpts of the Production for publicity purposes, provided the excerpts
            are limited to a broadcast length of not more than fifteen minutes.
          </p>
        </div>

        <div className="details">
          <div className="details-title">
            <strong>H.</strong>
            <strong>FORCE MAJEURE</strong>
          </div>
          <p>
            In an event of Force Majeure, where rehearsal or performance spaces become unavailable, this contract may
            immediately be suspended, and no payments shall be due between the start and end of the event causing
            suspension. If The Producer (the affected party) is prevented or hindered from complying with any of its
            obligations under this agreement by a force majeure event (as defined below) it shall, as soon as reasonably
            practicable, give notice to the other party giving details of the force majeure event and, where possible, a
            reasonable estimate of the period during which the affected party expects the force majeure event to
            continue. The affected party shall also give notice to the other party promptly after the force majeure
            event ceases to affect its performance. During a force majeure event no payments shall be due by The
            Producer to The Contractor. Provided that, as soon as was practicable, the affected party has given notice
            of the force majeure event, the affected party shall not be liable for the consequences of any delay in
            performing or failure to perform any of its obligations under this agreement to the extent that such delay
            or failure is caused by the force majeure event.
          </p>
          <p>
            The parties shall use all reasonable endeavours to mitigate the effect of any force majeure event, but if
            any force majeure event continues for more than three months, either party shall be entitled to terminate
            this agreement on giving notice to the other party with immediate effect. For the purposes of this clause, a
            force majeure event constitutes any event beyond the reasonable control of the affected party including,
            without limitation, strikes, lock-outs, labour disputes, acts of god, war, riots, civil commotion, malicious
            damage, any form of governmental intervention, royal demise, order, rule, regulation or direction,
            pandemics, mass infections or threat of mass infections, closure of venues (by Government decree or
            otherwise) times of national emergency, accident, breakdown of plant or machine, red weather warnings, fire,
            flood, storm, other natural disaster or for any other reason not listed but resulting, directly or
            indirectly, in an inability to perform their obligations.
          </p>
        </div>

        <div className="details">
          <div className="details-title">
            <strong>I.</strong>
            <strong>ENTIRE AGREEMENT</strong>
          </div>
          <p>
            This Agreement constitutes the entire understanding between the parties and replaces all prior
            understandings and agreements between the parties in respect of the subject matter of this Agreement and may
            not be modified orally.
          </p>
          <p>
            The parties agree that this Agreement may be signed in counterparts, all of which, taken together, shall be
            deemed an original. Executed copies of this Agreement transmitted electronically in Portable Document Format
            (PDF) shall be treated as originals, fully binding and with full legal force and effect and the parties
            waive any rights they may have to object to such treatment.
          </p>
          <p>
            The waiver by any party hereto of the breach of any one or more of the provisions of this Agreement shall
            not be construed to be a waiver or consent by such party to any prior or subsequent breaches by the other
            party of the same or any other provision of this Agreement.
          </p>
          <p>
            In the event of a dispute between parties which cannot be resolved internally, the dispute shall be
            presented to the President of UK Theatre who will convene an independent panel and its decision will be
            final.
          </p>
          <p>
            The Producer shall have the right to assign all or any part of its rights hereunder to any person, firm or
            corporation, provided (i) such assignee assumes the obligations of The Producer hereunder, and (ii) The
            Contractor consents to such assignment, such consent not to be unreasonably withheld or refused. The
            Producer shall remain fully liable for all of its obligations hereunder in the event of any such assignment.
            The Contractor shall not have the right to assign any of their obligations hereunder.
          </p>
          <p>
            This contract is governed by Scots law. Both parties hereby prorogate the jurisdiction of the Sheriffdom at
            Glasgow and Strathkelvin
          </p>
        </div>
      </div>

      <div className="footer">
        <div>
          <strong>SIGNED</strong> by
        </div>

        <div>
          <strong>Robert C Kelly</strong>
        </div>

        <img src="/segue/contracts/rcksignature.jpg" alt="RCK Signature" />

        <div>
          <p>
            <strong>for and on behalf of</strong>
          </p>
          <p>
            <strong>{productionCompany?.ProdCoName ? productionCompany.ProdCoName : 'PRODUCTION COMPANY'}</strong>
          </p>
          <p>
            <strong>DATE IS AS PER SCHEDULE CLAUSE 1</strong>
          </p>
        </div>
        <div>
          <strong>SIGNED</strong> by
        </div>
        <div>
          <div>
            <strong>THE CONTRACTOR</strong> _________________________________________________{' '}
          </div>
          <div>
            <strong>NAME</strong> _________________________________________________{' '}
          </div>
          <div>
            <strong>DATE</strong> _________________________________________________{' '}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default JendagiContract;

import styled from 'styled-components';

const JendagiContract = () => {
  const Container = styled.div`
    height: fit-content;
    background-color: #fff;
    padding: 40px;

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
      margin-bottom: 700px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0 auto;
      margin-bottom: 400px;
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

    .details-title {
      display: flex;
      column-gap: 45px;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    ul {
      list-style-type: none;
      padding-left: 20px;
    }

    ul li {
      margin-bottom: 10px;
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

  return (
    <Container>
      <div className="title-container">
        <strong>DEPARTMENT CONTRACT SCHEDULE</strong>
        <span>THIS SCHEDULE SHALL BE DEEMED ANNEXED</span>
        <span>AND FORMS PART OF THE CONTRACT BELOW</span>
      </div>

      <table>
        <tr>
          <td>1</td>
          <td>DOCUMENT ISSUE DATE</td>
          <td>DATE OF PDF EXPORT</td>
        </tr>
        <tr>
          <td>2</td>
          <td>“DEPARTMENT” NAME/ADDRESS</td>
          <td>&lt;PERSON NAME, PERSON ADDRESS, PERSON TOWN, PERSON POSTCODE, PERSON COUNTRY&gt;</td>
        </tr>
        <tr>
          <td>3</td>
          <td>AGENT NAME/ADDRESS</td>
          <td>
            Either N/A or &lt;AGENT FIRSTNAME LASTNAME, AGENCY NAME, AGENCY ADDRESS, AGENCY TOWN, AGENCY POSTCODE,
            AGENCY COUNTRY&gt;
          </td>
        </tr>
        <tr>
          <td>4</td>
          <td>The PRODUCTION</td>
          <td>&lt;SHOWNAME&gt;</td>
        </tr>
        <tr>
          <td>5</td>
          <td>ENGAGED AS</td>
          <td>&lt;ROLE&gt;</td>
        </tr>
        <tr>
          <td>6</td>
          <td>FIRST DAY OF WORK</td>
          <td>On or around &lt;FIRST DAY OF WORK&gt;</td>
        </tr>
        <tr>
          <td>7</td>
          <td>REHEARSAL TOWN/CITY</td>
          <td>Likely to be &lt;REHEARSAL TOWN / CITY&gt;</td>
        </tr>
        <tr>
          <td>8</td>
          <td>REHEARSAL VENUES</td>
          <td>Likely to be &lt;REHEARSAL VENUE + REHEARSAL VENUE NOTES&gt;</td>
        </tr>
        <tr>
          <td>9</td>
          <td>REHEARSAL SALARY</td>
          <td>
            Either &lt;CONTRACT CURRENCY&gt;&lt;REHEARSAL SALARY&gt; buyout per week plus &lt;CONTRACT
            CURRENCY&gt;&lt;REHEARSAL HOLIDAY PAY&gt; per week holiday pay, to include any and all additional payments.
            Pro-rated for part weeks OR ‘Included in Total Fee’
          </td>
        </tr>
        <tr>
          <td>10</td>
          <td>FIRST PAID PERFORMANCE DATE</td>
          <td>On or around &lt;FIRST PERFORMANCE DATE&gt;</td>
        </tr>
        <tr>
          <td>11</td>
          <td>NORMAL PLACE OF WORK</td>
          <td>
            At 8/ as required and [Either &lt;VENUE&gt; if all performance bookings are at the same venue or ‘On Tour’]
          </td>
        </tr>
        <tr>
          <td>12</td>
          <td>END DATE</td>
          <td>&lt;END DATE&gt;, or upon issue of two weeks’ notice by producer, whichever shall come first.</td>
        </tr>
        <tr>
          <td>13</td>
          <td>NOMINATED DRIVER STATUS</td>
          <td>N/A or &lt;DRIVER NOTES FIELD&gt;</td>
        </tr>
        <tr>
          <td>14</td>
          <td>[Either ‘PERFORMANCE FEE’ if weekly ‘payments’ selected, or ‘TOTAL FEE’ if ‘total fee’ selected]</td>
          <td>
            Either &lt;CONTRACT CURRENCY&gt;&lt;PERFORMANCE SALARY&gt; buyout plus &lt;CONTRACT
            CURRENCY&gt;&lt;PERFORMANCE HOLIDAY PAY&gt; holiday pay per performance week. Performance fee will be
            pro-rated for part weeks and for part rehearsal / part performance weeks.
            <br />
            or <br />
            &lt;CONTRACT CURRENCY&gt;&lt;TOTAL FEE&gt; plus &lt;CONTRACT CURRENCY&gt;&lt;TOTAL FEE HOLIDAY
            PAY&gt;&lt;HOLIDAY PAY NOTES FIELD&gt;
            <br />
            <br />
            Payments are fully inclusive of (but not restricted to) overtime / additional performances / travel and
            accommodation except as detailed at clause 17/18.
            <br />
            <br />
            You must advise prior to signing this contract if you are VAT registered.
          </td>
        </tr>
        <tr>
          <td>15</td>
          <td>TOURING ALLOWANCE</td>
          <td>Either N/A or &lt;WEEKLY TOURING ALLOWANCE + TOURING ALLOWANCE NOTES&gt;</td>
        </tr>
        <tr>
          <td>16</td>
          <td>PAYMENTS</td>
          <td>
            Either Payments of rehearsal salary and performance fee will be made weekly to a nominated bank account,
            following receipt of an invoice. Invoices should be submitted in advance OR &lt;TOTAL FEE PAYMENTS NOTES
            FIELD&gt;
            <br />
            <br />
            <span className="highlight">[If payment breakdown dates are selected:]</span>
            <br />
            Please note: this clause is not contractual; it is a guide only. Dates and exact payment breakdown may
            differ:
            <br />
            &lt;DAY, DD/MM/YY: CONTRACT CURRENCY+AMOUNT&gt;
            <br />
            &lt;DAY, DD/MM/YY: CONTRACT CURRENCY+AMOUNT&gt;
            <br />
            <br />
            Holidays may be declared by &lt;PRODUCTION COMPANY&gt;. Holiday pay shall be accrued and paid during
            declared holidays. Any outstanding holiday pay will be paid at the end of the contract. Holiday pay shall be
            at the rate stated in Clause 14.
          </td>
        </tr>
        <tr>
          <td>17</td>
          <td>ACCOMMODATION</td>
          <td>
            <span className="highlight">
              [If Accommodation provided Yes/No, is NO then ‘The Contractor is responsible for arranging and paying for
              their own accommodation throughout.’]
            </span>
            <br />
            <br />
            If YES then &lt;ACCOMMODATION NOTES FIELD&gt;
          </td>
        </tr>
        <tr>
          <td>18</td>
          <td>TRANSPORT</td>
          <td>
            <span className="highlight">
              [If Transport provided Yes/No, is NO then ‘The Contractor is responsible for arranging and paying for
              their own transport throughout.’]
            </span>
            <br />
            <br />
            If YES then &lt;TRANSPORT NOTES FIELD&gt;
          </td>
        </tr>
        <tr>
          <td>19</td>
          <td>
            <span className="highlight">“DEPARTMENT”</span> AVAILABILITY
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
            be required to attend these if advised by the CSM or the Producer
            <br />
            <br />
            &lt;AVAILABILITY NOTES FIELD&gt;
          </td>
        </tr>
        <tr>
          <td>20</td>
          <td>PUBLICITY AND SPONSORSHIP</td>
          <td>
            <span className="highlight">[If Required at publicity events is checked, then]</span>
            <br />
            The Contractor will be required to attend the following events:
            <br />
            &lt;DAY, DD/MM/YY: NOTES&gt;
            <br />
            &lt;DAY, DD/MM/YY: NOTES&gt;
            <br />
            <br />
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
          <td>YES/NO</td>
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
            [If NO is selected for ‘Included additional clauses?’ then ‘N/A’ if YES the included any selected clauses
            plus ‘CUSTOM CLAUSES’ COVID-19 ADDITIONAL CLAUSES: The following clauses are to clarify the situation if it
            becomes difficult or impossible to perform the show directly as a result of, or due to the knock-on effects
            of, a pandemic type illness, COVID-19, or any variant thereof. Throughout this contract where “Covid 19” is
            mentioned this shall be read to mean any widespread or pandemic type of illness. i] Producer may move show
            start date if venues become unavailable or if performance commencement becomes unviable because of issues
            surrounding COVID-19. The start date be moved by up to 25% of the total contractual weeks. If the production
            fails to open within 6 weeks of original date then the Contractor may resile from contract. ii] Producer may
            specify unpaid weeks out with 4 weeks’ notice. These may be up to 1/6th of the total number of contractual
            weeks. iii] Producer may declare paid holidays with 3 weeks’ notice. iv] if, after the contract is signed,
            The Producer terminates the agreement prior to opening the show because the production is no longer viable
            due to issues created by COVID-19, either two weeks’ notice shall be given and worked or if closure is
            immediate then a one-off payment of CONTRACT CURRENCY + CANCELLATION FEE shall be made in lieu of all sums
            due. The viability of the show will be a matter for the sole determination of the Producer. If performances
            have been given under this contract by the time of cancellation, then the Contractor shall receive their
            performance fee for those performances, and then a cancellation fee of CONTRACT CURRENCY + CANCELLATION FEE
            less any performance fees given. v] The Contractor must have received all doses of a UK or Irish Government
            approved Covid 19 vaccination (and, if appropriate, booster injections) prior to signing this contract. The
            Contractor shall display upon Producer’s demand proof of vaccination status. If the Contractor is medically
            exempt from receiving the vaccine, the Producer must be notified prior to the signing of this contract, be
            agreeable in writing to the Contractor not being vaccinated or the contract shall be void. vi] By signing
            this contract the Contractor agrees to undertake Covid testing, and mask wearing as deemed necessary by the
            producer.]
          </td>
        </tr>
        <tr>
          <td>25</td>
          <td>MANAGER OR PRODUCER</td>
          <td>PRODUCTION COMPANY</td>
        </tr>
      </table>

      <div className="toursummary-container">
        <u>
          <strong>All dates and performance times remain subject to change at any time.</strong>
        </u>
        <div>
          INSERT export of ‘Tour summary’ with the following columns: Day | Date | Week | Venue/Details | Perfs/Day |
          Perf 1 Time | Perf 2 Time | Perf 3 Time | (etc)
        </div>
        <u>
          <strong>All dates and performance times remain subject to change at any time.</strong>
        </u>
      </div>

      <div className="details-container">
        <p>
          PRODUCTION COMPANY (“The Producer”) hereby engages The Contractor to render their services in connection with
          The Producer’s production (“the Production”) of the dramatic work as detailed at clause 4 of the foregoing
          schedule, on the terms and subject to the conditions set out in this Agreement.
        </p>

        <p>
          <strong>NOW IT IS HEREBY AGREED</strong> as follows:{' '}
        </p>

        <div>
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

        <div>
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

        <div>
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

        <div>
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

        <div>
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
                o accept full responsibility for all of The Producer’s personal property and guard against loss of or
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
      </div>
    </Container>
  );
};

export default JendagiContract;

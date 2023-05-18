import { useEffect, useState } from 'react'
import { userService } from 'services/user.service'
import Email from '../copyButton/email'
import { dateService } from 'services/dateService'
import moment from 'moment'
import axios from 'axios'
import { LoadingPage } from 'components/global/LoadingPage'

interface props {
  searchFilter: String;
}
export default function Entry({ searchFilter }: props) {
  const [activeSetTours, setActiveSetTours] = useState([]);
  const [activeSetTourDates, setActiveSetTourDates] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [loadedEmails, setLoadedEmails] = useState([]);
  const [salesWeeks, SetSalesWeeks] = useState([]);
  const [salesWeeksVenues, SetSalesWeeksVenues] = useState([]);
  const [bookingSaleId, setBookingSaleId] = useState(null);
  const type = 1;
  const AccountId = userService.userValue.accountId;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/marketing/sales/emailImport/${AccountId}/${type}`)
      .then((res) => res.json())
      .then((res) => {
        setLoadedEmails(res);
      });
    fetch(`/api/tours/read/notArchived/${userService.userValue.accountId}`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json;charset=UTF-8',
            "segue_admin": userService.userValue.segueAdmin,
            "account_admin": userService.userValue.accountAdmin,
            "user_id": userService.userValue.userId
          },
        })
      .then((res) => res.json())
      .then((res) => {
        setActiveSetTours(res);

        setLoading(false);
      });
  }, []);

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({
    SetTour: null,
    Venue: null,
    SeatsSold: 0,
    SeatsSoldValue: 0,
    SchoolsSeatsSold: 0,
    SchoolsSeatsSoldValue: 0,
    Confirmed: false,

    BookingId: 0,
    PromoterSeats: 0,
    SeatReservedValue: 0,
    ReservedSeats: 0,
    CastCrewSeats: 0,
    HouseManagementSeats: 0,
    TechnicalSeats: 0,
    VenueSeats: 0,
    OtherSeats: 0,
    StaffSeats: 0,
    RestrictedViewSeats: 0,
    CompanionSpaceSeats: 0,
    WheelchairSeats: 0,
    OffSaleSeats: 0,
    MixerSeats: 0,
    PressSeats: 0,
    CastCrewHoldsValue: 0,
    CastCrewHoldsSeats: 0,
    HouseManagementHoldsValue: 0,
    HouseManagementHoldsSeats: 0,
    TechnicalHoldsValue: 0,
    TechnicalHoldsSeats: 0,
    VenueHoldsSeats: 0,
    VenueHoldsValue: 0,
    OtherHoldsValue: 0,
    OtherHoldsSeats: 0,
    StaffHoldsValue: 0,
    StaffHoldsSeats: 0,
    RestrictedViewSeatsHoldsValue: 0,
    RestrictedViewSeatsHoldsSeats: 0,
    CompanionSpaceHoldsValue: 0,
    CompanionSpaceHoldsSeats: 0,
    WheelchairSpaceHoldsValue: 0,
    WheelchairSpaceHoldsSeats: 0,
    OffSaleHoldsValue: 0,
    OffSaleHoldsSeats: 0,
    MixerHoldsSeats: 0,
    MixerHoldsValue: 0,
    PressHoldsSeats: 0,
    PressHoldsValue: 0,
    PromoterHoldsValue: 0,
    PromoterHoldsSeats: 0,
    BookingSaleNotes: "",
    CompNotes: "",
    HoldNotes: "",
    BookingSaleId: null,
  });

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: msg },
      });
      setInputs({
        BookingSaleId: null,
        BookingSaleNotes: "",
        CompNotes: "",
        HoldNotes: "",
        CastCrewHoldsSeats: 0,
        CastCrewHoldsValue: 0,
        CastCrewSeats: 0,
        CompanionSpaceHoldsSeats: 0,
        CompanionSpaceHoldsValue: 0,
        CompanionSpaceSeats: 0,
        HouseManagementHoldsSeats: 0,
        HouseManagementHoldsValue: 0,
        HouseManagementSeats: 0,
        MixerHoldsSeats: 0,
        MixerHoldsValue: 0,
        MixerSeats: 0,
        OffSaleHoldsSeats: 0,
        OffSaleHoldsValue: 0,
        OffSaleSeats: 0,
        OtherHoldsSeats: 0,
        OtherHoldsValue: 0,
        OtherSeats: 0,
        PressHoldsSeats: 0,
        PressHoldsValue: 0,
        PressSeats: 0,
        PromoterHoldsSeats: 0,
        PromoterHoldsValue: 0,
        PromoterSeats: 0,
        ReservedSeats: 0,
        RestrictedViewSeats: 0,
        RestrictedViewSeatsHoldsSeats: 0,
        RestrictedViewSeatsHoldsValue: 0,
        SeatReservedValue: 0,
        StaffHoldsSeats: 0,
        StaffHoldsValue: 0,
        StaffSeats: 0,
        TechnicalHoldsSeats: 0,
        TechnicalHoldsValue: 0,
        TechnicalSeats: 0,
        VenueHoldsSeats: 0,
        VenueHoldsValue: 0,
        VenueSeats: 0,
        WheelchairSeats: 0,
        WheelchairSpaceHoldsSeats: 0,
        WheelchairSpaceHoldsValue: 0,

        SetTour: null,
        Venue: null,
        SeatsSold: 0,
        SeatsSoldValue: 0,
        SchoolsSeatsSold: 0,
        SchoolsSeatsSoldValue: 0,
        Confirmed: false,

        BookingId: 0,
      });
    } else {
      // @ts-ignore
      setStatus(false);
    }
  };

  if (isLoading) return <LoadingPage />

  /**
   * Onn update of activeSetTours
   * Venues need updated
   */
  function setTour(TourID) {
    fetch(`/api/tours/read/tourDates/${TourID}`)
      .then((res) => res.json())
      .then((res) => {
        setActiveSetTourDates(res);
      });
  }

  /**
   *  Booking ID set from Venue/Date
   */
  function setVenueDate(TourId) {
    //alert(TourId)
    fetch(`/api/tours/read/week/${TourId}`)
      .then((res) => res.json())
      .then((res) => {
        SetSalesWeeksVenues([]);
        SetSalesWeeks(res);
      });

    inputs.BookingId = 999; //"Found Booking ID"
  }

  function setVenueWeek(RawMondayDate) {
    let MondayDate = moment(new Date(RawMondayDate)).format("yyyy-MM-DD");
    let SundayDate = moment(new Date(RawMondayDate))
      .add(6, "days")
      .format("yyyy-MM-DD");

    fetch(
      `/api/bookings/ShowWeek/${inputs.SetTour}/${MondayDate}/${SundayDate}`
    )
      .then((res) => res.json())
      .then((res) => {
        SetSalesWeeksVenues(res);
      });
  }

  const handleOnChange = (e) => {
    e.persist();

    if (e.target.name === "SetTour") {
      setTour(e.target.value);
      setVenueDate(e.target.value);
    }
    if (e.target.name === "SaleWeek") {
      setVenueWeek(e.target.value);
    }

    if (e.target.name === "Venue") {
      inputs.BookingId = e.target.value;
    }

    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };

  function importEmail(id) {
    setInputs({
      BookingSaleId: null,
      BookingSaleNotes: "",
      CompNotes: "",
      HoldNotes: "",
      PromoterSeats: undefined,
      SetTour: "",
      CastCrewHoldsSeats: undefined,
      CastCrewHoldsValue: undefined,
      CastCrewSeats: undefined,
      CompanionSpaceHoldsSeats: undefined,
      CompanionSpaceHoldsValue: undefined,
      CompanionSpaceSeats: undefined,
      HouseManagementHoldsSeats: undefined,
      HouseManagementHoldsValue: undefined,
      HouseManagementSeats: undefined,
      MixerHoldsSeats: undefined,
      MixerHoldsValue: undefined,
      MixerSeats: undefined,
      OffSaleHoldsSeats: undefined,
      OffSaleHoldsValue: undefined,
      OffSaleSeats: undefined,
      OtherHoldsSeats: undefined,
      OtherHoldsValue: undefined,
      OtherSeats: undefined,
      PressHoldsSeats: undefined,
      PressHoldsValue: undefined,
      PressSeats: undefined,
      PromoterHoldsSeats: undefined,
      PromoterHoldsValue: undefined,
      ReservedSeats: undefined,
      RestrictedViewSeats: undefined,
      RestrictedViewSeatsHoldsSeats: undefined,
      RestrictedViewSeatsHoldsValue: undefined,
      SeatReservedValue: undefined,
      StaffHoldsSeats: undefined,
      StaffHoldsValue: undefined,
      StaffSeats: undefined,
      TechnicalHoldsSeats: undefined,
      TechnicalHoldsValue: undefined,
      TechnicalSeats: undefined,
      VenueHoldsSeats: undefined,
      VenueHoldsValue: undefined,
      VenueSeats: undefined,
      WheelchairSeats: undefined,
      WheelchairSpaceHoldsSeats: undefined,
      WheelchairSpaceHoldsValue: undefined,
      Venue: 0,
      SeatsSold: 0,
      SeatsSoldValue: 0,
      SchoolsSeatsSold: 0,
      SchoolsSeatsSoldValue: 0,
      Confirmed: false,
      BookingId: 0,
    });
  }

  function copyToClipboard() {}

  async function addNotes() {
    alert("hello");
    await axios({
      method: "POST",
      url: "/api/marketing/sales/process/entry/BookingSaleNotes",
      data: inputs,
    });
  }

  async function onSubmit() {
    //Validation  TODO: Validation rules based on last weeks entires
    //alert("submit" + JSON.stringify(inputs))

    await axios({
      method: "POST",
      url: "/api/marketing/sales/process/entry/BookingSale",
      data: inputs,
    }).then((res) => {
      setBookingSaleId(res.data.BookingSaleId);
      addNotes();
    });

    // Reserved SeatsValue
    // BookingID, date, NumSeatsSold, SeatsSoldValue, ReservedSeatsSold, ReservedSeatsValue, finalFigures

    // BookingSaleHold
    // BookingSaleID, HoldId, Seats, Value

    // BookingSaleComp
    // BookingSaleID, CompId, Seats

    // BookingSaleNotes
    // BookingSaleId, HoldNotes, CompNotes, BookingSaleNotes
  }

  return (
    <div className="flex flex-row w-full">
      <div className={"flex bg-transparent w-5/8 p-5"}>
        <div className="flex-auto mx-4 mt-0overflow-hidden  ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
          <div className={"mb-1"}></div>
          <form onSubmit={onSubmit}>
            <div>
              <div className="bg-soft-primary-green p-4 rounded-md mb-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row items-center justify-between">
                    <label
                      htmlFor="SetTour"
                      className="text-sm font-medium text-gray-700"
                    >
                      Set Tour
                    </label>
                    <select
                      id="SetTour"
                      name="SetTour"
                      value={inputs.SetTour}
                      onChange={handleOnChange}
                      className="block w-full rounded-md drop-shadow-md max-w-lg border-gray-300  focus:border-primary-green focus:ring-primary-green  text-sm"
                    >
                      <option value={0}>Select A Tour</option>
                      {activeSetTours.map((item) => (
                        <option key={item.TourId} value={item.TourId}>
                          {item.Show.Code}/{item.Code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <label
                      htmlFor="SaleWeek"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tour Sale Week
                    </label>
                    <select
                      id="SaleWeek"
                      name="SaleWeek"
                      className="block w-full  max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green text-sm"
                      onChange={handleOnChange}
                    >
                      <option value={0}>Select A Tour</option>
                      {salesWeeks.map((item) => (
                        <option
                          key={item.RawMondayDate}
                          value={item.RawMondayDate}
                        >
                          {item.WeekName} ({item.Description})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <label
                      htmlFor="Venue"
                      className="text-sm font-medium text-gray-700"
                    >
                      Venue
                    </label>
                    <select
                      id="Venue"
                      name="Venue"
                      className="block bg-dark-primary-green w-full text-white max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green text-sm"
                      onChange={handleOnChange}
                    >
                      <option value={0}>Select A Performance</option>
                      {salesWeeksVenues.map((item) => (
                        <option key={item.BookingId} value={item.BookingId}>
                          {dateService.getWeekDay(item.ShowDate)}{" "}
                          {dateService.dateToSimple(item.ShowDate)} |{" "}
                          {item.Venue.Name} ({item.Venue.Town})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="columns-2">
                  <div className={"columns-1"}>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4  sm:pt-5">
                      <label
                        htmlFor="SeatSoldValue"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Sold Seat Value
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="SeatSoldValue"
                          id="SeatSoldValue"
                          value={inputs.SeatsSoldValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4   sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Reserved Seats Value
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="SeatReservedValue"
                          id="SeatReservedValue"
                          autoComplete="SeatReservedValue"
                          value={inputs.SeatReservedValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={"columns-1"}>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Seats Sold
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="SeatsSold"
                          id="SeatsSold"
                          autoComplete="SeatsSold"
                          value={inputs.SeatsSold}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4  sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Reserved Seats
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="ReservedSeats"
                          id="ReservedSeats"
                          autoComplete="ReservedSeats"
                          value={inputs.ReservedSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-cols-2 grid gap-4  md:gap-6 pt-10">
                <div className="sm:col-span-1" >
                  <div className={"flex flex-col"}>
                    <div className=" bg-dark-primary-green text-white rounded-t-md px-2 sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:border-t sm:border-gray-200 sm:pt-2">
                        <div className=" sm:col-span-1 sm:mt-0">Holds</div>
                        <div className=" sm:col-span-1 text-center sm:mt-0">Seats</div>
                        <div className=" sm:col-span-1 text-center sm:mt-0">Value</div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Promoter
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="PromoterHoldsSeats"
                          id="PromoterHoldsSeats"
                          autoComplete="PromoterHoldsSeats"
                          value={inputs.PromoterHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="PromoterHoldsValue"
                          id="PromoterHoldsValue"
                          autoComplete="PromoterHoldsValue"
                          value={inputs.PromoterHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Press
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="PressHoldsSeats"
                          id="PressHoldsSeats"
                          autoComplete="PressHoldsSeats"
                          value={inputs.PressHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="PressHoldsValue"
                          id="PressHoldsValue"
                          autoComplete="PressHoldsValue"
                          value={inputs.PressHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Mixer
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="MixerHoldsSeats"
                          id="MixerHoldsSeats"
                          autoComplete="MixerHoldsSeats"
                          value={inputs.MixerHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="MixerHoldsValue"
                          id="MixerHoldsValue"
                          autoComplete="MixerHoldsValue"
                          value={inputs.MixerHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Off sale
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="OffSaleHoldsSeats"
                          id="OffSaleHoldsSeats"
                          autoComplete="OffSaleHoldsSeats"
                          value={inputs.OffSaleHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="OffSaleHoldsValue"
                          id="OffSaleHoldsValue"
                          autoComplete="OffSaleHoldsValue"
                          value={inputs.OffSaleHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Wheelchair Spaces
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="WheelchairSpaceHoldsSeats"
                          id="WheelchairSpaceHoldsSeats"
                          autoComplete="WheelchairSpaceHoldsSeats"
                          value={inputs.WheelchairSpaceHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="WheelchairSpaceHoldsValue"
                          id="WheelchairSpaceHoldsValue"
                          autoComplete="WheelchairSpaceHoldsValue"
                          value={inputs.WheelchairSpaceHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Companion Spaces
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="CompanionSpaceHoldsSeats"
                          id="CompanionSpaceHoldsSeats"
                          autoComplete="CompanionSpaceHoldsSeats"
                          value={inputs.CompanionSpaceHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="CompanionSpaceHoldsValue"
                          id="CompanionSpaceHoldsValue"
                          autoComplete="CompanionSpaceHoldsValue"
                          value={inputs.CompanionSpaceHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Restricted View Seats
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="RestrictedViewSeatsHoldsSeats"
                          id="RestrictedViewSeatsHoldsSeats"
                          autoComplete="RestrictedViewSeatsHoldsSeats"
                          value={inputs.RestrictedViewSeatsHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="RestrictedViewSeatsHoldsValue"
                          id="RestrictedViewSeatsHoldsValue"
                          autoComplete="RestrictedViewSeatsHoldsValue"
                          value={inputs.RestrictedViewSeatsHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Staff
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="StaffHoldsSeats"
                          id="StaffHoldsSeats"
                          autoComplete="StaffHoldsSeats"
                          value={inputs.StaffHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="StaffHoldsValue"
                          id="StaffHoldsValue"
                          autoComplete="StaffHoldsValue"
                          value={inputs.StaffHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Other
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="OtherHoldsSeats"
                          id="OtherHoldsSeats"
                          autoComplete="OtherHoldsSeats"
                          value={inputs.OtherHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="OtherHoldsValue"
                          id="OtherHoldsValue"
                          autoComplete="OtherHoldsValue"
                          value={inputs.OtherHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Venue
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="VenueHoldsSeats"
                          id="VenueHoldsSeats"
                          autoComplete="VenueHoldsSeats"
                          value={inputs.VenueHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="VenueHoldsValue"
                          id="VenueHoldsValue"
                          autoComplete="VenueHoldsValue"
                          value={inputs.VenueHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Technical
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="TechnicalHoldsSeats"
                          id="TechnicalHoldsSeats"
                          autoComplete="TechnicalHoldsSeats"
                          value={inputs.TechnicalHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="TechnicalkHoldsValue"
                          id="TechnicalkHoldsValue"
                          autoComplete="TechnicalkHoldsValue"
                          value={inputs.TechnicalHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        House Management
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="HouseManagementHoldsSeats"
                          id="HouseManagementHoldsSeats"
                          autoComplete="HouseManagementHoldsSeats"
                          value={inputs.HouseManagementHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="HouseManagementHoldsValue"
                          id="HouseManagementHoldsValue"
                          autoComplete="HouseManagementHoldsValue"
                          value={inputs.HouseManagementHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Cast/Crew
                      </label>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="CastCrewHoldsSeats"
                          id="CastCrewHoldsSeats"
                          autoComplete="CastCrewHoldsSeats"
                          value={inputs.CastCrewHoldsSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <input
                          type="text"
                          name="CastCrewHoldsValue"
                          id="CastCrewHoldsValue"
                          autoComplete="CastCrewHoldsValue"
                          value={inputs.CastCrewHoldsValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"col-span-1"}>
                  <div className="sm:grid bg-dark-primary-green text-white sm:grid-cols-3 px-2 sm:items-start sm:gap-4 rounded-t-md sm:border-none sm:border-gray-200 pt-2">
                  <div className={" sm:col-span-1 "}>Comps</div>
                    <div className=" text-right sm:col-span-2 ">Seats</div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Promoter
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="PromoterSeats"
                        id="PromoterSeats"
                        autoComplete="PromoterSeats"
                        value={inputs.PromoterSeats}
                        onChange={handleOnChange}
                        className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Press
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="PressSeats"
                        id="PressSeats"
                        autoComplete="PressSeats"
                        value={inputs.PressSeats}
                        onChange={handleOnChange}
                        className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Mixer
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="MixerSeats"
                          id="MixerSeats"
                          autoComplete="MixerSeats"
                          value={inputs.MixerSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Off Sale
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="OffSaleSeats"
                          id="OffSaleSeats"
                          autoComplete="OffSaleSeats"
                          value={inputs.OffSaleSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Wheelchair Space
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="WheelchairSeats"
                          id="WheelchairSeats"
                          autoComplete="WheelchairSeats"
                          value={inputs.WheelchairSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Companion Space
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="CompanionSpaceSeats"
                          id="CompanionSpaceSeats"
                          autoComplete="CompanionSpaceSeats"
                          value={inputs.CompanionSpaceSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Restricted View Seats
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="RestrictedViewSeats"
                          id="RestrictedViewSeats"
                          autoComplete="RestrictedViewSeats"
                          value={inputs.RestrictedViewSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Staff
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="StaffSeats"
                          id="StaffSeats"
                          autoComplete="StaffSeats"
                          value={inputs.StaffSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Other
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="OtherSeats"
                          id="OtherSeats"
                          autoComplete="OtherSeats"
                          value={inputs.OtherSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Venue
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="VenueSeats"
                          id="VenueSeats"
                          autoComplete="VenueSeats"
                          value={inputs.VenueSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Technical
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="TechnicalSeats"
                          id="TechnicalSeats"
                          autoComplete="TechnicalSeats"
                          value={inputs.TechnicalSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      House Management
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="HouseManagementSeats"
                          id="HouseManagementSeats"
                          autoComplete="HouseManagementSeats"
                          value={inputs.HouseManagementSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Cast/Crew
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="CastCrewSeats"
                          id="CastCrewSeats"
                          autoComplete="CastCrewSeats"
                          value={inputs.CastCrewSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                <div className={"columns-1"}>
                  <div className="sm:grid sm:grid-cols-2 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                    <div className="flex flex-col w-full col-span-1">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                      Hold Notes
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <textarea
                        className="w-full"
                        onChange={handleOnChange}
                        name={"HoldNotes"}
                        id={"HoldNotes"}
                        value={inputs.HoldNotes}
                        ></textarea>
                    </div>
                        </div>
                <div className={"col-span-1"}>
                  <div className="flex flex-col px-2 sm:items-start sm:border-none sm:border-gray-200 w-full">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Comp Notes
                    </label>
                    <div className="mt-1 sm:mt-0">
                      <textarea
                        onChange={handleOnChange}
                        name={"CompNotes"}
                        id={"CompNotes"}
                        value={inputs.CompNotes}
                        className="w-full"

                      ></textarea>
                    </div>
                  </div>
                </div>
                </div>

              </div>
              <div className={"flex flex-col"}>
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Booking Sale Notes
                  </label>
                  <div className="mt-1 sm:mt-0 w-full">
                    <textarea
                      onChange={handleOnChange}
                      name={"BookingSaleNotes"}
                      id={"BookingSaleNotes"}
                      value={inputs.BookingSaleNotes}
                      className="w-full"
                    ></textarea>
                  </div>
              </div>
            </div>

            <button
              type={"submit"}
              className={
                "inline-flex items-center mt-5 rounded border border-gray-300 bg-primary-green w-100 h-16 text-white px-2.5 py-1.5 text-xs font-medium drop-shadow-md hover:bg-dark-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2"
              }
            >
              Add Sales Data
            </button>
          </form>
          <div>
            <Email></Email>
          </div>
        </div>
      </div>
      <div className={"flex bg-transparent flex flex-col w-1/3 p-5"}>
        {/* Buttons go here  */}
        <div className="grid grid-cols-2 gap-1 mb-4">

        <button className="bg-primary-green text-white drop-shadow-md px-4 rounded-md">Copy Last Weeks Sales Data</button>
        <button className="bg-primary-green text-white drop-shadow-md px-4 rounded-md">Insert Data From Email</button>
        </div>
        <div className="flex-auto mx-4 mt-0 overflow-hidden max-h-screen border-primary-green border   ring-opacity-5 sm:-mx-6 md:mx-0 ">
          <div className={"mb-1"}></div>
          <div>
            {loadedEmails.length > 0 && (
              <>
                <span>Click Email to load Data</span>
                {loadedEmails.map((item) => (
                  <div key={item.id}>
                    <button onClick={() => importEmail(item.Id)}>
                      <span>
                        {JSON.stringify(item)}
                        {item.SetTour} {dateService.dateToSimple(item.Date)}{" "}
                        Import
                      </span>
                    </button>
                  </div>
                ))}
              </>
            )}
            {loadedEmails.length == 0 && (
              <>
                <span></span>
              </>
            )}
          </div>
        </div>
        <span>Our system found the following sales emails which matches the tour sale</span>
      </div>
    </div>
  );
}

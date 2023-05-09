/**

 Do While Not BarringVenues.EOF

 With LocalBarringVenue
 .AddNew

 ' Copy everthing from BarringVenues into
 For Each Field In BarringVenues.Fields
 .Fields(Field.Name).Value = Field.Value
 Next

 LocalBarringVenue!CleverVenueName = CleverVenueName(LocalBarringVenue!BV_VenueName, LocalBarringVenue!BV_VenueTown)

 ' Work out venues barring ranges
 If IsDate(ShowDate) Then
 If Not IsNull(!UV_BarringWeeksPre) Then !UV_BarringStartDate = IIf(IsNumeric(!UV_BarringWeeksPre), DateAdd("ww", -!UV_BarringWeeksPre, ShowDate), ShowDate)
 If Not IsNull(!UV_BarringWeeksPost) Then !UV_BarringEndDate = IIf(IsNumeric(!UV_BarringWeeksPost), DateAdd("ww", !UV_BarringWeeksPost, ShowDate), ShowDate)
 End If
 If IsDate(!BV_BookingDate) Then
 If Not IsNull(!BV_BarringWeeksPre) Then !BV_BarringStartDate = IIf(IsNumeric(!BV_BarringWeeksPre), DateAdd("ww", -!BV_BarringWeeksPre, !BV_BookingDate), !BV_BookingDate)
 If Not IsNull(!BV_BarringWeeksPost) Then !BV_BarringEndDate = IIf(IsNumeric(!BV_BarringWeeksPost), DateAdd("ww", !BV_BarringWeeksPost, !BV_BookingDate), !BV_BookingDate)
 End If

 ' Work out if dates are in ranges
 If IsDate(ShowDate) Then
 !ShowDate = ShowDate

 ' Is User Venue date in Bookable Venue barring date range?
 !ShowDateInBVVRange = (!ShowDate > !BV_BarringStartDate) Or IsNull(!BV_BarringStartDate)                       ' the show date > pre weeks, or pre weeks is blank
 If !ShowDateInBVVRange Then !ShowDateInBVVRange = (!ShowDate < !BV_BarringEndDate) Or IsNull(!BV_BarringEndDate)     ' the show date < post weeks, or post weeks is blank
 End If
 If IsDate(!BV_BookingDate) Then
 ' Is BookedVenue date in User Venue barring date range?
 !BVDateInUVRange = (!BV_BookingDate > !UV_BarringStartDate) Or IsNull(!UV_BarringStartDate)                           ' the show date > pre weeks, or pre weeks is blank
 If !BVDateInUVRange Then !BVDateInUVRange = (!BV_BookingDate < !UV_BarringEndDate) Or IsNull(!UV_BarringEndDate)     ' the show date < post weeks, or post weeks is blank
 End If

 ' Apply Rules - User
 If !UV2BV_Mileage <= BarringMiles Then
 !BarringCode = "UM"
 !Reason = "<= " & BarringMiles & "m specified by user"
 End If

 ' Apply Rules - User Venue Mileage bars Bookable Venue
 If IsNull(!BarringCode) And !BVDateInUVRange And (!UV2BV_Mileage <= !UV_BarringMiles) Then
 !BarringCode = "VM"
 !Reason = !UV_VenueCode & " bars " & !BV_VenueCode & " ( <= " & !UV_BarringMiles & "m)"
 End If

 ' Apply Rules - User Venue bars Bookeable Venue
 If IsNull(!BarringCode) And !BVDateInUVRange And !UV_VenueBar Then
 !BarringCode = "VV"
 !Reason = !UV_VenueCode & " bars " & !BV_VenueCode
 End If

 ' Apply Rules - Bookeable Venue Mileage bars User Venue
 If IsNull(!BarringCode) And !ShowDateInBVVRange And (!UV2BV_Mileage <= !BV_BarringMiles) Then
 !BarringCode = "BM"
 !Reason = !BV_VenueCode & " bars " & !UV_VenueCode & " ( <= " & !BV_BarringMiles & "m)"
 End If

 ' Apply Rules - Bookable Venue bars User Venue
 If IsNull(!BarringCode) And !ShowDateInBVVRange And !BV_VenueBar Then
 !BarringCode = "BV"
 !Reason = !BV_VenueCode & " bars " & !UV_VenueCode
 End If

 LocalBarringVenue.Update
 End With

 BarringVenues.MoveNext

 Loop



 */
import {scalarOptions} from "yaml";
import Int = scalarOptions.Int;

export const barringService = {
    barredVenueList
};

function barredVenueList(VenueId: Int, TourId: Int, London: boolean, Seats: Int, TourOnly: Boolean){


    let BarringVenueList = fetch("api/barring/12/12/12/3/2")
        .then(barredVenueList=> console.log(barredVenueList))


}

CREATE  PROCEDURE `GetSuggestions`(
	IN P_CurrentBookingId int, 
    P_NotLondon bit, 
    P_LastDistMin smallint, 
    P_LastDistMax smallint, 
    P_NextDistMin smallint, 
    P_NextDistMax smallint, 
    P_LastTimeMinsMax smallint, 
    P_NextTimeMinsMax smallint, 
    P_MinSeats smallint)
BEGIN
	SELECT
		-- B Booking Slot
		0 AS Hidden,
		B.BookingId,
		B.TourId,
		B.ShowDate,
		
		-- PB = Previous Booking to booking slot (if there is one)
		PB.BookingId AS PreviousBookingId,
		PB.VenueId AS PreviousVenueId,
		PV.Name AS PreviousVenueName,
		
		-- NB = Next Booking to booking slot (if there is one)
		NB.BookingId AS NextBookingId,
		NB.VenueId AS NextVenueId,
		NV.Name AS NextVenueName,
		
		-- Suggested Venue 
		SV.VenueId As VenueId,
		SV.Code AS VenueCode,
		SV.Name As VenueName,
		SV.Seats AS Seats,
		SV.Town AS Town,
		
		(SELECT COUNT(*) FROM Booking EB WHERE EB.TourId = B.TourId AND EB.VenueId = SV.VenueId) As VenueTourCount,
		
		PB2B.Mileage AS MileageFromPreviousVenue,
		PB2B.TimeMins AS TravelTimeFromPreviousVenue,
		
		B2NB.Mileage AS MileageToNextVenue,
		B2NB.TimeMins AS TravelTimeToNextVenue,
		
		coalesce(PB2B.Mileage,0) + coalesce(B2NB.Mileage,0) as TotalMileage,
		coalesce(PB2B.TimeMins,0) + coalesce(B2NB.TimeMins,0) as TotalTimeMins,
        
        ConvertToTravelTime(coalesce(PB2B.TimeMins,0) + coalesce(B2NB.TimeMins,0)) AS TotalTimeHHMM
	FROM 
		Booking B
		INNER JOIN DateType DT ON DT.DateTypeId = B.DateTypeId 
		
		LEFT OUTER JOIN Booking PB ON PB.TourId = B.TourId AND PB.ShowDate = (SELECT Max(LB.ShowDate) FROM Booking LB WHERE (LB.TourId = B.TourId) AND (NOT LB.VenueId IS NULL) AND (LB.ShowDate < B.ShowDate))
		LEFT OUTER JOIN Booking NB ON NB.TourId = B.TourId AND NB.ShowDate = (SELECT Min(LB.ShowDate) FROM Booking LB WHERE (LB.TourId = B.TourId) AND (NOT LB.VenueId IS NULL) AND (LB.ShowDate > B.ShowDate))
​
		LEFT OUTER JOIN Venue PV ON PV.VenueId = PB.VenueId
		LEFT OUTER JOIN Venue NV ON NV.VenueId = NB.VenueId
		
		LEFT OUTER JOIN VenueVenueView PB2B ON PB.VenueId = PB2B.FromVenueId
		LEFT OUTER JOIN VenueVenueView B2NB ON NB.VenueId = B2NB.ToVenueId
		
		LEFT OUTER JOIN Venue SV ON SV.VenueId = if(NOT PB2B.ToVenueId IS NULL, PB2B.ToVenueId, B2NB.FromVenueId)
	WHERE 
		B.VenueId IS NULL 
        AND DT.Name IS NULL
        AND B.BookingId = P_CurrentBookingId
​
		AND ((B2NB.FromVenueId = PB2B.ToVenueId) OR (B2NB.FromVenueId IS NULL) OR (PB2B.ToVenueId IS NULL))
​
        AND NOT (SV.Town = "London" AND P_NotLondon)
        AND SV.Town NOT IN (SELECT DISTINCT V1.Town FROM Booking B1 INNER JOIN Venue V1 ON V1.VenueId = B1.VenueId WHERE B1.TourId = B.TourId AND V1.Town = SV.Town)
        
        AND ((PB2B.Mileage >= P_LastDistMin) OR (PB2B.Mileage IS NULL))
        AND ((PB2B.Mileage <= P_LastDistMax) OR (PB2B.Mileage IS NULL))
        
        AND ((B2NB.Mileage >= P_NextDistMin) OR (B2NB.Mileage IS NULL))
        AND ((B2NB.Mileage <= P_NextDistMax) OR (B2NB.Mileage IS NULL))
        
        AND ((PB2B.TimeMins <= P_LastTimeMinsMax) OR (PB2B.TimeMins IS NULL))
        AND B2NB.TimeMins <= P_NextTimeMinsMax
        
        AND SV.Seats >= P_MinSeats;
END

# Segue



## Installation


## Running

Ideal environment would be Nginx, Node 18 with PM2
After each build rested pm2#

 `npm run build`

 `pm2 restart all`

## Requirements

.env file with keys added 

- Node | Dev | Prod
  
- Npm | Dev | Prod

- PM2 | Prod

- Nginx | Prod

## External APIs 
### Bing Distance Matrix

Getting the Distance between Venues Is done Using a mapping service provided by morose that takes the location of 
each venue as A Latitude logdtidutre. 

- This requires a key to access the API 
- BING_MAPS_API_KEY: mapped to "key" in API
 
#### GPS Coordinates
https://learn.microsoft.com/en-us/bingmaps/rest-services/locations/find-a-location-by-address



#### Distance Matrix
https://learn.microsoft.com/en-us/bingmaps/rest-services/routes/calculate-a-distance-matrix

# Components
## Account Management
### User Management
## Shows
### Tours
### Bookings
### Barring Engine
## Tasks
## Reports
## Contracts
## Venues
### Distance Calculator
## Sales

# Services
## Logging Service

The logging service is used to take events from system usage and create an event log
### Error Logging

Logging an error can be done by sending a string to the logging service with the. This will generically log the error. 

`loggingService.logError(error)`

### Action Logging

This service will log the action with the logged in user attached in the Logging Sevice to do this add

`loggingService.logAction("{Action or component }","{Details of the action to be logged}")`

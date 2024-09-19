# Segue

## Running

Use local SQL database.

```
MYSQL_ROOT_PASSWORD="LOCAL_PASSWORD"
MYSQL_DATABASE="segue"
MYSQL_PORT=3306
DATABASE_URL="mysql://root:LOCAL_PASSWORD@127.0.0.1:3306/segue"
```

`docker-compose up` - Different tab for DB log
`primsa db push` - First time schema generation. Do not run on shared datebase. Local only
`tsx data/populateDatabase.ts` - Populate with dummy event data (WIP)
`npm run dev`

## Requirements

.env file with keys added
`tsx -g` - Execute scripts with same level of imports and support as NextJs code. Can share code with backend
`docker`
`prisma -g` - Database ORM

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

### Productions

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

This service will log the action with the logged in user attached in the Logging Sevice to do this add..

`loggingService.logAction("{Action or component }","{Details of the action to be logged}")`

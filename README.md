# GrubGuard Santa Cruz API Server
GrubGuard was an application for iOS and Android that displayed information
about food safety inspections for restaurants and facilities in the
county of Santa Cruz, California.

Users can search for facilities by name, or get a list of facilities sorted
by distance from the user if they choose to share their location permissions
with the app.

It was previously available on Google Play and the Apple App Store.

This is the API server backend. Mobile frontend code, and more information about the project, can be found in [this repo.](https://github.com/pdlandis/grubguard-santa-cruz-mobile)


## Quick API Reference

All responses are JSON-encoded lists of Facilities or Inspections.

| Method | URI                | Parameters | Result                                       |
| ------ | ------------------ | ---------- | -------------------------------------------- |
| GET    | `/api/facilities/` | None       | All Facility records. Used for testing. |
| GET    | `/api/facilities/<ID>` | ID: int | The Facility matching the given ID. |
| POST   | `/api/facilities/nearby` | longitude: float, latitude: float | Facilities within ~5 miles of the given coordinates. |
| POST   | `/api/facilities/search` | name: string | Facilities with names that include the given string as a substring. Case-insensitive. |
| GET   | `/api/inspections/<Facility ID>` | ID: int | A list of Inspections for the Facility with the given ID. |


## Data Retrieval Scripts
The API server also provides the scraping and parsing functionality that retrieves the data from the County of Santa Cruz.
These can be run using npm (e.g. `npm run update`.)

### Update
`npm run update`

Retrieves the HTML page containing current health inspection reports from the [County of Santa Cruz](https://sccounty01.co.santa-cruz.ca.us/EHRestaurantInspection/Home/GetInspections?sortBy=FACILITY_NAME&ascending=True&print=False).
This page is parsed for new Facilities and Inspections. Then, the geocoder is invoked to update geocoding on any necessary Facility records, including new ones.
This command should be run at a regular interval to keep the database up-to-date.

### Update without scraping
`npm run update_no_script`

Same as Update, but does not retrieve a new HTML page. Used to keep geocoding up to date.

### Process previously saved HTML pages
`npm run process_all`

Parses all previously saved HTML pages. If the HTML directory has all the records, this will verify the full integrity of the database.
Used when migrating to new database instances and recovering from errors that caused records to be incomplete.


## Development Details
The [GrubGuard frontend](https://github.com/pdlandis/grubguard-santa-cruz-mobile) was created using [NativeScript](https://nativescript.org/)
and written in TypeScript, HTML and CSS.

The GrubGuard API server (this repo) was created using Node.js (Express.) It uses the Mongoose ODM package to connect to a MongoDB instance.
The Google Maps API is used to geocode facility locations, so a valid Google Maps API key is required.

The server operates by regularly retrieving inspection records from the County of Santa Cruz, 
using Google Maps to geocode the facilities by address, and saving the records in a local database.
Calls to the API then serve these records to the mobile application.

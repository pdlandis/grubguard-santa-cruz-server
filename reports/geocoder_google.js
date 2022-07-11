const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
});
const Facility = require('../models/Facility');

const INTERVAL = 2000;
const LIMIT = 200;

function geocodeFacility(facility) {
  // return new Promise((resolve, reject) => {

    //console.log(facility);
    let address = `${facility.address}, CA`;
    console.log(`Sending geocode request for: ${address}`);
    // return resolve();
    googleMapsClient.geocode({ address: address },
      (err, response) => {
        if (err) {
          // reject(err);
          return console.error(err);
        }

        // GeoJSON formatting: Long, Lat
        let location = {
          type: "Point",
          coordinates: [
            +response.json.results[0].geometry.location.lng,
            +response.json.results[0].geometry.location.lat,
          ]};
        facility.location = location;
        facility.needsGeocoding = false;
        facility.lastGeocodeUpdate = new Date();
        facility.save();
        console.log("----- updated facility: -----");
        console.log(facility);
        console.log("---------------");
        // resolve();
      });
  // });
}

exports.geocodeFacilities = () => {
  return new Promise((resolve, reject) => {
    console.log("Geocoding facilities...");

    Facility.find({ needsGeocoding: true }).limit(LIMIT).exec().then(
      (facilities) => {
        // if (err) {
        //   console.log(`Got an error while getting Facility list: ${err}`);
        //   reject(err);
        // }
        console.log(`Geocoding ${facilities.length} facilities...`);

        let counter = 0;

        let i = setInterval(() => {
          if (counter === LIMIT || counter === facilities.length) {
            clearInterval(i);
            console.log("All geocoding requests sent.");
            resolve();
          }
          else {
            geocodeFacility(facilities[counter]);
            counter++;
          }
        }, INTERVAL);

      });
  });
};

/*
 * This is an example geocode using OpenCageData.
 * It doesn't work as well as Google does, but I'm saving the code for now.
 *
 * In addition to reinstalling opencage-api-client, an API key must
 * be defined in the .env file as OCD_API_KEY.
 */

const opencage = require('opencage-api-client');

// Bounds are in long/lat format.
const SC_NE_BOUND = '-121.5740,37.2741';
const SC_SW_BOUND = '-122.3540,36.8236';
const SC_BOUNDS = `${SC_SW_BOUND},${SC_NE_BOUND}`

exports.geocodeFacility = () => {
  opencage.geocode({
    q: '8400 GLEN HAVEN RD, SOQUEL, CALIFORNIA',
    no_annotations: 1,
    countrycode: 'us',
    bounds: SC_BOUNDS,
    limit: 1,
    //add_request: 1,
    //pretty: 1,
  }).then(data => {
    console.log(JSON.stringify(data));
    if (data.status.code == 200) {
      if (data.results.length > 0) {
        var place = data.results[0];
        console.dir(data.results[0]);
        console.log(place.formatted);
        console.log(place.geometry);
        //console.log(place.annotations.timezone.name);
      }
    }
  }).catch(error => {
    console.log('error', error.message);
  });
};

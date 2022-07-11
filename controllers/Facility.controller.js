const Facility = require('../models/Facility');

const cName = "Facility.controller";

const METERS_PER_MILE = 1609;

exports.getFacilities = (req, res) => {
  console.log(`${cName}: getFacilities() start.`);
  Facility.find().exec((err, facilities) => {
    if (err) {
      console.log(`${cName}: [Error]: ${err}`);
      return res.json([]);
    }
    return res.json(facilities);
  });
}

exports.getFacilitiesByName = (req, res) => {
  console.log(`${cName}: getFacilitiesByName() start.`);
  let re = new RegExp(req.body.name, 'i');
  Facility.find({ name: re }).exec((err, facilities) => {
    if (err) {
      console.log(`${cName}: [Error]: ${err}`);
      return res.json([]);
    }
    return res.json(facilities);
  });
}

exports.getFacility = (req, res) => {
  console.log(`${cName}: getFacility(${req.params.facility}) start.`);
  Facility.findOne({ _id: req.params.facility }).exec((err, facility) => {
    if (err) {
      console.log(`${cName}: [Error]: ${err}`);
      return res.json([]);
    }
    return res.json(facility);
  });
}

exports.getNearbyFacilities = (req, res) => {
  console.log(`${cName}: getNearbyFacilities() start.`);
  console.log(req.body);
  // if (!req.body.position) {
  //   return res.json({ success: false, message: "invalid position." });
  // }

  // GeoJSON format: longitude, latitude
  let position = {
    type: "Point",
    coordinates: [ +req.body.longitude, +req.body.latitude ],
  }

  let geoNearOptions = {
          geoNear: "facilities",
          near: position,
          distanceField: "distance",
          spherical: true,
          maxDistance: METERS_PER_MILE*5,
          limit: 100,
      };

  Facility.aggregate(
      [ { $geoNear: geoNearOptions } ],
      function(err,results) {
        if (err) {
            console.log('geoNear error:', err);
            return res.json([]);
        }
        //console.log('geoNear results:', results);
        return res.json(results);
      }
  );
}

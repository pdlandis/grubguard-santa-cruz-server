const Marker = require('../models/marker');

const cName = "marker.controller";

exports.getMarkers = (req, res) => {
  console.log(`${cName}: getMarkers() start.`);
  Marker.find().exec((err, markers) => {
    if (err) {
      console.log(`${cName}: [Error]: ${err}`);
      return res.json([]);
    }
    return res.json(markers);
  });
}

exports.getNearbyMarkers = (req, res) => {
  console.log(`${cName}: getNearbyMarkers() start.`);
  console.log(req.body);
  // if (!req.body.position) {
  //   return res.json({ success: false, message: "invalid position." });
  // }

  let position = {
    type: "Point",
    coordinates: [ +req.body.longitude, +req.body.latitude ],
  }

  // var lng = parseFloat(req.query.lng);
  // var lat = parseFloat(req.query.lat);
  // var maxDistance = parseFloat(req.query.maxDistance);
  // if ((!lng && lng !== 0) || (!lat && lat !== 0) || !maxDistance) {
  //     console.log('locationsListByDistance missing params');
  //     sendJsonResponse(res, 404, {
  //         "message" : "lng, lat and maxDistance query parameters are all required"
  //     });
  //     return;
  // }
  // var point = {
  //     type: "Point",
  //     coordinates: [lng, lat]
  // };
  // var geoOptions =  {
  //     spherical: true,
  //     maxDistance: 10000,//meterConversion.kmToM(maxDistance),
      //num: 10
  // };
  // console.log(position);
  // console.log(geoOptions);

  // Marker.geoNear(position, geoOptions, (err, results, stats) => {
  //     var locations;
  //     console.log('Geo Results', results);
  //     console.log('Geo stats', stats);
  //     if (err) {
  //         console.log('geoNear error:', err);
  //         return res.json([]);
  //         //sendJsonResponse(res, 404, err);
  //     } else {
  //         //locations = buildLocationList(req, res, results, stats);
  //         return res.json(results); //sendJsonResponse(res, 200, locations);
  //     }
  // });

  let geoNearOptions = {
          geoNear: "markers",
          near: position,
          distanceField: "distance",
          spherical: true,
          //maxDistance: 10000
      };
  console.log(geoNearOptions);

  Marker.aggregate(
      [ { $geoNear: geoNearOptions } ],
      function(err,results) {
        if (err) {
            console.log('geoNear error:', err);
            return res.json([]);
            //sendJsonResponse(res, 404, err);
        } else {
            //locations = buildLocationList(req, res, results, stats);
            console.log('geoNear results:', results);
            return res.json(results); //sendJsonResponse(res, 200, locations);
        }
      }
  );
  // .exec((err, markers) => {
  //   if (err) {
  //     console.log(`${cName}: [Error]: ${err}`);
  //     return res.json([]);
  //   }
  //   return res.json(markers);
  // });

  // Marker.find().exec((err, markers) => {
  //   if (err) {
  //     console.log(`${cName}: [Error]: ${err}`);
  //     return res.json([]);
  //   }
  //   return res.json(markers);
  // });
}

exports.addMarker = (req, res) => {
  console.log(`${cName}: addMarker() start.`);

  let new_marker = new Marker(req.body);
  new_marker.save((err, cat) => {
    if (err) {
      console.error(`${cName}: [Error]: ${err}`);
      return res.json({ success: false });
    }
    return res.json({ success: true, data: new_marker });
  });
}

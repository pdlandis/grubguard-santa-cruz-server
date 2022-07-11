const express = require('express');
const router = express.Router();
const markerController = require('../controllers/marker.controller');

router.get('/', (req, res) => {
  console.log("GET /markers");
  markerController.getMarkers(req, res);
});

router.post('/', (req, res) => {
  console.log("POST /markers new marker: " + req.body);
  markerController.addMarker(req, res);
});

router.post('/nearby', (req, res) => {
  console.log("POST /markers/nearby");
  markerController.getNearbyMarkers(req, res);
});

module.exports = router;

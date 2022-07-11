const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/Facility.controller');

router.get('/', (req, res) => {
  console.log("GET /facilities");
  facilityController.getFacilities(req, res);
});

router.get('/:facility', (req, res) => {
  console.log(`GET /facilities/${req.params.facility}`);
  facilityController.getFacility(req, res);
});

router.post('/nearby', (req, res) => {
  console.log("POST /facilities/nearby");
  facilityController.getNearbyFacilities(req, res);
});

router.post('/search', (req, res) => {
  console.log("POST /facilities/search");
  facilityController.getFacilitiesByName(req, res);
});

module.exports = router;

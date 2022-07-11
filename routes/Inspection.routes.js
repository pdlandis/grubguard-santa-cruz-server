const express = require('express');
const router = express.Router();
const inspectionController = require('../controllers/Inspection.controller');

router.get('/:facility', (req, res) => {
  console.log(`GET /inspections/${req.params.facility}`);
  inspectionController.getInspections(req, res);
});

module.exports = router;

const Inspection = require('../models/Inspection');

const cName = "Inspection.controller";

exports.getInspections = (req, res) => {
  console.log(`${cName}: getInspections(${req.params.facility}) start.`);
  Inspection.find({ facility: req.params.facility }).sort({ date: -1 }).exec((err, inspections) => {
    if (err) {
      console.log(`${cName}: [Error]: ${err}`);
      return res.json([]);
    }
    return res.json(inspections);
  });
}

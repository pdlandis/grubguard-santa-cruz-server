const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Inspection = require('../models/Inspection');
const InspectionController = require('../controllers/Inspection.controller');

var facilitySchema = mongoose.Schema({
  name: String,
  address: String,

  score: Number,
  grade: String,
  lastScoreUpdate: Date,

  needsGeocoding: Boolean,
  lastGeocodeUpdate: Date,

  // GeoJSON-compliant location:
  location: {
      type: { type: String }, // Will this ever be anything but "Point"?
      coordinates: [ Number ], // [ lng, lat ] format.
  },
});

facilitySchema.pre('save', function (next) {
  if (!this.location.coordinates || this.location.coordinates.length < 2) {
    // This is explicitly set to avoid issues with the geospatial index.
    this.location = null;
    this.needsGeocoding = true;
  }
  next();
});

facilitySchema.index({ name: 1, address: 1 }, { unique: true });
facilitySchema.index({ location: "2dsphere" });

facilitySchema.methods.getGrade = function () {
  if (this.score > 90) return 'A';
  if (this.score >= 70) return 'B';
  if (this.score >= 50) return 'C';
  if (this.score >= 25) return 'D';
  return 'F';
}

facilitySchema.methods.updateScore = function () {
  return new Promise((resolve, reject) => {
    Inspection.find({ facility: this._id }).exec((err, inspections) => {
      if (err) {
        console.error(`Error while calculating score: ${err}`);
        reject(err);
        return;
      }

      let scoreSum = 0;
      let scoreCount = 0;

      // console.log(`${this.name} has ${inspections.length} inspections.`);
      // console.log("inspections: ");
      for (let inspection of inspections) {
        // console.log(inspection);
        scoreSum += inspection.getScore();
        scoreCount++;
      }

      this.score = scoreSum / scoreCount;
      this.grade = this.getGrade();
      this.lastScoreUpdate = new Date();
      // console.log(`${this.name} has score: ${this.score} and grade ${this.grade}`);
      this.save().then(
        () => { resolve(); }
      );
    });
  });
};

module.exports = mongoose.model('Facility', facilitySchema);

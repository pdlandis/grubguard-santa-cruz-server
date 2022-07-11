const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var inspectionSchema = mongoose.Schema({
  facility: ObjectId,
  date: Date,

  /*
   * Santa Cruz provides the following information for a health inspection.
   * Major and minor violations are either "0" or a list of two char codes
   * representing the type of violation. General violations are just an
   * integer >= 0.
   *
   * An example of what these values might look like:
   *  violationsMajor: "0"
   *  violationsMinor: "EH HW FT FT"
   *  violationsGeneral: "2"
   */
  violationsMajor: String,
  violationsMinor: String,
  violationsGeneral: Number,
});

inspectionSchema.index({ "facility": 1, "date": 1 }, { unique: true });

inspectionSchema.methods.getScore = function () {
  let score = 100;
  score -= this.violationsGeneral * 2; // -2 points per general violation
  //console.log(`-${this.violationsGeneral * 2} points for general violations`);

  for (let minor of this.violationsMinor.split(' ')) {
    if (minor !== '0') {
      //console.log(`-10 points for minor violation: ${minor}`);
      score -= 10; // -10 points per minor violation
    }
  }

  for (let major of this.violationsMajor.split(' ')) {
    if (major !== '0') {
      //console.log(`-20 points for major violation: ${major}`);
      score -= 20; // -20 points per major violation
    }
  }

  return score;
};

module.exports = mongoose.model('Inspection', inspectionSchema);

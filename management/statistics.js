
const Facility = require('../models/Facility');


/*
 * Intended for future use with nativescript-ui-chart
 * Example format for pie charts from nativescript-ui-samples-angular-release:
    getPieSource(): Car[] {
        return [
            { Brand: "Audi", Amount: 10 },
            { Brand: "Mercedes", Amount: 76 },
            { Brand: "Fiat", Amount: 60 },
            { Brand: "BMW", Amount: 24 },
            { Brand: "Crysler", Amount: 40 }
        ];
    }
*/

exports.getStats = () => {
  Promise.all([
      Facility.find({ score: { $lt: 10 } }).count(),
      Facility.find({ score: { $gte: 10, $lt: 20 }}).count(),
      Facility.find({ score: { $gte: 20, $lt: 30 }}).count(),
      Facility.find({ score: { $gte: 30, $lt: 40 }}).count(),
      Facility.find({ score: { $gte: 40, $lt: 50 }}).count(),
      Facility.find({ score: { $gte: 50, $lt: 60 }}).count(),
      Facility.find({ score: { $gte: 60, $lt: 70 }}).count(),
      Facility.find({ score: { $gte: 70, $lt: 80 }}).count(),
      Facility.find({ score: { $gte: 80, $lt: 90 }}).count(),
      Facility.find({ score: { $gte: 90, $lt: 100 }}).count(),
      Facility.find({ score: { $gte: 100 }}).count(),
    ])
    .then((results) => {
      console.log("Queries completed: ");
      console.log(results);
      // let stats = [
      //   { ScoreRange: "x < 10", Amount: results[0] },
      //   { ScoreRange: "10 > x > 20", Amount: results[1] },
      //   { ScoreRange: "20 > x > 30", Amount: results[2] },
      //   { ScoreRange: "30 > x > 40", Amount: results[3] },
      // ];
      let stats = [];
      for (let i = 0; i < results.length; i++) {
        stats.push({
          ScoreRange: `${i * 10} < x < ${(i + 1) * 10}`,
          Amount: results[i],
        });
      }
      console.log(stats);
    });
};

exports.getStatsTwo = () => {
  Promise.all([
      Facility.find({ score: { $lt: 25 } }).count(), // 0-25: F ~ --> "DEATH AWAITS"
      Facility.find({ score: { $gte: 25, $lt: 50 }}).count(), // 25-50: D ~ --> "AVOID"
      Facility.find({ score: { $gte: 50, $lt: 70 }}).count(), // 50-70: C ~11% --> "warning"
      Facility.find({ score: { $gte: 70, $lt: 90 }}).count(), // 70-89: B ~28% --> "good!"
      Facility.find({ score: { $gte: 90 }}).count(), // 90-100: A ~58% --> "great!"
    ])
    .then((results) => {
      console.log("Queries completed: ");
      console.log(results);
      let stats = [
        { Grade: "F", Amount: results[0] },
        { Grade: "D", Amount: results[1] },
        { Grade: "C", Amount: results[2] },
        { Grade: "B", Amount: results[3] },
        { Grade: "A", Amount: results[4] },
      ];
      console.log(stats);
    });
};

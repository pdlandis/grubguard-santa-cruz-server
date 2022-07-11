
const Facility = require('../models/Facility');

exports.calculateScores = () => {
  return new Promise((resolve, reject) => {
    console.log("Calculating scores...");

    Facility.find().exec((err, facilities) => {
      if (err) {
        console.error(`Got an error while trying to calculate scores: ${err}`);
        reject(err);
        return;
      }
      console.log(`Calculating scores for ${facilities.length} facilities...`);

      let promise_list = [];
      for (let i = 0; i < facilities.length; i++) {
        promise_list.push(facilities[i].updateScore());
      }

      Promise.all(promise_list).then(() => {
        console.log("Finished score calculations.");
        resolve();
      });

    });

  });
};

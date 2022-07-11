const fs = require('fs');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Report = require('../models/Report');
const Facility = require('../models/Facility');
const Inspection = require('../models/Inspection');

function addReport(data) {
  let report = new Report({ data: data, message: null, completed: false });
  report.save().then(processReport);
}

function processReports() {
  Report.find({ completed: false }, (err, reports) => {
    if (err) {
      return console.error(`Error when trying to get report list: ${err}`);
    }

    for(let i = 0; i < reports.length; i++) {
      processReport(reports[i]);
    }
  });
}

function processReport(report) {
  //console.log(`Processing report: ${report}`);
  findOrCreateFacility(report, (facility) => {
    addInspection(report, facility);
  });
}

function findOrCreateFacility(report, next) {
  Facility.findOne({ name: report.data.name, address: report.data.address },
    (err, facility) => {
      if (err) {
        return console.error(`Error when checking for matching Facility: ${err}`);
      }

      // Build new Facility record if not found.
      if (!facility) {
        console.log(`Creating new Facility record for ${report.data.name}`);
        let facility = new Facility({
          name: report.data.name,
          address: report.data.address,
          needsGeocoding: true
        });
        facility.save((err, cat) => {
          if (err) {
            if (err.code === 11000) {
              // Duplicate facility due to race condition.
              // Let this report be checked again later.
              report.message = err;
              report.completed = false;
              report.save();
            }
            else {
              // Unknown error when saving facility.
              report.message = err;
              report.completed = true;
              report.save();
            }
            return console.error(`Error when saving new Facility: ${err}`);
          }
          //console.log(`Created new Facility: ${facility}`);
          next(facility);
        });
      }
      else {
      //console.log("Didn't create new Facility, as it already exists.");
        next(facility);
      }
  });
}

function addInspection(report, facility) {
  let date = parseDate(report.data.date);
  let inspection = {
    facility: facility._id,
    date: date,
    violationsMajor: report.data.majorCount,
    violationsMinor: report.data.minorCount,
    violationsGeneral: +report.data.generalCount,
  };

  Inspection.findOneAndUpdate({ facility: facility._id, date: date },
    inspection, { upsert: true, new: true, rawResult: true }, (err, res) => {
      if (err) {
        return console.error(`Error when trying to upsert Inspection: ${err}`);
      }
      //console.log(`Processed inspection: ${res}`);
      report.completed = true;
      report.save();
  });
}

// parse a date in mm/dd/yyyy format
function parseDate(input) {
  let parts = input.split('/');

  // Note: months are 0-based on most implementations
  let month = parseInt(parts[0]) + parseInt(process.env.PARSER_DATE_MONTH_OFFSET);
  let day = parseInt(parts[1]) + parseInt(process.env.PARSER_DATE_DAY_OFFSET);
  let year = parseInt(parts[2]);

  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
}

/*
 * This is hardcoded to parse the specific SC health inspector html pages.
 * These pages consist of a table where each row is a summary of the current
 * health inspector report.
 */
exports.parseHTMLreport = (filename) => {
  return new Promise((resolve, reject) => {
    if (!filename.startsWith('SCInspector_')) {
      console.log("Not a report, skipping");
      reject();
    }

    let htmlDirectory = process.env.RAW_HTML_DIRECTORY;

    fs.readFile(`${htmlDirectory}/${filename}`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }

      let $ = cheerio.load(data);

      console.log(`Parsing file: ${filename}...`);
      let inspections = $('tr .inspectionRow');
      for(let i = 0; i < inspections.length; i++) {
        let inspectionData = $(inspections[i]).find('td');
        let name = inspectionData.eq(0).find('span').eq(0).text().trim();
        let address = inspectionData.eq(0).find('span').eq(1).text().trim();
        let date = inspectionData.eq(1).text().trim();
        let majorCount = inspectionData.eq(2).text().trim();
        let minorCount = inspectionData.eq(3).text().trim();
        let generalCount = inspectionData.eq(4).text().trim();
        // Skipping: correction verified, previous counts

        let record = { name, address, date, majorCount, minorCount, generalCount };
        // Debug output
        // console.dir({
        //   name, address, date, majorCount, minorCount, generalCount
        // });
        addReport(record);
      }
      console.log("Parsing finished.");
      resolve();
    });
  });
};

exports.parseAll = (path) => {
  fs.readdir(path, (err, files) => {
    files.forEach(file => {
      this.parseHTMLreport(file);
    });
  })
}

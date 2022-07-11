const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

exports.getHTMLReport = () => {
  return new Promise((resolve, reject) => {
    let url = 'https://sccounty01.co.santa-cruz.ca.us/EHRestaurantInspection/Home/GetInspections';
    let params = { sortby: 'FACILITY_NAME', ascending: 'True', print: 'True' };
    let qs = querystring.stringify(params);
    let htmlDirectory = process.env.RAW_HTML_DIRECTORY;

    https.get(`${url}?${qs}`, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        let unixTimestamp = Math.floor(new Date() / 1000);
        let filename = `SCInspector_${unixTimestamp}.html`;

        fs.writeFile(`${htmlDirectory}/${filename}`, data, function(err) {
          if(err) {
            if (err.code === 'EEXIST') {
              console.error(`${htmlDirectory}/${filename} already exists.`);
            }
            reject();
          }

          console.log(`Saved file: ${filename}`);
          resolve(filename);
        });
      });
    }).on('error', (err) => {
      console.log(`Failed to retrieve report during GET request: ${err.message}`);
      reject();
    });

  });
};

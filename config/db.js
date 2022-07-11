const mongoose = require('mongoose');

let options = { };
if (process.env.DB_AUTH === "true") {
  options['user'] = process.env.DB_USER;
  options['pass'] = process.env.DB_PASS;
}

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, options);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Connected to MongoDB server.');
});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const createError = require('http-errors');

const markerRoutes = require('../routes/marker.routes');
const facilityRoutes = require('../routes/Facility.routes');
const inspectionRoutes = require('../routes/Inspection.routes');

let app = express();

// Setup parsers for POST data.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set API routes.
app.use('/api/markers', markerRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/inspections', inspectionRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('Bad request');
});

module.exports = app;

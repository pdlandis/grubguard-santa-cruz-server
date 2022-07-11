const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var markerSchema = mongoose.Schema({
  name: String,
  location: {
      type: { type: String },
      coordinates: [ Number ],
  },
});

markerSchema.index({ "location": "2dsphere" });

module.exports = mongoose.model('Marker', markerSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
 * Reports are raw strings saved from parsed HTML.
 * They need additional parsing to become Facilities and Inspections.
 *
 * Reports exist in order to manage and queue new entries that have been parsed
 * from a document. As the reports get processed, they may or may not
 * become 'real' records, because the Facilities and Inspections may already
 * exist.
 *
 * This system might be better implemented as an in-memory queue.
 */
var reportSchema = mongoose.Schema({
  data: {},
  message: String,
  completed: { type: Boolean, index: true },
});

module.exports = mongoose.model('Report', reportSchema);

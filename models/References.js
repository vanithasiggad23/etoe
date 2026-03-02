const mongoose = require("mongoose");

const ReferenceSchema = new mongoose.Schema({
 fileName: String,
 filePath: String,
 uploadDate: {
  type: Date,
  default: Date.now
 }
});

module.exports =
 mongoose.model("Reference", ReferenceSchema);
const mongoose = require("mongoose");

const acupressureSchema = new mongoose.Schema({
  name: String,
  code: String,

  bodyArea: String,
  bodyLocation: String,

  symptoms: [String],

  description: String,

  instructions: String,

  duration: String,

  benefits: [String],

  precautions: String,

  videoUrl: String,

  imageUrl: String
});

module.exports = mongoose.model("AcupressurePoint", acupressureSchema);
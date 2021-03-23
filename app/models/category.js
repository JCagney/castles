"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  description: String,
});

categorySchema.statics.findByCastleId = function(castle) {
  return this.findOne({ images: { category: imageId} })
};

module.exports = Mongoose.model("Category", categorySchema);
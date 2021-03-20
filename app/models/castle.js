"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const castleSchema = new Schema({
  name: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  images: []
});

castleSchema.statics.findByImageId = function(imageId) {
  return this.findOne({ images: { "$all": imageId} })
};

module.exports = Mongoose.model("Castle", castleSchema);
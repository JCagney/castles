"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const castleSchema = new Schema({
  name: String,
  description: String,
  coordinates: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  lasteditor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  images: [],
  ratings: [] 

});

// find the castle associated with a particular image id 
castleSchema.statics.findByImageId = function(imageId) {
  return this.findOne({ images: { "$all": imageId} })
};

// find all the castles within a certain category 
castleSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category: { "$all": categoryId} }).populate("author").populate("category").populate("lasteditor").lean();
};

module.exports = Mongoose.model("Castle", castleSchema);
"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const reviewSchema = new Schema({
  text: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  castle: {
    type: Schema.Types.ObjectId,
    ref: "Castle",
  }
});


// find the reviews associated with a particular castle 
reviewSchema.statics.findByCastle = function(castleId) {
  return this.find({ castle: { "$all": castleId} })
};

module.exports = Mongoose.model("Review", reviewSchema);
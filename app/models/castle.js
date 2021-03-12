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
});

module.exports = Mongoose.model("Castle", castleSchema);
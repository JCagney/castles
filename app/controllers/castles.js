"use strict";

const Castle = require("../models/castle");
const User = require("../models/user");

const Castles = {
  home: {
    handler: async function (request, h) {
      const castles = await Castle.find().populate("author").lean();
      return h.view( "home", {
         title: "Castles",
         castles: castles, 
     });
    },
  },

  addCastle: {
    handler: async function (request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const data = request.payload;
      const newCastle = new Castle({
        name: data.name,
        description: data.description,
        author: user._id
      });
      await newCastle.save();
      return h.redirect("/home");
    },
  },

};
  module.exports = Castles;
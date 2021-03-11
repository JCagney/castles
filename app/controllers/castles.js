"use strict";

const Castles = {
  home: {
    handler: function (request, h) {
      return h.view( "home", {
         title: "Castles",
         castles: this.castles, 
     });
    },
  },

  addCastle: {
    handler: function (request, h) {
      let data = request.payload;
      data.author = this.currentUser;
      this.castles.push(data);
      return h.redirect("/home");
    },
  },

};
  module.exports = Castles;
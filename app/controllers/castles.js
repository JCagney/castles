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
      const data = request.payload;
      var authorEmail = request.auth.credentials.id;
      data.author = this.users[authorEmail];
      this.castles.push(data);
      return h.redirect("/home");
    },
  },

};
  module.exports = Castles;
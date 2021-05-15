const Castles = require('./app/api/castles');
const Users = require("./app/api/users");
const Categories = require("./app/api/categories");
const Reviews = require("./app/api/reviews");

module.exports = [
  { method: 'GET', path: '/api/castles', config: Castles.find },
  { method: 'GET', path: '/api/castle/{id}', config: Castles.findOne },
  { method: "POST", path: "/api/castle", config: Castles.create },
  { method: "GET", path: "/api/castle/{castleid}/{rating}", config: Castles.addRating },
  { method: "DELETE", path: "/api/castle/{id}", config: Castles.deleteOne },
  { method: "DELETE", path: "/api/castles", config: Castles.deleteAll },
  { method: "GET", path: "/api/users", config: Users.find },
  { method: "GET", path: "/api/user/{id}", config: Users.findOne },
  { method: "POST", path: "/api/users", config: Users.create },
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },
  { method: "GET", path: "/api/categories", config: Categories.find },
  { method: "GET", path: "/api/categories/{id}", config: Categories.findOne },
  { method: "GET", path: "/api/reviews", config: Reviews.find },
  { method: "GET", path: "/api/review/{id}", config: Reviews.findOne },
  { method: "GET", path: "/api/reviews/castle/{castleid}", config: Reviews.findByCastle },
  { method: "POST", path: "/api/review", config: Reviews.create },
  { method: "DELETE", path: "/api/review/{id}", config: Reviews.deleteOne },
  { method: "DELETE", path: "/api/reviews", config: Reviews.deleteAll },

];
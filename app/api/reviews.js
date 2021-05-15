'use strict';

const Review = require("../models/review");
const Castle = require("../models/castle");
const Boom = require("@hapi/boom");

const Reviews = {
    
  find: {
    auth: false,
    handler: async function (request, h) {
      const reviews = await Review.find();
      return reviews;
    },
  },

  findOne: {
    auth: false,
    handler: async function(request, h) {
      try {  
        const review = await Review.findOne({ _id: request.params.id });
        if (!review) {
          return Boom.notFound("No Review with this id");
        }
        return review;
      } catch (err) {
          return Boom.notFound("No Review with this id");
      }
    } 
  }, 
    
  
  findByCastle: {
    auth: false,
    handler: async function (request, h) {
      try { 
        const castle = await Castle.findOne({ _id: request.params.castleid });
        if (!castle) {
          return Boom.notFound("No Castle with this id");
        }
        const reviews = Review.findbyCastle(castle._id); 
        return reviews;
      } catch (err) {
        return Boom.notFound("No Castle with this id");
      }
    }
  },


  create: {
    auth: false,
    handler: async function (request, h) {
      const newReview = new Review(request.payload);
      const review = await newReview.save();
      if (review) {
        return h.response(review).code(201);
      }
      return Boom.badImplementation("error creating review");
    },
  }, 

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      await Review.remove({});
      return { success: true };
    },
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      const response = await Review.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },
}

module.exports = Reviews;
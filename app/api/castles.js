'use strict';

const Castle = require("../models/castle");
const Boom = require("@hapi/boom");

const Castles = {
    find: {
      auth: false,
      handler: async function (request, h) {
        const castles = await Castle.find();
        return castles;
      },
    },

    findOne: {
      auth: false,
      handler: async function(request, h) {
        try {  
          const castle = await Castle.findOne({ _id: request.params.id });
          if (!castle) {
            return Boom.notFound("No Castle with this id");
          }
          return castle;
        } catch (err) {
            return Boom.notFound("No Castle with this id");
        }
      } 
    }, 

    create: {
        auth: false,
        handler: async function (request, h) {
          const newCastle = new Castle(request.payload);
          const castle = await newCastle.save();
          if (castle) {
            return h.response(castle).code(201);
          }
          return Boom.badImplementation("error creating castle");
        },
      },
    
      deleteAll: {
        auth: false,
        handler: async function (request, h) {
          await Castle.remove({});
          return { success: true };
        },
      },
    
      deleteOne: {
        auth: false,
        handler: async function (request, h) {
          const response = await Castle.deleteOne({ _id: request.params.id });
          if (response.deletedCount == 1) {
            return { success: true };
          }
          return Boom.notFound("id not found");
        },
      },

      addRating: {
        auth: false,
        handler: async function (request, h) {
          const castle = await Castle.findById(request.params.castleid);
          const rating = request.params.rating;
          castle.ratings.push(rating); 
          await castle.save(); 
          return { success: true };
        }
      }, 


  };
  
  module.exports = Castles;
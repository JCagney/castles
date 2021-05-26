'use strict';

const Castle = require("../models/castle");
const Review = require("../models/review");
const Boom = require("@hapi/boom");

const Castles = {
    find: {
      auth: {
        strategy: "jwt",
      },
      plugins: {
        disinfect: {
          deleteEmpty: true,
          deleteWhitespace: true,
          disinfectPayload: true 
        }
      },
      handler: async function (request, h) {
        const castles = await Castle.find().populate("author").populate("category").populate("lasteditor").lean();
        return castles;
      },
    },

    findOne: {
      auth: {
        strategy: "jwt",
      },
      plugins: {
        disinfect: {
          deleteEmpty: true,
          deleteWhitespace: true,
          disinfectPayload: true 
        }
      },
      handler: async function(request, h) {
        try {  
          const castle = await Castle.findOne({ _id: request.params.id }).populate("author").populate("category").populate("lasteditor").lean();;
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
      auth: {
        strategy: "jwt",
      },
        plugins: {
          disinfect: {
            deleteEmpty: true,
            deleteWhitespace: true,
            disinfectPayload: true 
          }
        },
        handler: async function (request, h) {
        const newCastle = new Castle({
          name: request.payload.name,
          description: request.payload.description,
          author: request.payload.user,
          category: request.payload.category, 
          coordinates: request.payload.coordinates
        });
          const castle = await newCastle.save();
          console.log(castle);
          if (castle) {
            return h.response(castle).code(201);
          }
          return Boom.badImplementation("error creating castle");
        },
      },

      edit: {
        auth: {
          strategy: "jwt",
        },
        plugins: {
          disinfect: {
            deleteEmpty: true,
            deleteWhitespace: true,
            disinfectPayload: true 
          }
        },
        handler: async function (request, h) {
          var castle = await Castle.findOne({ _id: request.payload.id }); 
          castle.name = request.payload.name; 
          castle.description = request.payload.description;
          castle.coordinates = request.payload.coordinates;
          castle.lasteditor = request.payload.userid; 
          castle.category = request.payload.category; 

          const returnedCastle = await castle.save();
          if (returnedCastle) {
            return h.response(returnedCastle).code(201);
          }
          return Boom.badImplementation("error editing castle");
        },
      },
    
      deleteAll: {
        auth: {
          strategy: "jwt",
        },
        plugins: {
          disinfect: {
            deleteEmpty: true,
            deleteWhitespace: true,
            disinfectPayload: true 
          }
        },
        handler: async function (request, h) {
          await Castle.remove({});
          return { success: true };
        },
      },
    
      deleteOne: {
        auth: {
          strategy: "jwt",
        },
        plugins: {
          disinfect: {
            deleteEmpty: true,
            deleteWhitespace: true,
            disinfectPayload: true 
          }
        },
        handler: async function (request, h) {
          var reviews = await Review.findByCastle({ _id: request.params.id }); 
          for (const review of reviews){
            await Review.deleteOne({ _id: review._id});
          }
          const response = await Castle.deleteOne({ _id: request.params.id });
          if (response.deletedCount == 1) {
            return { success: true };
          }
          return Boom.notFound("id not found");
        },
      },

      addRating: {
        auth: {
          strategy: "jwt",
        },
        plugins: {
          disinfect: {
            deleteEmpty: true,
            deleteWhitespace: true,
            disinfectPayload: true 
          }
        },
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
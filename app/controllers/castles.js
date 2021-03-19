"use strict";

const Castle = require("../models/castle");
const User = require("../models/user");
const ImageStore = require('../utils/image-store');
const Joi = require('@hapi/joi');

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
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required()
      },
      options: {
        abortEarly: false,
      },
      failAction: async function (request, h, error) {
        const castles = await Castle.find().populate("author").lean();
        return h.view("home", {
            castles: castles,
            title: "Edit error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
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
      }catch (err) {
        console.log(err);
      }
    }
  },

  viewCastle: {
    handler: async function (request, h) {
      try {
        const id = request.params._id;
        const castle = await Castle.findById(id).populate("author").lean();
        console.log("viewing: ", castle.name);
        var castleImages = {};
        if (castle.images.length > 0){ 
          castleImages = await ImageStore.getImagesByIds(castle.images);
        }
        console.log(castleImages);
        return h.view( "viewcastle", {
           castleid: castle._id,
           title: castle.name,
           description: castle.description,
           author: castle.author,
           images: castleImages
       });
      } catch (err) {
      console.log(err);
      }
    }
  },


  uploadFile: {
    handler: async function(request, h) {
      try {
        const castle = await Castle.findById(request.params.castleid);
        const file = request.payload.imagefile;
        var castleImages = {};
        if (castle.images.length > 0){ 
          castleImages = await ImageStore.getImagesByIds(castle.images);
        }
        if (Object.keys(file).length > 0) {
          const image_id = await ImageStore.uploadImage(request.payload.imagefile, castle._id);
          console.log(image_id);          
          castle.images.push(image_id); 
          await castle.save();
          var castleImages = {};
          if (castle.images.length > 0){ 
            castleImages = await ImageStore.getImagesByIds(castle.images);
          }
          return h.redirect("/viewcastle/"+castle._id, {
            castleid: castle._id,
            title: castle.name,
            description: castle.description,
            images: castleImages,      
          });
        }
        return h.redirect("/viewcastle/"+castle._id, {
          castleid: castle._id,
          title: castle.name,
          description: castle.description,
          images: castleImages,
          error: 'No file selected'  
        });
      } catch (err) {
        console.log(err);
      }
    },
    payload: {
      multipart: true,
      output: 'data',
      maxBytes: 209715200,
      parse: true
    }
  },

  deleteImage: {
    handler: async function(request, h) {
      try {
        await ImageStore.deleteImage(request.params.id);
        const castle = await Castle.findByImageId(request.params.id);
        const index = await castle.images.indexOf(request.params.id);
        await castle.images.splice(index, 1); 
        await castle.save();
        var castleImages = {};
        if (castle.images.length > 0){ 
          castleImages = await ImageStore.getImagesByIds(castle.images);
        }
        return h.redirect("/viewcastle/"+castle._id, {
          castleid: castle._id,
          title: castle.name,
          description: castle.description,
          images: castleImages  
        });
      } catch (err) {
        console.log(err);
      }
    }
  },

  deleteCastle: {
    handler: async function (request, h) {
      try {
        const castle = await Castle.findById(request.params.castleid);
        console.log("deleting: ", castle.name);
        if (castle.images.length > 0){ 
          for (var i = 0; i < castle.images.length; i++) {
             await ImageStore.deleteImage(castle.images[i]);
          };
        };
        castle.remove(); 
        console.log("Successful deletion"); 
        return h.redirect("/home");
      } catch (err) {
      console.log(err);
      }
    }
  },
  
  showEditCastle: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        const castle = await Castle.findById(request.params.castleid);
        return h.view("edit-castle", {
          castleid: castle._id,
          castlename: castle.name,
          user: user.firstName,
          description: castle.description,
        });
      } catch (err) {
        console.log(err);
      }
    }
  },

  editCastle: {
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required()
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("edit-castle", {
            title: "Edit error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function(request, h) {
      try {
        const castleEdit = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const castle = await Castle.findById(request.params.castleid);
        castle.name = castleEdit.name;
        castle.description = castleEdit.description;
        await castle.save();
        var castleImages = {};
        if (castle.images.length > 0){ 
          castleImages = await ImageStore.getImagesByIds(castle.images);
        }
        return h.redirect("/viewcastle/"+castle._id, {
          castleid: castle._id,
          title: castle.name,
          description: castle.description,
          images: castleImages  
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
    
};




  module.exports = Castles;
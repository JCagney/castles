"use strict";

const Castle = require("../models/castle");
const User = require("../models/user");
const ImageStore = require('../utils/image-store');

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
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    }
  },

  viewCastle: {
    handler: async function (request, h) {
      try {
        const id = request.params._id;
        const castle = await Castle.findById(id);
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
  }
};


  module.exports = Castles;
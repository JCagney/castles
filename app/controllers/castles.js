"use strict";

const Castle = require("../models/castle");
const User = require("../models/user");
const Category = require("../models/category");
const ImageStore = require('../utils/image-store');
const Joi = require('@hapi/joi');

const Castles = {
  home: {
    handler: async function (request, h) {
      const castles = await Castle.find().populate("author").populate("category").lean();
      const categories = await Category.find().lean();
      return h.view( "home", {
         title: "Castles",
         castles: castles, 
         categories: categories
     });
    },
  },

  adminHome: {
    handler: async function (request, h) {
      const castles = await Castle.find().populate("author").lean();
      const users = await User.find().lean();
      const categories = await Category.find().lean();
      return h.view( "admin-home", {
         title: "Castles",
         castles: castles, 
         users: users,
         categories: categories
     });
    },
  },

  addCastle: {
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        coordinates: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: async function (request, h, error) {
        const castles = await Castle.find().populate("author").lean();
        const categories = await Category.find().lean();
        return h.view("home", {
            castles: castles,
            categories: categories,
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
          author: user._id,
          category: data.category, 
          coordinates: data.coordinates
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
        const castle = await Castle.findById(id).populate("author").populate("category").populate("lasteditor").lean();
        console.log("viewing: ", castle.name);
        var castleImages = {};
        if (castle.images.length > 0){ 
          castleImages = await ImageStore.getImagesByIds(castle.images);
        }
        console.log("viewing ", castle.name);
        return h.view( "viewcastle", {
           title: castle.name,
           images: castleImages,
           castle: castle
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
          return h.redirect("/viewcastle/"+castle._id);
        }
        return h.redirect("/viewcastle/"+castle._id, {
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
        return h.redirect("/viewcastle/"+castle._id);
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
        const categories = await Category.find().lean();
        const castle = await Castle.findById(request.params.castleid);
        return h.view("edit-castle", {
          title: castle.name,
          castleid: castle._id,
          castlename: castle.name,
          user: user.firstName,
          description: castle.description,
          categories: categories,
          coordinates: castle.coordinates
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
        description: Joi.string().required(),
        category: Joi.string().required(),
        coordinates: Joi.string().required()
      },
      options: {
        abortEarly: false,
      },
      failAction: async function (request, h, error) {
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        const categories = await Category.find().lean();
        const castle = await Castle.findById(request.params.castleid);
        return h.view("edit-castle", {
          title: castle.name,
          castleid: castle._id,
          castlename: castle.name,
          user: user.firstName,
          description: castle.description,
          coordinates: castle.coordinates,
          categories: categories,
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
        const categories = await Category.find().lean();
        castle.name = castleEdit.name;
        castle.category = castleEdit.category;
        castle.description = castleEdit.description;
        castle.coordinates = castleEdit.coordinates;
        castle.lasteditor = user;
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
          categories: categories  
        });
      } catch (err) {
        console.log(err);
      }
    }
  },

  deleteCategory: {
    handler: async function (request, h) {
      try {
        const category = await Category.findById(request.params.id);
        console.log("deleting category");
        await category.remove(); 
        console.log("Successful deletion");
        return h.redirect("/adminhome");
      } catch (err) {
      console.log(err);
      }
    }
  },

  addCategory: {
    handler: async function (request, h) {
      try {
        const data = request.payload;
        const newCategory = new Category({
          name: data.name,
          description: data.description,
        });
        await newCategory.save();
        console.log("Successful addition"); 
        return h.redirect("/adminhome");
      } catch (err) {
      console.log(err);
      }
    }
  },
    
  viewCategory: {
    handler: async function (request, h) {
      try {
        const category = await Category.findById(request.params.id).lean();
        const castles = await Castle.findByCategory(category._id);
        console.log("viewing ", category.name);
        return h.view("category", {
          category: category,
          castles: castles
        });
      } catch (err) {
      console.log(err);
      }
    }
  },

  adminDeleteCastle: {
    handler: async function (request, h) {
      try {
        const castle = await Castle.findById(request.params.id).populate("category");
        const category = castle.category;
        console.log("deleting: ", castle.name);
        if (castle.images.length > 0){ 
          for (var i = 0; i < castle.images.length; i++) {
             await ImageStore.deleteImage(castle.images[i]);
          };
        };
        castle.remove(); 
        console.log("Successful deletion"); 
        return h.redirect("/adminhome");
      } catch (err) {
      console.log(err);
      }
    }
  },
};




  module.exports = Castles;
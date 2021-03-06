"use strict";

const User = require("../models/user");
const Boom = require("@hapi/boom");
const bcrypt = require('bcrypt'); 
const utils = require('./utils.js');
const saltRounds = 10; 

const Users = {
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
      const users = await User.find();
      return users;
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
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.notFound("No User with this id");
      }
    },
  },

  create: {
    auth: false,
    plugins: {
      disinfect: {
        deleteEmpty: true,
        deleteWhitespace: true,
        disinfectPayload: true 
      }
    },
    handler: async function (request, h) {
      const hash = await bcrypt.hash(request.payload.password, saltRounds); 
      const newUser = new User({
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
        password: hash                           
      });
      const user = await newUser.save();
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation("error creating user");
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
      await User.deleteMany({});
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
      const user = await User.deleteOne({ _id: request.params.id });
      if (user) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  authenticate: {
    auth: false,
    plugins: {
      disinfect: {
        deleteEmpty: true,
        deleteWhitespace: true,
        disinfectPayload: true 
      }
    },
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ email: request.payload.email });
        if (!user) {
          return Boom.unauthorized("User not found"); 
  
        } else if (await user.comparePassword(request.payload.password)) {
          const token = utils.createToken(user);
          return h.response({ success: true, token: token }).code(201);
        } else { 
          return Boom.unauthorized("Invalid password");
        }
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  },

  getUserFromToken:   {
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
      const email = utils.getUserEmailFromRequest(request); 
      const user = await User.findOne({ email: email});
      console.log(user); 
      if (user){
        const info = {
          firstName: user.firstName, 
          lastName: user.lastName, 
          _id: user._id,
          email: email
        }
      return info;
      } else{
        return null;
      }
    } 
  },

  checkEmail: {
    auth: false,
    plugins: {
      disinfect: {
        deleteEmpty: true,
        deleteWhitespace: true,
        disinfectPayload: true 
      }
    },
    handler: async function (request, h) {
      const user = await User.findOne({ email: request.params.email });
      console.log(user); 
      if (user){
        const info = {
          firstName: user.firstName, 
          lastName: user.lastName, 
          _id: user._id
        }
      return info;
      } else{
        return null;
      }
    } 
  }
};

module.exports = Users;
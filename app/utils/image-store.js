'use strict';

const cloudinary = require('cloudinary');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

const ImageStore = {
  configure: function() {
    const credentials = {
      cloud_name: process.env.name,
      api_key: process.env.key,
      api_secret: process.env.secret
    };
    cloudinary.config(credentials);
  },

  getAllImages: async function() {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  getImagesByIds:  async function(ids) {
    const result = await cloudinary.v2.api.resources_by_ids(ids);
    return result.resources;
  },

  uploadImage: async function(imagefile, castleid) {
    
    await writeFile('./public/temp.img', imagefile);
    console.log("adding tag: ", castleid);
    const upload = await cloudinary.uploader.upload('./public/temp.img', 
      { tags: castleid });
    return upload.public_id;
  },

  deleteImage: async function(id) {
    await cloudinary.v2.uploader.destroy(id, {});
  },

};

module.exports = ImageStore;
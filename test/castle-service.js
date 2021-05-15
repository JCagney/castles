"use strict";

const axios = require("axios");

class CastleService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getCastles() {
    const response = await axios.get(this.baseUrl + "/api/castles");
    return response.data;
  }

  async getCastle(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/castle/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createCastle(newCastle) {
    const response = await axios.post(this.baseUrl + "/api/castle", newCastle);
    return response.data;
  }

  async deleteAllCastles() {
    const response = await axios.delete(this.baseUrl + "/api/castles");
    return response.data;
  }

  async deleteOneCastle(id) {
    const response = await axios.delete(this.baseUrl + "/api/castle/" + id);
    return response.data;
  }

  async addRating(castleid, rating) {
    const response = await axios.get(this.baseUrl + "/api/castle/" + castleid + "/" + rating);
    return response.data;
  }

  async getUsers() {
    const response = await axios.get(this.baseUrl + "/api/users");
    return response.data;
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/user/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createUser(newUser) {
    const response = await axios.post(this.baseUrl + "/api/users", newUser);
    return response.data;
  }

  async deleteAllUsers() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneUser(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getCategories() {
    const response = await axios.get(this.baseUrl + "/api/categories");
    return response.data;
  }

  async getCategory(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/category/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createCategory(newCategory) {
    const response = await axios.post(this.baseUrl + "/api/category", newCategory);
    return response.data;
  }

  async deleteAllCategories() {
    const response = await axios.delete(this.baseUrl + "/api/categories");
    return response.data;
  }

  async deleteOneCategory(id) {
    const response = await axios.delete(this.baseUrl + "/api/category/" + id);
    return response.data;
  }

  async getReviews() {
    const response = await axios.get(this.baseUrl + "/api/reviews");
    return response.data;
  }

  async getReview(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/review/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createReview(newReview) {
    const response = await axios.post(this.baseUrl + "/api/review", newReview);
    return response.data;
  }

  async deleteAllReviews() {
    const response = await axios.delete(this.baseUrl + "/api/reviews");
    return response.data;
  }

  async deleteOneReview(id) {
    const response = await axios.delete(this.baseUrl + "/api/review/" + id);
    return response.data;
  }
}

module.exports = CastleService;


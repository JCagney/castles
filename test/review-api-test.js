"use strict";

const assert = require("chai").assert;
const CastleService = require("./castle-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Review API tests", function () {
    let newUser = fixtures.newUser;
    let newCastle = fixtures.newCastle;
    let reviews = fixtures.reviews; 
    let newReview = fixtures.newReview; 

    const castleService = new CastleService(fixtures.castleService);
    
    suiteSetup(async function () {
      await castleService.deleteAllUsers();
      const returnedUser = await castleService.createUser(newUser);
      const response = await castleService.authenticate(newUser);
    });
  
    suiteTeardown(async function () {
      await castleService.deleteAllUsers();
      castleService.clearAuth();
    });

    setup(async function () {
        await castleService.deleteAllReviews();
      });
    
      teardown(async function () {
        await castleService.deleteAllReviews();
      });
      
      test("create a review", async function () {
        let review = newReview; 
        const returnedReview = await castleService.createReview(review); 
        assert(_.some([returnedReview], review), "returnedReview must be a superset of review")
      });

      test("get review", async function () {
        const r1 = await castleService.createReview(newReview);
        const r2 = await castleService.getReview(r1._id);
        assert.deepEqual(r1, r2);
      });
    
      test("get invalid review", async function () {
        const r1 = await castleService.getReview("1234");
        assert.isNull(r1);
        const r2 = await castleService.getReview("012345678901234567890123");
        assert.isNull(r2);
      });
    
      test("delete a review", async function () {
        let r = await castleService.createReview(newReview);
        assert(r._id != null);
        await castleService.deleteOneReview(r._id);
        r = await castleService.getReview(r._id);
        assert(r == null);
      });

      test("get all reviews", async function () {
        for (let r of reviews) {
          await castleService.createReview(r);
        }
    
        const allReviews = await castleService.getReviews();
        assert.equal(allReviews.length, reviews.length);
      });
    
});


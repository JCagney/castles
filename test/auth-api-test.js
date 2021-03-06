"use strict";

const assert = require("chai").assert;
const CastleService = require("./castle-service");
const fixtures = require("./fixtures.json");
const utils = require("../app/api/utils.js");

suite("Authentication API tests", function () {
  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const castleService = new CastleService(fixtures.castleService);

  setup(async function () {
    await castleService.deleteAllUsers();
  });

  test("authenticate", async function () {
    const returnedUser = await castleService.createUser(newUser);
    const response = await castleService.authenticate(newUser);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async function () {
    const returnedUser = await castleService.createUser(newUser);
    const response = await castleService.authenticate(newUser);

    const userInfo = utils.decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });
});
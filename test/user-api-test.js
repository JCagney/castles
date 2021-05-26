"use strict";

const assert = require("chai").assert;
const CastleService = require("./castle-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("User API tests", function () {
  let users = fixtures.users;
  let newUser = fixtures.newUser;

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


  test("create a user", async function () {
    const returnedUser = await castleService.createUser(newUser);
    assert.equal(returnedUser.firstName, newUser.firstName);
    assert.equal(returnedUser.lastName, newUser.lastName);
    assert.equal(returnedUser.email, newUser.email);
    assert.isDefined(returnedUser._id);
  });

  test("get user", async function () {
    const u1 = await castleService.createUser(newUser);
    const u2 = await castleService.getUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  test("get invalid user", async function () {
    const u1 = await castleService.getUser("1234");
    assert.isNull(u1);
    const u2 = await castleService.getUser("012345678901234567890123");
    assert.isNull(u2);
  });

  test("delete a user", async function () {
    let u = await castleService.createUser(newUser);
    assert(u._id != null);
    await castleService.deleteOneUser(u._id);
    u = await castleService.getUser(u._id);
    assert(u == null);
  });

  test("get all users", async function () {
    await castleService.deleteAllUsers();
    await castleService.createUser(newUser);
    await castleService.authenticate(newUser);
    for (let u of users) {
      await castleService.createUser(u);
    }

    const allUsers = await castleService.getUsers();
    assert.equal(allUsers.length, users.length + 1);
  });

  test("get users detail", async function () {
    await castleService.deleteAllUsers();
    const user = await castleService.createUser(newUser);
    await castleService.authenticate(newUser);
    for (let u of users) {
      await castleService.createUser(u);
    }

    const testUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    };
    users.unshift(testUser);

    const allUsers = await castleService.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert.equal(allUsers[i].firstName, users[i].firstName);
      assert.equal(allUsers[i].lastName, users[i].lastName);
      assert.equal(allUsers[i].email, users[i].email);
    }
  });

  test("get all users empty", async function () {
    await castleService.deleteAllUsers();
    const user = await castleService.createUser(newUser);
    await castleService.authenticate(newUser);
    const allUsers = await castleService.getUsers();
    assert.equal(allUsers.length, 1);
  });
});
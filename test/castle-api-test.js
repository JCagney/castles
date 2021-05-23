"use strict";

const assert = require("chai").assert;
const CastleService = require("./castle-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Castle API tests", function () {
  let castles = fixtures.castles;
  let newCastle = fixtures.newCastle;
  let editCastle = fixtures.editCastle; 

  const castleService = new CastleService(fixtures.castleService);
  let newUser = fixtures.newUser;

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
    await castleService.deleteAllCastles();
  });

  teardown(async function () {
    await castleService.deleteAllCastles();
  });

  test("create a castle", async function () {
    const returnedCastle = await castleService.createCastle(newCastle);
    assert(_.some([returnedCastle], newCastle), "returnedCastle must be a superset of newCastle");
    assert.isDefined(returnedCastle._id);
  });

  test("edit a castle", async function () {
    const createdCastle = await castleService.createCastle(newCastle);
    const editedCastle = await castleService.editCastle(createdCastle._id, editCastle);
    assert(_.some([editedCastle], editCastle), "editedCastle must be a superset of editCastle");
    assert.isDefined(editedCastle._id);
  });

  test("get castle", async function () {
    const c1 = await castleService.createCastle(newCastle);
    const c2 = await castleService.getCastle(c1._id);
    assert.deepEqual(c1, c2);
  });

  test("get invalid castle", async function () {
    const c1 = await castleService.getCastle("1234");
    assert.isNull(c1);
    const c2 = await castleService.getCastle("012345678901234567890123");
    assert.isNull(c2);
  });

  test("delete a castle", async function () {
    let c = await castleService.createCastle(newCastle);
    assert(c._id != null);
    await castleService.deleteOneCastle(c._id);
    c = await castleService.getCastle(c._id);
    assert(c == null);
  });

  test("get all castles", async function () {
    for (let c of castles) {
      await castleService.createCastle(c);
    }

    const allCastles = await castleService.getCastles();
    assert.equal(allCastles.length, castles.length);
  });

  test("get castles detail", async function () {
    for (let c of castles) {
      await castleService.createCastle(c);
    }

    const allCastles = await castleService.getCastles();
    for (var i = 0; i < castles.length; i++) {
      assert(_.some([allCastles[i]], castles[i]), "returnedCandidate must be a superset of newCandidate");
    }
  });

  test("get all castles empty", async function () {
    const allCastles = await castleService.getCastles();
    assert.equal(allCastles.length, 0);
  });

  test("add rating", async function () {
    const c1 = await castleService.createCastle(newCastle);
    await castleService.addRating(c1._id, "5"); 
    const c2 = await castleService.getCastle(c1._id);
    assert.equal(c2.ratings[0], 5); 
  });
  
});
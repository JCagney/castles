"use strict";

const assert = require("chai").assert;
const CastleService = require("./castle-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Category API tests", function () {
  //let categories = fixtures.categories;
  //let newCategory = fixtures.newCategory;

  const castleService = new CastleService("http://localhost:3000");

  //setup(async function () {
  //  await castleService.deleteAllCategories();
  //});

  //teardown(async function () {
  //  await castleService.deleteAllCategories();
  //});

  test("get all categries", async function () {
    const allCategories = await castleService.getCategories();
    assert.isDefined(allCategories);
  });

  test("get category", async function () {
    const category = await castleService.getCategory("6057aa55daf2c92c78d71bff");
    assert.isDefined(category);
  });

  test("get invalid category", async function () {
    const c1 = await castleService.getCategory("1234");
    assert.isNull(c1);
    const c2 = await castleService.getCategory("012345678901234567890123");
    assert.isNull(c2);
  });

});
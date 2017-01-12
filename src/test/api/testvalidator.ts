// Copyright (c) 2016 (jw872505975@gmail.com). All rights reserved.

import * as chai from "chai";

import {Validator} from "../../api/validator";

describe("Validator", () => {
  it("Test Validator toStr undefined", () => {
    let a: any = undefined;
    let validator: Validator = new Validator();
    validator.toStr(a, "invalid a");
    chai.expect(validator.hasErrors()).to.equal(true);
    chai.expect(validator.errors[0].reason).to.equal("invalid a");
  });

  it("Test Validator toDate 正确", () => {
    let a: string = "2016-12-12";
    let validator: Validator = new Validator();
    validator.toDate(a, "invalid a");
    chai.expect(validator.hasErrors()).to.equal(false);
  });

  it("Test Validator toDate 错误", () => {
    let a: string = "12qw";
    let validator: Validator = new Validator();
    validator.toDate(a, "invalid a");
    chai.expect(validator.hasErrors()).to.equal(true);
    chai.expect(validator.errors[0].reason).to.equal("invalid a");
  });
});

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

  it("Test Validator toDate use moment", () => {
    let a: string = "2016-1-1";
    let b: string = "2016-01-01";
    let c: string = `"2016-1-1"`;
    let d: string = `"2016-01-01"`;
    let validator: Validator = new Validator();
    validator.toDate(a);
    chai.expect(validator.hasErrors()).to.equal(true);
    let validatorB: Validator = new Validator();
    validatorB.toDate(b);
    chai.expect(validatorB.hasErrors()).to.equal(false);
    let validatorC: Validator = new Validator();
    validator.toDate(c);
    chai.expect(validator.hasErrors()).to.equal(true);
    let validatorD: Validator = new Validator();
    validator.toDate(d);
    chai.expect(validator.hasErrors()).to.equal(true);
  });
});

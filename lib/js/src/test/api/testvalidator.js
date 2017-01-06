"use strict";
const chai = require("chai");
const validator_1 = require("../../api/validator");
describe('Validator', () => {
    it('Test Validator toStr undefined', () => {
        let a;
        let validator = new validator_1.Validator();
        validator.toStr(a, 'invalid a');
        chai.expect(validator.hasErrors()).to.equal(true);
        chai.expect(validator.errors[0].reason).to.equal('invalid a');
    });
    it('Test Validator toDate 正确', () => {
        let a = '2016-12-12';
        let validator = new validator_1.Validator();
        validator.toDate(a, 'invalid a');
        chai.expect(validator.hasErrors()).to.equal(false);
    });
    it('Test Validator toDate 错误', () => {
        let a = '12qw';
        let validator = new validator_1.Validator();
        validator.toDate(a, 'invalid a');
        chai.expect(validator.hasErrors()).to.equal(true);
        chai.expect(validator.errors[0].reason).to.equal('invalid a');
    });
});

//# sourceMappingURL=testvalidator.js.map

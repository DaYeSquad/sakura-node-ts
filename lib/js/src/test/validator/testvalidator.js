"use strict";
const chai = require("chai");
const validator_1 = require("../../api/validator");
describe('validator test', () => {
    it('test turn a string into number array', () => {
        let str = '[1,2,3]';
        let validator = new validator_1.Validator();
        let numArr = validator.toNumberArray(str, 'invalid parm');
        chai.expect(numArr[0]).to.be.equal(1);
        chai.expect(numArr[1]).to.be.equal(2);
        chai.expect(numArr[2]).to.be.equal(3);
        let errOrNot = validator.hasErrors();
        chai.expect(errOrNot).to.be.equal(false);
    });
    it('parm is null', () => {
        let str = null;
        let validator = new validator_1.Validator();
        let numArr = validator.toNumberArray(str, 'invalid parm');
        chai.expect(validator.errors[0].reason).to.be.equal('invalid parm');
    });
    it('string is []', () => {
        let str = '[]';
        let validator = new validator_1.Validator();
        let numArr = validator.toNumberArray(str, 'invalid parm');
        chai.expect(validator.errors[0].reason).to.be.equal('invalid parm');
    });
    it(`string is '[1,2'`, () => {
        let str = '[1,2';
        let validator = new validator_1.Validator();
        let numArr = validator.toNumberArray(str, 'invalid parm');
        chai.expect(validator.errors[0].reason).to.be.equal('invalid parm');
    });
    it(`string is '1,2]'`, () => {
        let str = '1,2]';
        let validator = new validator_1.Validator();
        let numArr = validator.toNumberArray(str, 'invalid parm');
        chai.expect(validator.errors[0].reason).to.be.equal('invalid parm');
    });
    it(`string is '1,2'`, () => {
        let str = '1,2';
        let validator = new validator_1.Validator();
        let numArr = validator.toNumberArray(str, 'invalid parm');
        chai.expect(validator.errors[0].reason).to.be.equal('invalid parm');
    });
    it(`string is '[1,a]'`, () => {
        let str = '[1,a]';
        let validator = new validator_1.Validator();
        let numArr = validator.toNumberArray(str, 'invalid parm');
        chai.expect(validator.errors[0].reason).to.be.equal('invalid parm');
    });
    it(`string is '[1, 2]'`, () => {
        let str = '[1, 2]';
        let validator = new validator_1.Validator();
        let numArr = validator.toNumberArray(str, 'invalid parm');
        chai.expect(numArr[0]).to.be.equal(1);
        chai.expect(numArr[1]).to.be.equal(2);
    });
});

//# sourceMappingURL=testvalidator.js.map

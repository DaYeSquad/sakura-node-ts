// Copyright 2016 huteng (hutengf@gagogroup.com). All rights reserved.,
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from 'chai';

import {Validator} from '../../api/validator';

describe('validator test', () => {
  it('test turn a string into number array', () => {
    let str: string = '[1,2,3]';
    let validator = new Validator();
    let numArr = validator.toNumberArray(str, 'invalid parm');
    chai.expect(numArr[0]).to.be.equal(1);
    chai.expect(numArr[1]).to.be.equal(2);
    chai.expect(numArr[2]).to.be.equal(3);
    let errOrNot: boolean =  validator.hasErrors();
    chai.expect(errOrNot).to.be.equal(false);
  });

  it('parm is null', () => {
    let str: string = null;
    let validator = new Validator();
    let numArr = validator.toNumberArray(str, 'invalid parm');
    chai.expect(validator.errors[0].reason).to.be.equal('invalid parm');
  });

  it('string is []', () => {
    let str: string = '[]';
    let validator = new Validator();
    let numArr = validator.toNumberArray(str, 'invalid parm');
    chai.expect(validator.errors[0].reason).to.be.equal('invalid parm');
  });

  it(`string is '[1,2'`, () => {
    let str: string = '[1,2';
    let validator = new Validator();
    let numArr = validator.toNumberArray(str, 'invalid parm');
    chai.expect(validator.errors[0].reason).to.be.equal('invalid parm');
  });

  it(`string is '1,2]'`, () => {
    let str: string = '1,2]';
    let validator = new Validator();
    let numArr = validator.toNumberArray(str, 'invalid parm');
    chai.expect(validator.errors[0].reason).to.be.equal('invalid parm');
  });

  it(`string is '1,2'`, () => {
    let str: string = '1,2';
    let validator = new Validator();
    let numArr = validator.toNumberArray(str, 'invalid parm');
    chai.expect(validator.errors[0].reason).to.be.equal('invalid parm');
  });

  it(`string is '[1,a]'`, () => {
    let str: string = '[1,a]';
    let validator = new Validator();
    let numArr = validator.toNumberArray(str, 'invalid parm');
    chai.expect(validator.errors[0].reason).to.be.equal('invalid parm');
  });

  it(`string is '[1, 2]'`, () => {
    let str: string = '[1, 2]';
    let validator = new Validator();
    let numArr = validator.toNumberArray(str, 'invalid parm');
    chai.expect(numArr[0]).to.be.equal(1);
    chai.expect(numArr[1]).to.be.equal(2);
  });
});
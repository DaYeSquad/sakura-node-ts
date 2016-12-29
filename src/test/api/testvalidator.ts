// Copyright (c) 2016 (jw872505975@gmail.com). All rights reserved.

import * as chai from 'chai';

import {Validator} from '../../api/validator';

describe('Validator', () => {
  it('Test Validator toStr undefined', () => {
    let a;
    let validator: Validator = new Validator();
    validator.toStr(a, 'invalid a');
    chai.expect(validator.hasErrors()).to.equal(true);
    chai.expect(validator.errors[0].reason).to.equal('invalid a');
  });
});

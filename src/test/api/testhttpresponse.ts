// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from 'chai';

import {SuccessResponse} from '../../api/httpresponse';

describe('HttpResponse', () => {
  it('Test SuccessResponse.toJSON()', () => {
    const data: any = {
      uid: 1990,
      username: 'frank'
    };

    let res: SuccessResponse = new SuccessResponse(data);
    const result: string = JSON.stringify(res);
    chai.expect(result).to.equal(`{"data":{"uid":1990,"username":"frank","code":200}}`);
  });
});

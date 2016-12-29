"use strict";
const chai = require("chai");
const httpresponse_1 = require("../../api/httpresponse");
describe('HttpResponse', () => {
    it('Test SuccessResponse.toJSON()', () => {
        const data = {
            uid: 1990,
            username: 'frank'
        };
        let res = new httpresponse_1.SuccessResponse(data);
        const result = JSON.stringify(res);
        chai.expect(result).to.equal(`{"data":{"uid":1990,"username":"frank","code":200}}`);
    });
});

//# sourceMappingURL=testhttpresponse.js.map

"use strict";
const chai = require('chai');
const deletequery_1 = require('../../sqlquery/deletequery');
describe('Test delete query', () => {
    it('Test build from named table', () => {
        let sql = new deletequery_1.DeleteQuery().from('users').build();
        chai.expect(sql).to.equal('DELETE FROM users');
    });
});

//# sourceMappingURL=testdeletequery.js.map

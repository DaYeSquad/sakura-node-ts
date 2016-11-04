"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const chai = require("chai");
const updatequery_1 = require("../../sqlquery/updatequery");
const decorator_1 = require("../../base/decorator");
const model_1 = require("../../base/model");
let User = class User extends model_1.Model {
};
User = __decorate([
    decorator_1.TableName('users')
], User);
describe('UpdateQuery', () => {
    it('UpdateQuery with one set and where', () => {
        const sql = new updatequery_1.UpdateQuery().table('films').set('kind', 'Dramatic').where(`kind='Drama'`).build();
        chai.expect(sql).to.equal(`UPDATE films SET kind='Dramatic' WHERE kind='Drama';`);
    });
    it('UpdateQuery table name from class', () => {
        const sql = new updatequery_1.UpdateQuery().tableNameFromClass(User).set('kind', 'Dramatic').where(`kind='Drama'`).build();
        chai.expect(sql).to.equal(`UPDATE users SET kind='Dramatic' WHERE kind='Drama';`);
    });
});

//# sourceMappingURL=testupdatequery.js.map

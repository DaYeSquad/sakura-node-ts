"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const model_1 = require('../base/model');
const decorator_1 = require('../base/decorator');
let Version = class Version extends model_1.Model {
};
__decorate([
    decorator_1.Column('id', model_1.SqlType.INT, model_1.SqlFlag.PRIMARY_KEY, '唯一编码', model_1.SqlDefaultValue.SERIAL())
], Version.prototype, "id_", void 0);
__decorate([
    decorator_1.Column('version', model_1.SqlType.INT, model_1.SqlFlag.NOT_NULL, '版本号')
], Version.prototype, "version", void 0);
Version = __decorate([
    decorator_1.TableName('version')
], Version);
exports.Version = Version;

//# sourceMappingURL=version.js.map

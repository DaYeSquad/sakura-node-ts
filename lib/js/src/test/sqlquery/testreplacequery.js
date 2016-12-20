"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const chai = require("chai");
const replacequery_1 = require("../../sqlquery/replacequery");
const model_1 = require("../../base/model");
const decorator_1 = require("../../base/decorator");
let WeatherCacheInfo = class WeatherCacheInfo extends model_1.Model {
    constructor() {
        super(...arguments);
        this.meta = {};
    }
    init(uri, alias, meta, expiresAt) {
        this.uri = uri;
        this.alias = alias;
        this.meta = meta;
        this.expiresAt = expiresAt;
    }
};
__decorate([
    decorator_1.Column('id', model_1.SqlType.INT, model_1.SqlFlag.PRIMARY_KEY)
], WeatherCacheInfo.prototype, "id_", void 0);
__decorate([
    decorator_1.Column('uri', model_1.SqlType.VARCHAR_255, model_1.SqlFlag.NOT_NULL)
], WeatherCacheInfo.prototype, "uri", void 0);
__decorate([
    decorator_1.Column('alias', model_1.SqlType.VARCHAR_255, model_1.SqlFlag.NOT_NULL)
], WeatherCacheInfo.prototype, "alias", void 0);
__decorate([
    decorator_1.Column('meta', model_1.SqlType.JSON, model_1.SqlFlag.NOT_NULL)
], WeatherCacheInfo.prototype, "meta", void 0);
__decorate([
    decorator_1.Column('expires_at', model_1.SqlType.TIMESTAMP, model_1.SqlFlag.NOT_NULL)
], WeatherCacheInfo.prototype, "expiresAt", void 0);
WeatherCacheInfo = __decorate([
    decorator_1.TableName('_weather_caches')
], WeatherCacheInfo);
describe('ReplaceQuery', () => {
    it('Test build', () => {
        let weatherCache = new WeatherCacheInfo();
        weatherCache.init('forecast_temperatures', 'shuye_dikuai_1', {}, 1476842006);
        const sql = new replacequery_1.ReplaceQuery()
            .fromClass(WeatherCacheInfo)
            .where(`uri='${weatherCache.uri}'`, `alias='${weatherCache.alias}'`)
            .set('uri', weatherCache.uri, model_1.SqlType.VARCHAR_255)
            .set('alias', weatherCache.alias, model_1.SqlType.VARCHAR_255)
            .set('expires_at', weatherCache.expiresAt, model_1.SqlType.TIMESTAMP)
            .build();
        chai.expect(sql).to.equal(`UPDATE _weather_caches SET uri='forecast_temperatures',alias='shuye_dikuai_1',expires_at=to_timestamp(1476842006) WHERE uri='forecast_temperatures' AND alias='shuye_dikuai_1';
            INSERT INTO _weather_caches (uri,alias,expires_at)
            SELECT 'forecast_temperatures','shuye_dikuai_1',to_timestamp(1476842006)
            WHERE NOT EXISTS (SELECT 1 FROM _weather_caches WHERE uri='forecast_temperatures' AND alias='shuye_dikuai_1');`);
    });
});

//# sourceMappingURL=testreplacequery.js.map

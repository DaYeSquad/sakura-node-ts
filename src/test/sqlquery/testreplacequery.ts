// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {ReplaceQuery} from "../../sqlquery/replacequery";
import {SqlType, Model, SqlFlag} from "../../base/model";
import {TableName, Column} from "../../base/decorator";
import {timestamp} from "../../base/typedefines";

@TableName("_weather_caches")
class WeatherCacheInfo extends Model {

  @Column("id", SqlType.INT, SqlFlag.PRIMARY_KEY)
  private id_: number;

  @Column("uri", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  uri: string;

  @Column("alias", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  alias: string;

  @Column("meta", SqlType.JSON, SqlFlag.NOT_NULL)
  meta: any = {};

  @Column("expires_at", SqlType.TIMESTAMP, SqlFlag.NOT_NULL)
  expiresAt: timestamp;

  init(uri: string, alias: string, meta: any, expiresAt: timestamp) {
    this.uri = uri;
    this.alias = alias;
    this.meta = meta;
    this.expiresAt = expiresAt;
  }
}

describe("ReplaceQuery", () => {
  it("Test build", () => {
    let weatherCache: WeatherCacheInfo = new WeatherCacheInfo();
    weatherCache.init("forecast_temperatures", "shuye_dikuai_1", {}, 1476842006);
    const sql: string =
      new ReplaceQuery()
        .fromClass(WeatherCacheInfo)
        .where(`uri="${weatherCache.uri}"`, `alias="${weatherCache.alias}"`)
        .set("uri", weatherCache.uri, SqlType.VARCHAR_255)
        .set("alias", weatherCache.alias, SqlType.VARCHAR_255)
        .set("expires_at", weatherCache.expiresAt, SqlType.TIMESTAMP)
        .build();
    chai.expect(sql).to.equal(`UPDATE _weather_caches SET uri="forecast_temperatures",alias="shuye_dikuai_1",expires_at=to_timestamp(1476842006) WHERE uri="forecast_temperatures" AND alias="shuye_dikuai_1";
            INSERT INTO _weather_caches (uri,alias,expires_at)
            SELECT "forecast_temperatures","shuye_dikuai_1",to_timestamp(1476842006)
            WHERE NOT EXISTS (SELECT 1 FROM _weather_caches WHERE uri="forecast_temperatures" AND alias="shuye_dikuai_1");`);
  });
});

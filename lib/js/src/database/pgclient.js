"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const pg = require("pg");
class PgClient {
    init(user, password, database, host, port, max, idleTimeoutMillis) {
        let config = {
            user: user,
            database: database,
            password: password,
            host: host,
            port: port,
            max: max,
            idleTimeoutMillis: idleTimeoutMillis
        };
        this.pool_ = new pg.Pool(config);
    }
    static getInstance() {
        return PgClient.instance_;
    }
    static setInstance(client) {
        PgClient.instance_ = client;
    }
    query(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            let client = yield this.pool_.connect();
            try {
                return yield client.query(sql);
            }
            finally {
                client.release();
            }
        });
    }
}
exports.PgClient = PgClient;

//# sourceMappingURL=pgclient.js.map

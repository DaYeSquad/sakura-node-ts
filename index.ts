// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// -------------------------------------------------------------------------
// Type defines
// -------------------------------------------------------------------------

export { timestamp, PgQueryResult } from "./src/base/typedefines";

// -------------------------------------------------------------------------
// Middleware
// -------------------------------------------------------------------------

export { corsAllowAll } from "./src/middleware/cors";
export { haltOnTimedout } from "./src/middleware/timeout";

// -------------------------------------------------------------------------
// API
// -------------------------------------------------------------------------

export { ApiError } from "./src/api/apierror";
export { HttpResponse, SuccessResponse, BadRequestResponse, NotFoundResponse, RegisterErrorResponse, AuthErrorResponse, ErrorResponse } from "./src/api/httpresponse";
export { Validator } from "./src/api/validator";

// -------------------------------------------------------------------------
// Base
// -------------------------------------------------------------------------

export { TableName, Column } from "./src/base/decorator";
export { Model, SqlFlag, SqlType, SqlField, SqlDefaultValue, SqlDefaultValueType } from "./src/base/model";

// -------------------------------------------------------------------------
// Database
// -------------------------------------------------------------------------

export { DeleteQuery } from "./src/sqlquery/deletequery";
export { InsertQuery } from "./src/sqlquery/insertquery";
export { ReplaceQuery } from "./src/sqlquery/replacequery";
export { SelectQuery } from "./src/sqlquery/selectquery";
export { UpdateQuery } from "./src/sqlquery/updatequery";

export * from "./src/database/dbclient";
export * from "./src/database/driver";
export * from "./src/database/driveroptions";
export * from "./src/database/querybuilder";
export * from "./src/database/queryresult";

export * from "./src/database/error/internalerror";
export * from "./src/database/error/unknowndrivererror";

export * from "./src/database/migration/column";
export * from "./src/database/migration/migration";
export * from "./src/database/migration/operation";
export * from "./src/database/migration/version";

export * from "./src/database/postgres/pgdriver";
export * from "./src/database/postgres/pgquerybuilder";

export * from "./src/database/mysql/mysqldriver";
export * from "./src/database/mysql/mysqlquerybuilder";

// -------------------------------------------------------------------------
// Utils
// -------------------------------------------------------------------------

export { sqlContext } from "./src/util/sqlcontext";
export { DateFormatter, DateFormtOption } from "./src/util/dateformatter";
export { DateUtil, DateEqualityPrecision } from "./src/util/dateutil";

"use strict";
function corsAllowAll(headers, methods) {
    return (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        let allowMethodsStr = 'GET, POST, OPTIONS, PUT, PATCH, DELETE';
        if (methods) {
            allowMethodsStr = methods.join(',');
        }
        res.setHeader('Access-Control-Allow-Methods', allowMethodsStr);
        let allowHeaderStr = 'X-Requested-With,content-type,Token';
        if (headers) {
            allowHeaderStr = headers.join(',');
        }
        res.setHeader('Access-Control-Allow-Headers', allowHeaderStr);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
    };
}
exports.corsAllowAll = corsAllowAll;

//# sourceMappingURL=cors.js.map

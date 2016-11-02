"use strict";
function corsAllowOnce() {
    return (req, res, next) => {
        const requestOrigin = req.header('Origin');
        if (!requestOrigin) {
            return next();
        }
        else {
            res.setHeader('Access-Control-Allow-Origin', requestOrigin);
        }
        const customMethod = req.header('Access-Control-Allow-Methods');
        const customHeaders = req.header('Access-Control-Allow-Headers');
        if (customMethod) {
            res.setHeader('Access-Control-Allow-Methods', customMethod);
        }
        if (customHeaders) {
            res.setHeader('Access-Control-Allow-Headers', customHeaders);
        }
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return next();
    };
}
exports.corsAllowOnce = corsAllowOnce;
function corsAllowAll() {
    return (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Token');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
    };
}
exports.corsAllowAll = corsAllowAll;

//# sourceMappingURL=cors.js.map

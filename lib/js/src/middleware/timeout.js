"use strict";
function haltOnTimedout(req, res, next) {
    if (!req.timedout)
        next();
}
exports.haltOnTimedout = haltOnTimedout;

//# sourceMappingURL=timeout.js.map

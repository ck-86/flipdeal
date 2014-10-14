/**************************************
 * CORS
 ***************************************
 * Middleware for cross-origin request
 */
var cors = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Cache-Control', 'public, max-age=3000');
    next();
};

module.exports = cors;

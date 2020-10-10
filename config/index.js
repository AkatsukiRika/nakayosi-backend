var devEnv = require('./development');
var testEnv = require('./test');

module.exports = {
    development: devEnv,
    test: testEnv
}[process.env.NODE_ENV || 'development']
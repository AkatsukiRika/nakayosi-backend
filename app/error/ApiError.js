const ApiErrorNames = require('./ApiErrorNames');

/**
 * 自定义API异常
 */
class ApiError extends Error {
    constructor(errorName) {
        super();
        var errorInfo = ApiErrorNames.getErrorInfo(errorName);
        this.name = errorName;
        this.code = errorInfo.code;
        this.message = errorInfo.message;
    }
}

module.exports = ApiError;
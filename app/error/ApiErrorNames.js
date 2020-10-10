/**
 * API错误名称
 */
var ApiErrorNames = {};

ApiErrorNames.UNKNOWN_ERROR = "unknownError";
ApiErrorNames.INTRO_NOT_EXISTS = "introNotExists";

/**
 * API错误名称及对应的错误信息
 */
const errorMap = new Map();

errorMap.set(ApiErrorNames.UNKNOWN_ERROR, {
    code: -1,
    message: '未知错误'
});
errorMap.set(ApiErrorNames.INTRO_NOT_EXISTS, {
    code: 101,
    message: '介绍不存在'
});

ApiErrorNames.getErrorInfo = (errorName) => {
    var errorInfo;
    if (errorName) {
        errorInfo = errorMap.get(errorName);
    }
    if (!errorName) {
        errorName = UNKNOWN_ERROR;
        errorInfo = errorMap.get(errorName);
    }
    return errorInfo;
}

module.exports = ApiErrorNames;
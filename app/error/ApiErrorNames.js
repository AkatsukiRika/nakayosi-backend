/**
 * API错误名称
 */
var ApiErrorNames = {};

ApiErrorNames.UNKNOWN_ERROR = "unknownError";
ApiErrorNames.AUDIO_VERSION_ERROR = "audioVersionError";

/**
 * API错误名称及对应的错误信息
 */
const errorMap = new Map();

errorMap.set(ApiErrorNames.UNKNOWN_ERROR, {
    code: -1,
    message: 'unknown error'
});
errorMap.set(ApiErrorNames.AUDIO_VERSION_ERROR, {
    code: -2,
    message: 'audio version number in client greater than server'
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
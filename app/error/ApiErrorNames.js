/**
 * API错误名称
 */
var ApiErrorNames = {};

ApiErrorNames.UNKNOWN_ERROR = "unknownError";
ApiErrorNames.AUDIO_VERSION_ERROR = "audioVersionError";
ApiErrorNames.AUDIO_NAME_ERROR = "audioNameError";

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
errorMap.set(ApiErrorNames.AUDIO_NAME_ERROR, {
    code: -3,
    message: 'audio name not exists on server'
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
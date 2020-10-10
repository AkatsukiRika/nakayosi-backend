const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

exports.getIntro = async (ctx, next) => {
    if (ctx.query.id != 1) {
        throw new ApiError(ApiErrorNames.INTRO_NOT_EXISTS);
    }
    ctx.body = {
        data: 'testData'
    }
}
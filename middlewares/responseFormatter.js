var ApiError = require('../app/error/ApiError');

/**
 * 在app.use(router)之前调用
 * @param {*} ctx 
 * @param {*} next 
 */
var responseFormatter = async (ctx, next) => {
    // 如果有返回数据，将数据添加到data中
    if (ctx.body) {
        ctx.body = {
            code: 0,
            message: 'success',
            data: ctx.body
        }
    } else {
        ctx.body = {
            code: 0,
            message: 'success'
        }
    }
}

var urlFilter = function (pattern) {
    return async (ctx, next) => {
        var reg = new RegExp(pattern);
        try {
            // 先执行路由
            await next();
        } catch (error) {
            if (error instanceof ApiError && reg.test(ctx.originalUrl)) {
                ctx.status = 200;
                ctx.body = {
                    code: error.code,
                    message: error.message
                }
                console.log('ERROR_CTX', ctx.body)
            }
            // 继续抛出错误，让外层中间件处理日志
            throw error;
        }
        // 符合条件的URL进行格式化
        if (reg.test(ctx.originalUrl)) {
            responseFormatter(ctx);
        }
    }
}

module.exports = urlFilter;
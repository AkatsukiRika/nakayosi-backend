const state = require('../../state')
const axios = require('axios')

/**
 * @method POST
 * @param {realName} 真实姓名(string)
 * @param {idNumber} 身份证号(string)
 * @param {phoneNumber} 手机号(string)
 * @param {email} 电子邮箱(string) 
 * @param {richText} 申请详情(string, 为quill使用的json格式)
 */
exports.addProUser = async (ctx, next) => {
    const requestBody = ctx.request.body
    const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_USER_SUFFIX
    const elasticReq = {
        'realName': requestBody.realName,
        'idNumber': requestBody.idNumber,
        'phoneNumber': requestBody.phoneNumber,
        'email': requestBody.email,
        'richText': requestBody.richText
    }
    const res = await axios.post(elasticUrl, elasticReq)
    const resData = res.data
    const resId = resData._id
    const resStatus = resData.result
    ctx.body = {
        'status': resStatus,
        'id': resId
    }
}

/**
 * @method POST
 * @param {idNumber} 用户唯一ID(string)
 * @param {password} 已在客户端使用MD5加密过的密码(string)
 */
exports.setProUserPassword = async (ctx, next) => {
    const requestBody = ctx.request.body
    const reqId = requestBody.idNumber
    const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_USER_SUFFIX + `/${reqId}/_update`
    const elasticReq = {
        'doc': {
            'password': requestBody.password
        }
    }
    const res = await axios.post(elasticUrl, elasticReq)
    const resData = res.data
    const resStatus = resData.result
    const resVersion = resData._version
    ctx.body = {
        'status': resStatus,
        'version': resVersion
    }
}
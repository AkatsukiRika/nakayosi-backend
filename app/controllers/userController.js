const state = require('../../state')
const axios = require('axios')

const DEFAULT_FROM = 0
const DEFAULT_SIZE = 25

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

exports.getProUserListBg = async (ctx, next) => {
    const queryParams = ctx.query
    const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_USER_SUFFIX + state.ELASTIC_SEARCH_SUFFIX
    const elasticReq = {
        'from': queryParams.from ? queryParams.from : DEFAULT_FROM,
        'size': queryParams.size ? queryParams.size : DEFAULT_SIZE
    }
    if (queryParams.realName) {
        elasticReq.query = {
            'match': {
                'realName': queryParams.realName
            }
        }
    }
    const res = await axios.post(elasticUrl, elasticReq)
    const resultList = res.data.hits.hits
    let responseList = []
    for (let i = 0; i < resultList.length; i++) {
        responseList.push({
            'id': resultList[i]._id,
            'realName': resultList[i]._source.realName,
            'idNumber': resultList[i]._source.idNumber,
            'phoneNumber': resultList[i]._source.phoneNumber,
            'email': resultList[i]._source.email,
            'richText': resultList[i]._source.richText,
            'password': resultList[i]._source.password
        })
    }
    ctx.body = {
        'count': res.data.hits.total,
        'response': responseList
    }
}
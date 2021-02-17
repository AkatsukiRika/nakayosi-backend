const state = require("../../state")

const axios = require('axios')

/**
 * @method POST
 * @param {title} 问题标题 
 * @param {question} 问题详细内容
 * @returns {status} 字符串类型，Elastic返回的创建状态，成功则为"created"
 * @returns {id} 添加成功的问题唯一ID
 */
exports.addQuestion = async (ctx, next) => {
    const requestBody = ctx.request.body
    const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_MAIN_SUFFIX
    const elasticReq = {
        'title': requestBody.title,
        'question': requestBody.question
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
 * @param {id} 需要删除的问题ID，字符串类型，一次只能删除一个 
 * @returns {deleted} 已删除的问题数量，整数
 * @returns {failures} 删除失败的问题，数组
 */
exports.delQuestion = async (ctx, next) => {
    const requestBody = ctx.request.body
    const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_QUESTION_DEL_SUFFIX
    const elasticReq = {
        'query': {
            'ids': {
                'values': [requestBody.id]
            }
        }
    }
    const res = await axios.post(elasticUrl, elasticReq)
    const resData = res.data
    const resDeletedCount = resData.deleted
    const resFailures = resData.failures
    ctx.body = {
        'deleted': resDeletedCount,
        'failures': resFailures
    }
}
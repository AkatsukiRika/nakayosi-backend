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

// 待补充文档
exports.addAnswer = async (ctx, next) => {
    const requestBody = ctx.request.body
    // 先根据前端传的id找出该条question记录的内容
    let elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_MAIN_SUFFIX + state.ELASTIC_SEARCH_SUFFIX
    let elasticReq = {
        'query': {
            'ids': {
                'values': [requestBody.id]
            }
        }
    }
    let res = await axios.post(elasticUrl, elasticReq)
    const resData = res.data
    const hitObj = resData.hits.hits
    const questionObj = hitObj[0]._source
    if (questionObj.answers) {
        questionObj.answers.push(requestBody.answer)
    } else {
        questionObj.answers = [requestBody.answer]
    }
    // 将新questionObj重新发送给ElasticSearch
    elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_MAIN_SUFFIX + `/${requestBody.id}`
    elasticReq = questionObj
    try {
        res = await axios.put(elasticUrl, elasticReq)
        ctx.body = {
            'status': 'success',
            'errMsg': ''
        }
    } catch (error) {
        ctx.body = {
            'status': 'fail',
            'errMsg': error.description
        }
    }
}

// 待补充文档
exports.delLastAnswer = async (ctx, next) => {
    const requestBody = ctx.request.body
    // 先根据前端传的id找出该条question记录的内容
    let elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_MAIN_SUFFIX + state.ELASTIC_SEARCH_SUFFIX
    let elasticReq = {
        'query': {
            'ids': {
                'values': [requestBody.id]
            }
        }
    }
    let res = await axios.post(elasticUrl, elasticReq)
    const resData = res.data
    const hitObj = resData.hits.hits
    const questionObj = hitObj[0]._source
    if (!questionObj.answers) {
        ctx.body = {
            'status': 'fail',
            'errMsg': '该问题的回答数已经为0'
        }
    }
    questionObj.answers.pop()
    // 将新questionObj重新发送给ElasticSearch
    elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_MAIN_SUFFIX + `/${requestBody.id}`
    elasticReq = questionObj
    try {
        res = await axios.put(elasticUrl, elasticReq)
        ctx.body = {
            'status': 'success',
            'errMsg': ''
        }
    } catch (error) {
        ctx.body = {
            'status': 'fail',
            'errMsg': error.description
        }
    }
}
const moment = require('moment')
const os = require('os')
const state = require('../../state')
const axios = require('axios')

const DEFAULT_FROM = 0
const DEFAULT_SIZE = 10

exports.getInfo = async (ctx, next) => {
    ctx.body = {
        'name': state.PROGRAM_NAME,
        'version': state.VERSION_CODE,
        'serverTime': moment().format('YYYY-MM-DD HH:mm:ss'),
        'osType': os.type(),
        'osPlatform': os.platform(),
        'cpuArch': os.arch(),
        'totalMemoryMB': os.totalmem() / 1024 / 1024
    }
}

exports.getResultList = async (ctx, next) => {
    const elasticReq = {
        'query': {
            'match': {
                'question': ctx.query.question
            }
        },
        'from': ctx.query.from !== DEFAULT_FROM ? ctx.query.from : DEFAULT_FROM,
        'size': ctx.query.size !== DEFAULT_SIZE ? ctx.query.size : DEFAULT_SIZE
    }
    const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_MAIN_SUFFIX + state.ELASTIC_SEARCH_SUFFIX
    const res = await axios.post(elasticUrl, elasticReq)
    const resultList = res.data.hits.hits
    let responseList = []
    for (let i = 0; i < resultList.length; i++) {
        responseList.push({
            'id': resultList[i]._id,
            'title': resultList[i]._source.title,
            'question': resultList[i]._source.question
        })
    }
    // Return data
    ctx.body = {
        'count': responseList.length,
        'request': ctx.request,
        'response': responseList
    }
}

/**
 * 后台使用的，用来获得所有问题列表的接口
 * 跟getResultList接口相比，不需要传入question参数，返回的字段增加了answerCount、answers、type
 */
exports.getResultListBg = async (ctx, next) => {
    const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_MAIN_SUFFIX + state.ELASTIC_SEARCH_SUFFIX
    const elasticReq = {
        'from': ctx.query.from !== DEFAULT_FROM ? ctx.query.from : DEFAULT_FROM,
        'size': ctx.query.size !== DEFAULT_SIZE ? ctx.query.size : DEFAULT_SIZE
    }
    const res = await axios.post(elasticUrl, elasticReq)
    const resultList = res.data.hits.hits
    let responseList = []
    for (let i = 0; i < resultList.length; i++) {
        responseList.push({
            'id': resultList[i]._id,
            'title': resultList[i]._source.title,
            'question': resultList[i]._source.question,
            'answerCount': resultList[i]._source.answers.length,
            'answers': resultList[i]._source.answers,
            'type': resultList[i]._source.type
        })
    }
    ctx.body = {
        'count': responseList.length,
        'request': ctx.request,
        'response': responseList
    }
}

/**
 * 后台使用，获取数据总量
 */
exports.getTotalDataCount = async (ctx, next) => {
    const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_MAIN_SUFFIX + state.ELASTIC_SEARCH_SUFFIX
    const res = await axios.post(elasticUrl)
    const totalCount = res.data.hits.total
    ctx.body = {
        'totalCount': totalCount
    }
}

exports.getResultById = async (ctx, next) => {
    const reqId = ctx.query.id
    const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_MAIN_SUFFIX + `/${reqId}?pretty=true`
    const res = await axios.get(elasticUrl)
    ctx.body = {
        'found': res.data.found,
        'source': res.data._source
    }
}
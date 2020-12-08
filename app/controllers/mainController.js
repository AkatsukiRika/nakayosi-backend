const moment = require('moment')
const os = require('os')
const state = require('../../state')
const axios = require('axios')

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
        }
    }
    const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_MAIN_SUFFIX + state.ELASTIC_SEARCH_SUFFIX
    const res = await axios.post(elasticUrl, elasticReq)
    const resultList = res.data.hits.hits
    let responseList = []
    for (let i = 0; i < resultList.length; i++) {
        responseList.push({
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
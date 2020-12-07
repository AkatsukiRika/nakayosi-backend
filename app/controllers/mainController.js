const moment = require('moment')
const os = require('os')
const state = require('../../state')
const jieba = require('nodejieba')

exports.getInfo = async (ctx, next) => {
    console.log('state', state)
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
    // A method responding to user's input
    const question = ctx.query.question
    // Separate Chinese words and print it for test purpose
    console.log('QUESTION #cut', jieba.cut(question))
    console.log('QUESTION #tag', jieba.tag(question))
    console.log('QUESTION #extract', jieba.extract(question, 100))
    // Data structure updated
    const resList = [{
        "title": "标题1",
        "question": "问题1",
        "answers": [
            "回答1-1",
            "回答1-2",
            "回答1-3",
            "回答1-4"
        ]
    }, {
        "title": "标题2",
        "question": "问题2",
        "answers": [
            "回答2-1",
            "回答2-2"
        ]
    }, {
        "title": "标题3",
        "question": "问题3",
        "answers": [
            "回答3-1",
            "回答3-2",
            "回答3-3"
        ]
    }]
    ctx.body = {
        'count': resList.length,
        'request': ctx.request,
        'response': resList
    }
}
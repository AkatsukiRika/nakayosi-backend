const moment = require('moment')
const os = require('os')
const state = require('../../state')

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
    const resList = [{
        'title': '想变成女生怎么办？',
        'user': 'pyxxxxxx',
        'content': '这个真的真的不是一种病，你也不是一个变态。 但依照你的描述 我觉得你有必要要认真的想一想你希望变成女生的原因。可能是因为从...'
    }, {
        'title': '想变成女孩子这件小事',
        'user': 'wow11111',
        'content': '我不是一个mtf，我只是想做女孩。 知乎上有道题，问想做女孩，和觉得自己是女孩有什么区别，我想，生理性别为男，大脑也为男...'
    }, {
        'title': '为什么我想成为女孩子？',
        'user': '一只冰宁宁',
        'content': '来诊断你是否对自己的性别识别有障碍，亦或者是纯粹爱好。 这是多方面，多原因导致的结果。 当然，女孩子确实很美好呀。 但是男孩子也...'
    }, {
        'title': '为什么想变成女生？',
        'user': '不言不语新号',
        'content': 'MTF，没有什么不好意思，不是说很普遍，但确实有这么一个群体。 像打篮球，像练习某种乐器，像S..M，这些都是爱好，只是有些能...'
    }, {
        'title': '我的儿子想变性当女孩子，我该怎么办？',
        'user': '一条',
        'content': '核桃是一个看上去很酷的女生。她的出生性别是男性，穿裙子的同时，她会大方地露出喉结，想笑的时候用男性化的嗓音开心地笑出来。 以下为核桃...'
    }, {
        'title': '想变成女孩子这件事',
        'user': '画地为牢',
        'content': '因为是男孩，所以就要打就要骂，这就是他们眼中设计好的养男孩子手段。。。。 如若时间倒退到我出生之前，我选择了以一名女孩子的身份来这...'
    }, {
        'title': '忽然想当个女生，不用买车买房，没有这么多压力，自给自足就行了。我该怎么办？',
        'user': '妄明',
        'content': '给彩礼，结婚养孩子。 如果女人不要求你有车有房，还愿意和你结婚。 你还想转换性别吗？... 或是已经有车有房，你还想变成女人吗？ 如果变成...'
    }, {
        'title': '变成女孩子是什么感觉？',
        'user': '琉璃華真',
        'content': '那是一种感受，自己变成那样，是另一种感受，两种感受往往不同。在我看来，变了之后有可能意外地很平静（虽然可能是高兴的）... 这里我...'
    }, {
        'title': '男人有没有幻想过自己变成女生？幻想成女生后想干什么？',
        'user': '问题描述',
        'content': '题主曾经也幻想过自己变成女生，学习化妆把自己打扮的很漂亮，买包，买漂亮衣服...想到这就没有继续想下去了，害怕自己变弯：P (这种...'
    }]
    ctx.body = {
        'count': resList.length,
        'request': ctx.request,
        'response': resList
    }
}
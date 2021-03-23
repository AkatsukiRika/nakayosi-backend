const state = require('../../state')
const axios = require('axios')
const nodeMailer = require('nodemailer')

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

exports.delProUser = async (ctx, next) => {
  const requestBody = ctx.request.body
  const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_USER_DEL_SUFFIX
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

/**
 * @method POST
 * @param {id} 用户唯一ID(string)
 * @param {password} 已在客户端使用MD5加密过的密码(string)
 */
exports.setProUserPassword = async (ctx, next) => {
  const requestBody = ctx.request.body
  const reqId = requestBody.id
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
    'status': resStatus,    // "updated"代表成功
    'version': resVersion
  }
}

exports.sendResultEmail = async (ctx, next) => {
  const requestBody = ctx.request.body
  const reqId = requestBody.id
  // 这里要传明文密码，而不是MD5结果
  const reqPassword = requestBody.password
  // 根据ID获取用户信息
  const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_USER_SUFFIX + state.ELASTIC_SEARCH_SUFFIX
  const elasticReq = {
    'query': {
      'ids': {
        'values': [reqId]
      }
    }
  }
  const elasticRes = await axios.post(elasticUrl, elasticReq)
  const resData = elasticRes.data
  const userObj = resData.hits.hits[0]._source
  if (!userObj) {
    ctx.body = {
      'status': 'fail',
      'message': 'no such user in database'
    }
  } else {
    const transporter = nodeMailer.createTransport(state.SMTP_ADDR)
    const options = {
      from: 'Nakayosi Dev <1345860061@qq.com>',
      to: userObj.email,
      subject: '您的心理专家号申请已通过！请打开邮件查看初始密码',
      text: `您的初始密码为：${reqPassword}，请务必不要告知他人`
    }
    try {
      const info = await transporter.sendMail(options)
      ctx.body = {
        'status': 'success',
        'message': info.response,
        'accepted': info.accepted,
        'rejected': info.rejected,
        'pending': info.pending
      }
    } catch (error) {
      ctx.body = {
        'status': 'fail',
        'message': error.message
      }
    }
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

exports.userLogin = async (ctx, next) => {
  const requestBody = ctx.request.body
  const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_USER_SUFFIX + state.ELASTIC_SEARCH_SUFFIX
  const elasticReq = {
    'query': {
      'bool': {
        'must': [
          {
            'term': {
              'email': requestBody.email
            }
          },
          {
            'term': {
              'password': requestBody.password
            }
          }
        ]
      }
    },
    'size': 1
  }
  if (requestBody.email && requestBody.password) {
    const res = await axios.post(elasticUrl, elasticReq)
    const resList = res.data.hits.hits
    if (resList.length === 0) {
      ctx.body = {
        'status': 'fail',
        'id': '',
        'realName': '',
        'errMsg': '邮箱地址或密码错误'
      }
    } else {
      // 设置Session，这里和管理员的区分，属性带上pro前缀
      ctx.session.proUserId = resList[0]._id
      ctx.session.proRealName = resList[0]._source.realName
      ctx.body = {
        'status': 'success',
        'id': resList[0]._id,
        'realName': resList[0]._source.realName,
        'errMsg': ''
      }
    }
  } else {
    ctx.body = {
      'status': 'fail',
      'id': '',
      'realName': '',
      'errMsg': '邮箱地址或密码为空'
    }
  }
}

exports.getUserLoginStatus = async (ctx, next) => {
  if (ctx.session.proUserId && ctx.session.proRealName) {
    ctx.body = {
      'loggedIn': true,
      'proUserId': ctx.session.proUserId,
      'proRealName': ctx.session.proRealName
    }
  } else {
    ctx.body = {
      'loggedIn': false
    }
  }
}

exports.proUserLogout = async (ctx, next) => {
  ctx.session.proUserId = null
  ctx.session.proRealName = null
  ctx.body = {
    'status': 'success'
  }
}
const state = require('../../state')
const axios = require('axios')

exports.addAdmin = async (ctx, next) => {
  const requestBody = ctx.request.body
  const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_ADMIN_SUFFIX
  const elasticReq = {
    'username': requestBody.username,
    'password': requestBody.password,
    'phoneNumber': requestBody.phoneNumber,
    'email': requestBody.email
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

exports.delAdmin = async (ctx, next) => {
  const requestBody = ctx.request.body
  const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_ADMIN_DEL_SUFFIX
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

exports.adminLogin = async (ctx, next) => {
  const requestBody = ctx.request.body
  const elasticUrl = state.ELASTIC_ADDR + state.ELASTIC_ADMIN_SUFFIX + state.ELASTIC_SEARCH_SUFFIX
  const elasticReq = {
    'query': {
      'bool': {
        'must': [
          {
            'term': {
              'username': requestBody.username
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
  if (requestBody.username && requestBody.password) {
    // 这里不要使用GET请求，POST和GET按理说都是一样的结果，但是GET可能一直会取到一模一样的数据，初步认为是Axios缓存机制的问题
    const res = await axios.post(elasticUrl, elasticReq)
    const resList = res.data.hits.hits
    if (resList.length === 0) {
      ctx.body = {
        'status': 'fail',
        'id': '',
        'errMsg': '用户名或密码错误'
      }
    } else {
      // 设置Session
      ctx.session.userId = resList[0]._id
      ctx.session.username = requestBody.username
      ctx.body = {
        'status': 'success',
        'id': resList[0]._id,
        'errMsg': '',
      }
    }
  } else {
    ctx.body = {
      'status': 'fail',
      'id': '',
      'errMsg': '用户名或密码为空'
    }
  }
}

exports.adminLogout = async (ctx, next) => {
  // 清除Session
  ctx.session.userId = null
  ctx.session.username = null
  ctx.body = {
    'status': 'success'
  }
}

exports.getUserLoginStatus = async (ctx, next) => {
  if (ctx.session.userId && ctx.session.username) {
    ctx.body = {
      'loggedIn': true,
      'userId': ctx.session.userId,
      'username': ctx.session.username
    }
  } else {
    ctx.body = {
      'loggedIn': false
    }
  }
}
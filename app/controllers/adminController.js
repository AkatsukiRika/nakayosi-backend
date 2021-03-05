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
  const elasitcUrl = state.ELASTIC_ADDR + state.ELASTIC_ADMIN_SUFFIX + state.ELASTIC_SEARCH_SUFFIX
  const elasticReq = {
    'query': {
      'bool': {
        'must': [
          {
            'match': {
              'username': requestBody.username
            }
          },
          {
            'match': {
              'password': requestBody.password
            }
          }
        ]
      }
    },
    'size': 1
  }
  if (!ctx.session.logged) {
    ctx.session.logged = false
    if (requestBody.username && requestBody.password) {
      const res = await axios.get(elasitcUrl, elasticReq)
      const resList = res.data.hits.hits
      if (resList.length === 0) {
        ctx.body = {
          'status': 'fail',
          'id': '',
          'errMsg': '用户名或密码错误'
        }
      } else {
        ctx.body = {
          'status': 'success',
          'id': resList[0]._id,
          'errMsg': ''
        }
      }
    } else {
      ctx.body = {
        'status': 'fail',
        'id': '',
        'errMsg': '用户名或密码为空'
      }
    }
  } else {
    ctx.body = {
      'status': 'fail',
      'id': '',
      'errMsg': '用户已登录'
    }
  }
}
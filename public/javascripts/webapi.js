$(document).ready(function () {
  // TreeView内的数据
  var treeData = [
    {
      text: '/api/main',
      id: 'main',
      nodes: [
        {
          text: '/getInfo',
          id: 'main-get-info'
        },
        {
          text: '/getResultList',
          id: 'main-get-result-list'
        },
        {
          text: '/getResultListBg',
          id: 'main-get-result-list-bg'
        },
        {
          text: '/getTotalDataCount',
          id: 'main-get-total-data-count'
        },
        {
          text: '/getResultById',
          id: 'main-get-result-by-id'
        }
      ]
    },
    {
      text: '/api/audio',
      id: 'audio',
      nodes: [
        {
          text: '/checkUpdate',
          id: 'audio-check-update'
        },
        {
          text: '/getServerAudioNameList',
          id: 'audio-get-name-list'
        },
        {
          text: '/getAudioStream/:fileName',
          id: 'audio-get-stream'
        }
      ]
    },
    {
      text: '/api/question',
      id: 'question',
      nodes: [
        {
          text: '/addQuestion',
          id: 'question-add'
        },
        {
          text: '/delQuestion',
          id: 'question-del'
        }
      ]
    },
    {
      text: '/api/user',
      id: 'user',
      nodes: [
        {
          text: '/addProUser',
          id: 'user-add-pro'
        },
        {
          text: '/setProUserPassword',
          id: 'user-set-pwd'
        },
        {
          text: '/getProUserListBg',
          id: 'user-get-list-bg'
        },
        {
          text: '/sendResultEmail',
          id: 'user-send-email'
        },
        {
          text: '/delProUser',
          id: 'user-del-pro'
        },
        {
          text: '/userLogin',
          id: 'pro-user-login'
        },
        {
          text: '/getUserLoginStatus',
          id: 'pro-user-get-status'
        },
        {
          text: '/proUserLogout',
          id: 'pro-user-logout'
        }
      ]
    },
    {
      text: '/api/admin',
      id: 'admin',
      nodes: [
        {
          text: '/addAdmin',
          id: 'admin-add'
        },
        {
          text: '/delAdmin',
          id: 'admin-del'
        },
        {
          text: '/adminLogin',
          id: 'admin-login'
        },
        {
          text: '/adminLogout',
          id: 'admin-logout'
        },
        {
          text: '/getUserLoginStatus',
          id: 'admin-get-login-status'
        },
        {
          text: '/getAdminListBg',
          id: 'admin-get-list-bg'
        }
      ]
    }
  ]

  // API描述
  var descMap = {
    'main-get-info':
      '地址：/api/main/getInfo<br />' +
      '方法：GET<br />' +
      '返回值：<br />' +
      'name (str): 程序名<br />' +
      'version (str): 版本号<br />' +
      'serverTime (str): 当前服务器时间<br />' +
      'osType (str): 服务器操作系统类型<br />' +
      'osPlatform (str): 服务器操作系统平台<br />' +
      'cpuArch (str): 服务器CPU架构<br />' +
      'totalMemoryMB (num): 服务器总内存量',
    'main-get-result-list':
      '地址：/api/main/getResultList<br />' +
      '方法：GET<br />' +
      '传入值：<br />' +
      'question (str): 问题内容<br />' +
      'from (num): 从第几条开始，默认值为0<br />' +
      'size (num): 返回几条数据，默认值为10<br />' +
      '返回值：<br />' +
      'count (num): 返回数据总量<br />' +
      'request (obj): 请求内容<br />' +
      'response (arr): 与传入的条件所匹配的项目列表<br />' +
      '--> id (str): 问题唯一ID<br />' +
      '--> title (str): 问题标题<br />' +
      '--> question (str): 问题内容<br />',
    'main-get-result-list-bg':
      '地址：/api/main/getResultListBg<br />' +
      '方法：GET<br />' +
      '传入值：<br />' +
      'question (str): 问题内容，不必须<br />' +
      'from (num): 从第几条开始，默认值为0<br />' +
      'size (num): 返回几条数据，默认值为10<br />' +
      '返回值：<br />' +
      'count (num): 查找成功的数据总量（与返回数据量无关）<br />' +
      'request (obj): 请求内容<br />' +
      'response (arr): 与传入的条件所匹配的项目列表<br />' +
      '--> id (str): 问题唯一ID<br />' +
      '--> title (str): 问题标题<br />' +
      '--> question (str): 问题内容<br />' +
      '--> answerCount (num): 该问题下的回答数<br />' +
      '--> answers (arr[str]): 该问题下的回答<br />' +
      '--> type (arr[str]): 该问题所属的类型<br />',
    'main-get-total-data-count':
      '地址：/api/main/getTotalDataCount<br />' +
      '方法：GET<br />' +
      '返回值：<br />' +
      'totalCount (num): 数据总量',
    'main-get-result-by-id':
      '地址：/api/main/getResultById<br />' +
      '方法：GET<br />' +
      '传入值：<br />' +
      'id (str): 问题的唯一ID<br />' +
      '返回值：<br />' +
      'found (bool): 是否找到了匹配项<br />' +
      'source (obj): 问题的详情<br />',
    'audio-check-update':
      '地址：/api/audio/checkUpdate<br />' +
      '方法：POST<br />' +
      '历史API，目前不使用',
    'audio-get-name-list':
      '地址：/api/audio/getServerAudioNameList<br />' +
      '方法：GET<br />' +
      '返回值：<br />' +
      'audioList (arr[str]): 服务器上的音频文件名列表',
    'audio-get-stream':
      '地址：/api/audio/getAudioStream/:fileName<br />' +
      '方法：GET<br />' +
      '传入值：<br />' +
      '将「:fileName」改为需要获取的音频文件名即可<br />' +
      '返回值：<br />' +
      '音频文件流，可以直接用于播放或下载',
    'question-add':
      '地址：/api/question/addQuestion<br />' +
      '方法：POST<br />' +
      '传入值：<br />' +
      'title (str): 问题标题<br />' +
      'question (str): 问题详细内容<br />' +
      '返回值：<br />' +
      'status (str): 创建状态（created为成功）<br />' +
      'id (str): 添加成功的问题唯一ID',
    'question-del':
      '地址：/api/question/delQuestion<br />' +
      '方法：POST<br />' +
      '传入值：<br />' +
      'id (str): 问题ID<br />' +
      '返回值：<br />' +
      'deleted (num): 被删除的问题数量<br />' +
      'failures (arr[obj]): 删除失败的问题数组',
    'user-add-pro':
      '地址：/api/user/addProUser<br />' +
      '方法：POST<br />' +
      '传入值：<br />' +
      'realName (str): 真实姓名<br />' +
      'idNumber (str): 身份证号<br />' +
      'phoneNumber (str): 手机号<br />' +
      'email (str): 电子邮箱<br />' +
      'richText (str): 申请详情（Quill使用的Json格式）<br />' +
      '返回值：<br />' +
      'status (str): 创建状态（created为成功）<br />' +
      'id (str): 添加成功的用户唯一ID',
    'user-set-pwd':
      '地址：/api/user/setProUserPassword<br />' +
      '方法：POST<br />' +
      '传入值：<br />' +
      'id (str): 用户唯一ID<br />' +
      'password (str): 已在客户端使用MD5加密过的密码<br />' +
      '返回值：<br />' +
      'status (str): 设置状态（updated代表成功）<br />' +
      'version (num): 当前是第几次更新密码',
    'user-get-list-bg':
      '地址：/api/user/getProUserListBg<br />' +
      '方法：GET<br />' +
      '传入值：<br />' +
      'from (num): 从第几条数据开始<br />' +
      'size (num): 共返回几条数据<br />' +
      'realName (str): 用户真实姓名，用于查询，不必须<br />' +
      '返回值：<br />' +
      'count (num): 匹配查询的总数据量（与返回数据量无关）<br />' +
      'response (arr): 与传入的条件所匹配的项目列表<br />' +
      '--> 包含属性：id / realName / idNumber / phoneNumber / email / richText / password',
    'user-send-email':
      '地址：/api/user/sendResultEmail<br />' +
      '方法：POST<br />' +
      '传入值：<br />' +
      'id (str): 用户唯一ID<br />' +
      'password (str): 明文密码（邮件内文使用）<br />' +
      '返回值：<br />' +
      'status (str): 只有两种值，success / fail<br />' +
      'message (str): 邮件发送过程中服务器返回的信息<br />' +
      '<-- 下面的返回值仅在status为success时出现 --><br />' +
      'accepted (arr): 成功发送的邮件列表<br />' +
      'rejected (arr): 发送失败的邮件列表<br />' +
      'pending (arr): 等待发送的邮件列表',
    'user-del-pro':
      '地址：/api/user/delProUser<br />' +
      '方法：POST<br />' +
      '传入值：<br />' +
      'id (str): 用户唯一ID<br />' +
      '返回值：<br />' +
      'deleted (num): 被删除的数量<br />' +
      'failures (num): 删除错误的数量',
    'admin-add':
      '地址：/api/admin/addAdmin<br />' +
      '方法：POST<br />' +
      '传入值：<br />' +
      'username (str): 用户名<br />' +
      'password (str): 密码（需在客户端进行MD5加密）<br />' +
      'phoneNumber (str): 手机号码<br />' +
      'email (str): 电子邮箱<br />' +
      '返回值：<br />' +
      'status (str): 创建状态（created为成功）<br />' +
      'id (str): 管理员唯一ID',
    'admin-del':
      '地址：/api/admin/delAdmin<br />' +
      '方法：POST<br />' +
      '传入值：<br />' +
      'id (str): 管理员唯一ID<br />' +
      '返回值：<br />' +
      'deleted (num): 被删除的管理员数量<br />' +
      'failures (num): 删除错误的数量',
    'admin-login':
      '地址：/api/admin/adminLogin<br />' +
      '方法：POST<br />' +
      '传入值：<br />' +
      'username (str): 用户名<br />' +
      'password (str): 已经过MD5加密的密码<br />' +
      '返回值：<br />' +
      'status (str): 登录状态，该值只会为success或fail' +
      'id (str): 登录完成的管理员唯一ID<br />' +
      'errMsg (str): 登录失败时返回的错误消息',
    'admin-logout':
      '地址：/api/admin/adminLogout<br />' +
      '方法：POST<br />' +
      '返回值：<br />' +
      'status (str): 登出状态，成功时为success',
    'admin-get-login-status':
      '地址：/api/admin/getUserLoginStatus<br />' +
      '方法：GET<br />' +
      '返回值：<br />' +
      'loggedIn (bool): 是否有已经登录的用户，仅在为true时才会返回下面的几个参数<br />' +
      'userId (str): 已登录的管理员唯一ID<br />' +
      'username (str): 已登录的管理员用户名',
    'admin-get-list-bg':
      '地址：/api/admin/getAdminListBg<br />' +
      '方法：GET<br />' +
      '传入值：<br />' +
      'from (num): 从第几条数据开始<br />' +
      'size (num): 共返回几条数据<br />' +
      'username (str): 管理员用户名，查找用，不必须<br />' +
      '返回值：<br />' +
      'count (num): 与传入值匹配的所有项目数量<br />' +
      'request (obj): 向API接口提交的请求内容<br />' +
      'response (arr): 返回的管理员列表<br />' +
      '--> 包含属性：id / username / password / phoneNumber / email',
    'pro-user-login':
      '地址：/api/user/userLogin<br />' +
      '方法：POST<br />' +
      '传入值：<br />' +
      'email (str): 专家号的邮箱<br />' +
      'password (str): 专家号的密码（需经过MD5加密）<br />' +
      '返回值：<br />' +
      'status (str): 登录状态，该值只会为success或fail<br />' +
      'id (str): 登录成功的用户ID<br />' +
      'realName (str): 登录成功的用户真实姓名<br />' +
      'errMsg (str): 错误提示，仅在status为fail时有值',
    'pro-user-get-status':
      '地址：/api/user/getUserLoginStatus<br />' +
      '方法：GET<br />' +
      '返回值：<br />' +
      'loggedIn (bool): 是否有已经登录的用户，仅在为true时才会返回下面的几个参数<br />' +
      'proUserId (str): 已登录的用户ID<br />' +
      'proRealName (str): 已登录的用户真实姓名',
    'pro-user-logout':
      '地址：/api/user/proUserLogout<br />' +
      '方法：POST<br />' +
      '返回值：<br />' +
      'status (bool): 登出状态，成功时为success'
  }

  // 设置导航栏高亮
  $('#nav-webapi').addClass('active')

  // 设置TreeView的显示
  $('.tree').bstreeview({ data: treeData })

  // Hover时显示API描述
  $('#main-get-info').click(function () {
    $('.api-desc').html(descMap['main-get-info'])
  })

  $('#main-get-result-list').click(function () {
    $('.api-desc').html(descMap['main-get-result-list'])
  })

  $('#main-get-result-list-bg').click(function () {
    $('.api-desc').html(descMap['main-get-result-list-bg'])
  })

  $('#main-get-total-data-count').click(function () {
    $('.api-desc').html(descMap['main-get-total-data-count'])
  })

  $('#main-get-result-by-id').click(function () {
    $('.api-desc').html(descMap['main-get-result-by-id'])
  })

  $('#audio-check-update').click(function () {
    $('.api-desc').html(descMap['audio-check-update'])
  })

  $('#audio-get-name-list').click(function () {
    $('.api-desc').html(descMap['audio-get-name-list'])
  })

  $('#audio-get-stream').click(function () {
    $('.api-desc').html(descMap['audio-get-stream'])
  })

  $('#question-add').click(function () {
    $('.api-desc').html(descMap['question-add'])
  })

  $('#question-del').click(function () {
    $('.api-desc').html(descMap['question-del'])
  })

  $('#user-add-pro').click(function () {
    $('.api-desc').html(descMap['user-add-pro'])
  })

  $('#user-set-pwd').click(function () {
    $('.api-desc').html(descMap['user-set-pwd'])
  })

  $('#user-get-list-bg').click(function () {
    $('.api-desc').html(descMap['user-get-list-bg'])
  })

  $('#user-send-email').click(function () {
    $('.api-desc').html(descMap['user-send-email'])
  })

  $('#user-del-pro').click(function () {
    $('.api-desc').html(descMap['user-del-pro'])
  })

  $('#pro-user-login').click(function () {
    $('.api-desc').html(descMap['pro-user-login'])
  })

  $('#pro-user-get-status').click(function () {
    $('.api-desc').html(descMap['pro-user-get-status'])
  })

  $('#pro-user-logout').click(function () {
    $('.api-desc').html(descMap['pro-user-logout'])
  })

  $('#admin-add').click(function () {
    $('.api-desc').html(descMap['admin-add'])
  })

  $('#admin-del').click(function () {
    $('.api-desc').html(descMap['admin-del'])
  })

  $('#admin-login').click(function () {
    $('.api-desc').html(descMap['admin-login'])
  })

  $('#admin-logout').click(function () {
    $('.api-desc').html(descMap['admin-logout'])
  })

  $('#admin-get-login-status').click(function () {
    $('.api-desc').html(descMap['admin-get-login-status'])
  })

  $('#admin-get-list-bg').click(function () {
    $('.api-desc').html(descMap['admin-get-list-bg'])
  })
})
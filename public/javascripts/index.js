$(document).ready(function() {
  // 请求后台接口，获得当前用户登录状态
  $.get(
    '/api/admin/getUserLoginStatus',
    function (data, status) {
      var realData = data.data
      console.log('getUserLoginStatus#res', realData)
      var loggedIn = realData.loggedIn
      if (loggedIn) {
        // 若用户已登录，则主页不显示登录提示
        $('.home-page-subtitle-login').css('display', 'none')
        $('.home-page-subtitle').css('display', 'block')
        // 在导航栏“用户信息”处显示已登录用户的用户名
        $('.drop-current-user').text('当前用户: ' + realData.username)
        // 导航栏“用户信息”处只显示登出按钮
        $('.drop-login').css('display', 'none')
        $('.drop-logout').css('display', 'block')
      } else {
        // 若用户未登录，则主页显示登录提示
        $('.home-page-subtitle-login').css('display', 'block')
        $('.home-page-subtitle').css('display', 'none')
        // 在导航栏“用户信息”处显示默认字样
        $('.drop-current-user').text('当前用户: 游客')
         // 导航栏“用户信息”处只显示登录按钮
        $('.drop-login').css('display', 'block')
        $('.drop-logout').css('display', 'none')
      }
    }
  )

  $('.drop-logout').click(function () {
    $.post(
      '/api/admin/adminLogout',
      {},
      function (data, status) {
        var realData = data.data
        console.log('adminLogout#res', realData)
        if (realData.status === 'success') {
          // 跳转到首页
          window.location.href = '/'
        }
      }
    )
  })
})
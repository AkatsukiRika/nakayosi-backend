$(document).ready(function() {
  $('.login-button').click(function () {
    var username = $('.username-input').val()
    var password = $('.password-input').val()
    var encryptedPwd = CryptoJS.MD5(password).toString()
    $.post(
      '/api/admin/adminLogin', 
      {
        'username': username,
        'password': encryptedPwd
      }, 
      function (data, status) {
        var realData = data.data
        console.log('adminLogin#res', realData)
        if (realData.status === 'success') {
          // 若成功登录，则返回主页
          window.location.href = '/'
        } else {
          // 若登录失败，弹出提示框
          alert('登录失败，请检查用户名和密码是否输入正确')
        }
      },
      'json'
    )
  })
})
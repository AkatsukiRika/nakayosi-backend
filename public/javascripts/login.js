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
        console.log('data: ' + data + '\nstatus: ' + status)
      },
      'json'
    )
  })
})
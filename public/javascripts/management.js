$(document).ready(function () {
  /* 方法定义 START */
  function getResultList(from, username, initPagination = true) {
    var params = {
      'from': from,
      'size': pageSize
    }
    if (username) {
      params.username = username
    }
    $.get(
      '/api/admin/getAdminListBg',
      params,
      function (data, status) {
        var realData = data.data
        console.log('getAdminListBg#res', realData)
        var responseList = realData.response
        // 添加到暂存数组
        curPageData = responseList
        // 更新界面数据
        updateData(curPageData)
        // 设置ID的点击事件
        $('.manage-td-id').off('click')
        $('.manage-td-id').click(function () {
          // 设置模态框内的内容
          var index = $(this).attr('id')
          var manageObj = curPageData[index]
          setModalContent(manageObj)
          // 弹出模态框
          $('#detail-modal').modal()
        })
        // 设置分页
        var dataCount = realData.count 
        var totalPages = Math.round(dataCount / pageSize)
        if (totalPages < 1) {
          totalPages = 1
        }
        // 设置分页器显示
        $('.page-count').text('当前 ' + currentPage + ' / ' + totalPages + ' 页')
        if (initPagination) {
          setPagination(totalPages, username)
        }
      }
    )
  }

  function updateData(dataList) {
    var trList = []
    for (let i = 0; i < dataList.length; i++) {
      var tempTr =
        '<tr>\n' +
        `\t<td class="manage-td-id" id="${i}">` + dataList[i].id + '</td>\n' +
        '\t<td class="manage-td-username">' + dataList[i].username + '</td>\n' +
        '\t<td class="manage-td-phone">' + dataList[i].phoneNumber + '</td>\n' +
        '\t<td class="manage-td-email">' + dataList[i].email + '</td>\n'
      trList.push(tempTr)
    }
    $('.manage-table-body').html(trList)
  }

  function setModalContent(manageObj) {
    // 设置模态框内容
    $('.manage-modal-id').text(manageObj.id)
    $('.manage-modal-username').text(manageObj.username)
    $('.manage-modal-pwd').text(manageObj.password)
    $('.manage-modal-phone').text(manageObj.phoneNumber)
    $('.manage-modal-email').text(manageObj.email)
    // 设置当前ID状态
    currentId = manageObj.id
  }

  function setPagination(totalPages, username) {
    // 设置PREV、NEXT两个换页按钮的事件
    $('.page-link-prev').click(function (e) {
      // 屏蔽跳转事件
      e.preventDefault()
      if (currentPage === 1) {
        alert('当前已是第一页')
      } else {
        currentPage--
        // 请求后台接口，更新数据
        var currentFrom = (currentPage - 1) * pageSize
        getResultList(currentFrom, username, false)
        // 设置分页器显示
        $('.page-count').text('当前 ' + currentPage + ' / ' + totalPages + ' 页')
      }
    })

    $('.page-link-next').click(function (e) {
      // 屏蔽跳转事件
      e.preventDefault()
      if (currentPage === totalPages) {
        alert('当前已是最后一页')
      } else {
        currentPage++
        var currentFrom = (currentPage - 1) * pageSize
        getResultList(currentFrom, username, false)
        $('.page-count').text('当前 ' + currentPage + ' / ' + totalPages + ' 页')
      }
    })
  }

  function clearPagination() {
    // 清除PREV、NEXT按钮已经被绑定上的点击事件
    $('.page-link-prev').off('click')
    $('.page-link-next').off('click')
  }

  function addAdmin(adminObj) {
    // 添加管理员
    $.post(
      '/api/admin/addAdmin',
      adminObj,
      function (data, status) {
        var realData = data.data
        console.log('addAdmin#res', realData)
        if (realData.status !== 'created') {
          alert('创建管理员失败')
        } else {
          alert('创建管理员成功')
        }
        // 手动关闭模态框
        $('#append-modal').modal('hide')
        // 重新拉取数据
        currentPage = 1
        clearPagination()
        getResultList(0)
      }
    )
  }

  function delAdmin(id) {
    // 删除管理员
    $.post(
      '/api/admin/delAdmin',
      {
        'id': id
      },
      function (data, status) {
        var realData = data.data
        console.log('delAdmin#res', realData)
        if (realData.deleted > 0) {
          alert('删除成功')
        } else {
          alert('删除失败，请重试')
        }
        // 手动关闭模态框
        $('#detail-modal').modal('hide')
        // 刷新数据
        currentPage = 1
        clearPagination()
        getResultList(0)
      }
    )
  }
  /* 方法定义 END */
  

  /* 全局变量 START */
  var pageSize = 25
  var curPageData = []
  var currentPage = 1
  var currentId = ''
  /* 全局变量 END */

  // 设置导航栏高亮
  $('#nav-manage').addClass('active')

  // 请求后台结果，获得所有条目
  getResultList(0)

  // 根据用户名搜索
  $('.search-btn').click(function (e) {
    e.preventDefault()
    var content = $('.manage-search-input').val()
    if (!content) {
      // 获得所有条目
      currentPage = 1
      clearPagination()
      getResultList(0)
    } else {
      // 更新界面数据并设置分页
      currentPage = 1
      clearPagination()
      getResultList(0, content, true)
    }
  })

  // 添加新管理员
  $('.add-btn').click(function (e) {
    e.preventDefault()
    $('#append-modal').modal()
  })

  // 设置表单提交验证
  $('.add-form').submit(function (e) {
    e.preventDefault()
    var f = $(this)
    if (f[0].checkValidity() === false) {
      e.stopPropagation()
    } else {
      var originalPwd = $('#password-input').val()
      var encryptedPwd = CryptoJS.MD5(originalPwd).toString()
      var adminObj = {
        'username': $('#username-input').val(),
        'password': encryptedPwd,
        'phoneNumber': $('#phone-input').val(),
        'email': $('#email-input').val()
      }
      addAdmin(adminObj)
    }
    f.addClass('was-validated')
  })

  // 设置删除按钮事件
  $('.btn-delete').click(function (e) {
    delAdmin(currentId)
  })
})
$(document).ready(function () {
  /* 方法定义 START */
  function getResultList(from, realName, initPagination = true) {
    var params = {
      'from': from,
      'size': pageSize
    }
    if (realName) {
      params.realName = realName
    }
    $.get(
      '/api/user/getProUserListBg',
      params,
      function (data, status) {
        var realData = data.data
        console.log('getProUserListBg#res', realData)
        var responseList = realData.response
        // 添加到暂存数组
        curPageData = responseList
        // 更新界面数据
        updateData(curPageData)
        // 设置ID的点击事件
        $('.application-td-id').off('click')
        $('.application-td-id').click(function () {
          // 设置模态框内的内容
          var index = $(this).attr('id')
          var applicationObj = curPageData[index]
          setModalContent(applicationObj)
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
          setPagination(totalPages, realName)
        }
      }
    )
  }

  function setPagination(totalPages, realName) {
    // 设置PREV、NEXT两个换页按钮的事件
    $('.page-link-prev').click(function (e) {
      // 屏蔽跳转事件
      e.preventDefault()
      if (currentPage === 1) {
        // 若当前已是第一页，则弹出提示信息
        alert('当前已是第一页')
      } else {
        currentPage--
        // 请求后台接口，更新数据
        var currentFrom = (currentPage - 1) * pageSize
        getResultList(currentFrom, realName, false)
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
        getResultList(currentFrom, realName, false)
        $('.page-count').text('当前 ' + currentPage + ' / ' + totalPages + ' 页')
      }
    })
  }

  function clearPagination() {
    // 清除PREV、NEXT按钮已经被绑定上的点击事件
    $('.page-link-prev').off('click')
    $('.page-link-next').off('click')
  }

  function updateData(dataList) {
    var trList = []
    for (let i = 0; i < dataList.length; i++) {
      var tempTr =
        '<tr>\n' +
        `\t<td class="application-td-id" id="${i}">` + dataList[i].id + '</td>\n' +
        '\t<td class="application-td-name">' + dataList[i].realName + '</td>\n' +
        '\t<td class="application-td-id-num">' + dataList[i].idNumber + '</td>\n' +
        '\t<td class="application-td-phone">' + dataList[i].phoneNumber + '</td>\n' +
        '\t<td class="application-td-email">' + dataList[i].email + '</td>\n'
      trList.push(tempTr)
    }
    $('.application-table-body').html(trList)
  }

  function clearParseJson(jsonStr) {
    // 清理JSON字符串并解析，返回解析后的结果(Object)
    jsonStr = jsonStr.replace(/\\n/g, "\\n")
                     .replace(/\\'/g, "\\'")
                     .replace(/\\"/g, '\\"')
                     .replace(/\\&/g, "\\&")
                     .replace(/\\r/g, "\\r")
                     .replace(/\\t/g, "\\t")
                     .replace(/\\b/g, "\\b")
                     .replace(/\\f/g, "\\f")
                     .replace(/[\u0000-\u0019]+/g, "")
    return JSON.parse(jsonStr)
  }

  function setModalContent(applicationObj) {
    // 设置模态框内容
    $('.application-modal-id').text(applicationObj.id)
    $('.application-modal-name').text(applicationObj.realName)
    $('.application-modal-id-num').text(applicationObj.idNumber)
    $('.application-modal-phone').text(applicationObj.phoneNumber)
    $('.application-modal-email').text(applicationObj.email)

    // 设置Quill文本框
    if (!quill) {
      quill = new Quill('.application-modal-text', {
        theme: 'bubble'
      })
    }
    var textArray = clearParseJson(applicationObj.richText)
    console.log('parsedRichText', textArray)
    quill.setContents(textArray)
    // 申请内容不允许改动
    quill.enable(false)

    if (!applicationObj.password) {
      $('.review-btn-accept').show()
      $('.review-btn-decline').show()
      // 设置审核按钮动作
      setReviewEvent(applicationObj.id)
    } else {
      $('.review-btn-accept').hide()
      $('.review-btn-decline').hide()
      $('.application-modal-pwd').text(applicationObj.password)
    }
  }

  function setReviewEvent(id) {
    // 设置「通过」和「拒绝」按钮的动作
    $('.review-btn-accept').off('click')
    $('.review-btn-decline').off('click')
    $('.review-btn-accept').click(function () {
      var initialPwd = prompt('请为该用户设置初始密码，按下确认按钮后将发送邮件给用户', 'admin')
      if (initialPwd != null && initialPwd != '') {
        // 提交密码的MD5值，发送邮件，然后关闭模态框
        $.post(
          '/api/user/setProUserPassword',
          {
            'id': id,
            'password': CryptoJS.MD5(initialPwd).toString()
          },
          function (data, status) {
            var realData = data.data
            if (realData.status === 'updated') {
              sendEmail(id, initialPwd)
            } else {
              alert('密码设置出错，请重试')
            }
          }
        )
      }
    })
    $('.review-btn-decline').click(function () {
      var confirmRes = confirm('拒绝申请会删除该用户的申请记录，是否继续？')
      if (confirmRes === true) {
        deleteUser(id)
      }
    })
  }

  function sendEmail(id, password) {
    $.post(
      '/api/user/sendResultEmail',
      {
        'id': id,
        'password': password
      },
      function (data, status) {
        var realData = data.data
        if (realData.accepted.length && realData.accepted.length > 0) {
          alert('邮件已自动发送，请进入邮箱确认发送状态')
        } else {
          alert('邮件发送失败，状态信息：' + realData.response)
        }
        // 手动关闭模态框
        $('#detail-modal').modal('hide')
      }
    )
  }

  function deleteUser(id) {
    $.post(
      '/api/user/delProUser',
      {
        'id': id
      },
      function (data, status) {
        var realData = data.data
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
  var quill
  var currentPage = 1
  /* 全局变量 END */

  // 设置导航栏高亮
  $('#nav-apply').addClass('active')

  // 请求后台结果，获得所有条目
  getResultList(0)

  // 根据人名搜索
  $('.search-btn').click(function (e) {
    e.preventDefault()
    var content = $('.application-search-input').val()
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
})
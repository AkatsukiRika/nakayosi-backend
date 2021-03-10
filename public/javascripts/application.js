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
        $('.application-td-id').click(function () {
          // 设置模态框内的内容
          var index = $(this).attr('id')
          var applicationObj = curPageData[index]
          setModalContent(applicationObj)
          // 弹出模态框
          $('#detail-modal').modal()
        })
      }
    )
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
    } else {
      $('.review-btn-accept').hide()
      $('.review-btn-decline').hide()
      $('.application-modal-pwd').text(applicationObj.password)
    }
  }

  function setReviewEvent() {
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
            'id': initialPwd
          },
          function (data, status) {
            var realData = data.data
            if (realData.status === 'updated') {
              // TODO: 调用后端API，发送邮件
            } else {
              alert('密码设置出错，请重试')
            }
          }
        )
      }
    })
  }
  /* 方法定义 END */

  /* 全局变量 START */
  var pageSize = 25
  var curPageData = []
  var quill
  /* 全局变量 END */

  // 请求后台结果，获得所有条目
  getResultList(0)
})
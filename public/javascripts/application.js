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

  function setModalContent(applicationObj) {
    // 设置模态框内容
    $('.application-modal-id').text(applicationObj.id)
    $('.application-modal-name').text(applicationObj.realName)
    $('.application-modal-id-num').text(applicationObj.idNumber)
    $('.application-modal-phone').text(applicationObj.phoneNumber)
    $('.application-modal-email').text(applicationObj.email)
  }
  /* 方法定义 END */

  /* 全局变量 START */
  var pageSize = 25
  var curPageData = []
  /* 全局变量 END */

  // 请求后台结果，获得所有条目
  getResultList(0)
})
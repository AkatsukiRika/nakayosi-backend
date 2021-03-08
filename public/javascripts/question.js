$(document).ready(function () {
  /* 方法定义 START */
  function getResultList(from) {
    // 请求后台结果，获得所有问题
    $.get(
      '/api/main/getResultListBg',
      {
        'from': from,
        'size': pageSize
      },
      function (data, status) {
        var realData = data.data
        console.log('getResultListBg#res', realData)
        var responseList = realData.response
        // 添加到暂存数组
        curPageData = responseList
        // 更新界面数据
        updateData(responseList)
        // 设置ID的点击事件
        $('.question-td-id').click(function () {
          // 设置模态框内的内容
          var index = $(this).attr('id')
          var questionObj = curPageData[index]
          setModalContent(questionObj)
          // 弹出模态框
          $('#detail-modal').modal()
        })
      }
    )
  }

  function updateData(questionList) {
    var responseTrList = []
    for (let i = 0; i < questionList.length; i++) {
      var responseTr = 
        '<tr>\n' +
        `\t<td class="question-td-id" id="${i}">` + questionList[i].id + '</td>\n' +
        `\t<td class="question-td-title">` + questionList[i].title + '</td>\n' +
        `\t<td class="question-td-content">` + questionList[i].question + '</td>\n' +
        `\t<td class="question-td-answer">` + '共' + questionList[i].answerCount + '条' + '</td>\n' +
        '\t<td>' + questionList[i].type + '</td>\n'
      responseTrList.push(responseTr)
    }
    $('.question-table-body').html(responseTrList)
  }

  function setModalContent(questionObj) {
    // 设置模态框内容
    $('.question-modal-id').text(questionObj.id)
    $('.question-modal-title').text(questionObj.title)
    $('.question-modal-content').text(questionObj.question)
    var answerList = questionObj.answers 
    $('.modal-answer').html('')
    for (let i = 0; i < answerList.length; i++) {
      var docString =
        '<p>\n' +
        `\t<span class="modal-bold">回答${i + 1}：</span>\n` +
        '\t<br />\n' +
        '\t<span>' + answerList[i] + '</span>\n'
      $('.modal-answer').append(docString)
    }
    $('.question-modal-type').text(questionObj.type)
  }

  function setPagination(totalPages) {
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
        getResultList(currentFrom)
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
        getResultList(currentFrom)
        $('.page-count').text('当前 ' + currentPage + ' / ' + totalPages + ' 页')
      }
    })
  }
  /* 方法定义 END */

  var pageSize = 25
  // 当前页码，从1开始计数
  var currentPage = 1
  // 当前页面的数据，暂存在这个数组里
  var curPageData = []

  // 请求后台结果，获得所有问题
  getResultList(currentPage - 1)

  // 获得问题总数
  $.get(
    '/api/main/getTotalDataCount',
    {},
    function (data, status) {
      var realData = data.data
      console.log('getTotalDataCount#res', realData)
      var totalCount = realData.totalCount
      // 计算总页数
      var totalPages = Math.round(totalCount / pageSize)
      console.log('totalPages', totalPages)
      // 写入分页器
      $('.page-count').text('当前 ' + currentPage + ' / ' + totalPages + ' 页')
      // 设置换页方法
      setPagination(totalPages)
    }
  )

  // 根据问题ID精确检索
  $('.link-precise-search').click(function (e) {
    e.preventDefault()
    var questionId = $('.question-search-input').val()
    if (!questionId) {
      alert('问题ID不可为空')
    } else {
      // 请求后端API
      $.get(
        `/api/main/getResultById?id=${questionId}`,
        {},
        function (data, status) {
          var realData = data.data
          console.log('getResultById#res', realData)
          if (realData.found) {
            var source = realData.source
            var questionObj = {
              'id': questionId,
              'title': source.title,
              'question': source.question,
              'answers': source.answers,
              'type': source.type
            }
            // 直接设置并弹出模态框
            setModalContent(questionObj)
            $('#detail-modal').modal()
          } else {
            alert('无效条目')
          }
        }
      )
    }
  })
})
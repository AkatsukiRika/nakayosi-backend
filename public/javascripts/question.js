$(document).ready(function () {
  var DEFAULT_SIZE = 25

  // 请求后台结果，获得所有问题
  $.get(
    '/api/main/getResultListBg',
    {
      'from': 0,
      'size': DEFAULT_SIZE
    },
    function (data, status) {
      var realData = data.data
      console.log('getResultListBg#res', realData)
      var responseList = realData.response
      for (let i = 0; i < responseList.length; i++) {
        var responseTr = 
          '<tr>\n' +
          '\t<td>' + responseList[i].id + '</td>\n' +
          '\t<td>' + responseList[i].title + '</td>\n' +
          '\t<td class="question-td-content">' + responseList[i].question + '</td>\n' +
          '\t<td>' + '共' + responseList[i].answerCount + '条' + '</td>\n' +
          '\t<td>' + responseList[i].type + '</td>\n'
        $('.question-table-body').append(responseTr)
      }
    }
  )
})
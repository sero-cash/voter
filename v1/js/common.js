var localStorage = window.localStorage;
var Common = {
  host: 'http://127.0.0.1:2345',

  seroRpcHost: '',

  app: {},

  LANGUAGE_CODE: 'zh_CN',

  baseDecimal: new BigNumber(10).pow(18),

  init: function () {
    var that = this;
    initAllProposal();
    setTimeout(function () {
      that.app.init();
      that.getLang();
      $('.language').bind('click', function () {
        var lang_code = $.cookie('language');

        if ('zh_CN' === lang_code) {
          $.cookie('language', 'en_US');
          $('.language').text('简体中文');
        } else {
          $.cookie('language', 'zh_CN');
          $('.language').text('English');
        }

        that.getLang();
      });
    }, 10)
  },

  getLang: function () {
    var _LANGUAGE_CODE = "en_US";
    var lang_code = $.cookie('language');
    if (!lang_code) {
      lang_code = _LANGUAGE_CODE;
    }
    if ('zh_CN' === lang_code) {
      $('.language').text('English');
    } else {
      $('.language').text('简体中文');
    }
    Common.app.loadProperties(lang_code);
  },

  post: function (_method, _biz, _page, callback) {
    var that = this;

    var result = new Object();
    var timestamp = 1234567;
    var sign = "67ff54447b89f06fe4408b89902e585167abad291ec41118167017925e24e320";
    var data = {
      base: {
        timestamp: timestamp,
        sign: sign,
      },
      biz: _biz,
      page: _page,
    }

    $.ajax({
      url: that.host + '/' + _method,
      type: 'post',
      dataType: 'json',
      async: false,
      data: JSON.stringify(data),
      beforeSend: function () {
      },
      success: function (res) {
        if (callback) {
          callback(res)
        }
      }
    })

    return result;
  }

};


function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}


function initAllProposal() {

  var allProposalIds = getAllProposalId();
  var map =  getProposalMapFromLocalStorage();
  for (var index = 0; index < allProposalIds.length; index++) {
    var proposalId = allProposalIds[index];
    var proposalIdString = proposalId.toString();
    var tmp = map[proposalIdString];
    if ( typeof tmp === "undefined") {
      var proposalDetail = getProposalDetailById(proposalId.toNumber());
      map[proposalIdString] = proposalDetail;
    }
  }
  setProposalMapFromLocalStorage(map);
}

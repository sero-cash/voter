let MyVote = {
  mainPKr:{},
  init: function () {
    var that = this;
    setTimeout(function () {
      that.getAccountList();
      that.genPageData();

      $('.address').bind("change", function () {
        that.genPageData();
      });

    }, 10)

  },

  loadProperties: function (lang) {
    jQuery.i18n.properties({
      name: 'lang', // 资源文件名称
      path: 'i18n/', // 资源文件所在目录路径
      mode: 'map', // 模式：变量或 Map
      language: lang, // 对应的语言
      cache: false,
      encoding: 'UTF-8',
      callback: function () {
        initHeader();
        // $('.card-body p:eq(1) label').text($.i18n.prop('pledge'));
        // $('.card-body p:eq(2) label').text($.i18n.prop('fee'));
        // $('.card-body p:eq(3) label').text($.i18n.prop('minParticipants'));
        // $('.card-body p:eq(4) label').text($.i18n.prop('startTime'));
        // $('.card-body p:eq(5) label').text($.i18n.prop('endTime'));
        // $('.card-body p:eq(6) label:eq(0)').text($.i18n.prop('support'));
        // $('.card-body p:eq(6) label:eq(1)').text($.i18n.prop('endTime'));
      }
    });

  },

  getAccountList: function () {

    let that = this;
    let pullup = new Pullup();
    pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
    let accountList = pullup.local.accountList();
    for (let i = 0; i < accountList.length; i++) {
      let data = accountList[i];
      that.mainPKr[data.PK] = data.MainPKr;
      globalMainPkr[data.PK] = data.MainPKr;
      let balance = new BigNumber(0).toFixed(6);
      let acName = "Account" + (i + 1);
      if (data.Name) {
        acName = data.Name;
      }
      if (data.Balance) {
        let existsSero = false;
        let balanceObj = data.Balance;
        for (let currency of Object.keys(balanceObj)) {
          if (currency === 'SERO') {
            existsSero = true;
            balance = new BigNumber(balanceObj[currency]).dividedBy(Common.baseDecimal).toFixed(6);
            $('.address').append(`<option value="${data.PK}" ${i === 0 ? 'selected' : ''}>${acName + ": " + data.PK.substring(0, 8) + ' ... ' + data.PK.substring(data.PK.length - 8)}  ${balance + ' ' + currency}</option>`);
          }
          if ( !existsSero ){
            $('.address').append(`<option value="${data.PK}" ${i === 0 ? 'selected' : ''}>${acName + ": " + data.PK.substring(0, 8) + ' ... ' + data.PK.substring(data.PK.length - 8)}  "0"${currency}</option>`);
          }
        }
        if ( !existsSero ){
          $('.address').append(`<option value="${data.PK}" ${i === 0 ? 'selected' : ''}>${acName + ": " + data.PK.substring(0, 8) + ' ... ' + data.PK.substring(data.PK.length - 8)} 0.000000SERO</option>`);
        }
      } else {
        $('.address').append(`<option value="${data.PK}" ${i === 0 ? 'selected' : ''}>${data.PK.substring(0, 8) + ' ... ' + data.PK.substring(data.PK.length - 8)}   ${'0.000 SERO'}</option>`);
      }
    }
  },

  extracted: function (proposalId) {
    var proposalDetail = getProposalDetailById(proposalId);
    renderCard(proposalDetail);
    return proposalDetail;
  },
  genPageData() {
    var that = this;
    var lang = $.cookie('language');

    if (!lang) {
      lang = "en_US";
      $.cookie('language', lang);
    }
    ;

    $(".dapp-data").empty();
    //先获取到所有到投票id
    let allProposalIdArray =  getOwnedVotedProposals(that.mainPKr[  $('.address').val() ]);
    for (let index = 0; index < allProposalIdArray.length; index++) {
      let proposalId = allProposalIdArray[index];
      // 获取到所有的某一个状态的id
      this.extracted(proposalId);
    }


    $('.backup').bind('click', function () {
      window.location.href = "createProposal.html"
    });
  }

};

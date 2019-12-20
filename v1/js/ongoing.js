let Ongoing = {

  init: function () {
    var that = this;
    setTimeout(function () {
      that.getAccountList();
      that.genPageData(1,pageSize);
      let total = getOngoingProposalIdLength();
      let totalPage = Math.ceil(new BigNumber(total / pageSize).toNumber() );
      delingPage(totalPage, 1);


      $('.address').bind("change", function () {
        genPageData(1,pageSize);
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
      }
    });

  },


  getAccountList: function () {

    let pullup = new Pullup();
    pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
    let accountList = pullup.local.accountList();
    for (let i = 0; i < accountList.length; i++) {
      let data = accountList[i];
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
    proposalDetail = getProposalDetailById(proposalId);
    renderCard(proposalDetail);
    return proposalDetail;
  },
  genPageData(pageNumber,pageSize) {
    var lang = $.cookie('language');

    if (!lang) {
      lang = "en_US";
      $.cookie('language', lang);
    }
    ;

    $(".dapp-data").empty();

    //先获取到所有到投票id
    var allValidateProposalArray = getAllOngoingProposalArray();
    var allProposal = getProposalMapFromLocalStorage();
    if ( allValidateProposalArray.length == 0 ){
      $(".dapp-data").html("<h4 style='text-align: center'>" + $.i18n.prop('nodata')  + "</h4>");
    }else {
      //sort
      allValidateProposalArray = allValidateProposalArray.sort(sortNumber);
      //根据分页找到id范围
      for (index = (pageNumber - 1) * pageSize; index < pageSize * pageNumber; index++) {
        if ( index >= allValidateProposalArray.length){
          break;
        }
        // 获取到所有的某一个状态的id
        this.extracted(allProposal[allValidateProposalArray[index]].id);
      }
    }
    $('.backup').bind('click', function () {
      window.location.href = "createProposal.html"
    });
  }

};



function extracted (proposalId) {
  var proposalDetail = getProposalDetailById(proposalId);
  renderCard(proposalDetail);
  return proposalDetail;
}
function genPageData(pageNo, pageSize) {
  var lang = $.cookie('language');
  if (!lang) {
    lang = "en_US";
    $.cookie('language', lang);
  }
  $(".dapp-data").empty();
  //先获取到所有到投票id
  var allValidateProposalArray = getAllOngoingProposalArray();
  var allProposal = getProposalMapFromLocalStorage();
  if ( allValidateProposalArray.length == 0 ){
    $(".dapp-data").html("<h4 style='text-align: center'>" + $.i18n.prop('nodata')  + "</h4>");
  }else {
    //sort
    allValidateProposalArray = allValidateProposalArray.sort(sortNumber);
    //根据分页找到id范围
    for (index = (pageNo - 1) * pageSize; index < pageSize * pageNo; index++) {
      // 获取到所有的某一个状态的id
      this.extracted(allProposal[allValidateProposalArray[index]].id);
    }
  }
  $('.backup').bind('click', function () {
    window.location.href = "createProposal.html"
  });
}

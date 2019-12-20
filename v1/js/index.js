let IndexPage = {

  init: function () {
    let that = this;
    setTimeout(function () {
      that.getAccountList();
      genPageData(1, pageSize);
      let total = getAllProposalLength();
      let totalPage = Math.ceil(new BigNumber(total / pageSize).toNumber());
      delingPage(totalPage, 1);

    }, 10)


    $('.address').bind("change", function () {
      genPageData(1,pageSize);
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
        $('#accountLabel').html($.i18n.prop('account'));
      }
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
  var allValidateProposalArray = getAllValidateProposalArray();
  var allProposal = getProposalMapFromLocalStorage();
  if ( allValidateProposalArray.length == 0 ){
    $(".dapp-data").html("<h4 style='text-align: center'>" + $.i18n.prop('nodata')  + "</h4>");
  }
  //sort
  allValidateProposalArray = allValidateProposalArray.sort(sortNumber);
  //根据分页找到id范围
  for (index = (pageNo-1) * pageSize ; index <=  pageSize * pageNo - 1; index ++ ){
    // 获取到所有的某一个状态的id
    if ( index >= allValidateProposalArray.length){
      break;
    }
    this.extracted(allProposal[allValidateProposalArray[index]].id);
  }
  $('.backup').bind('click', function () {
    window.location.href = "createProposal.html"
  });
}


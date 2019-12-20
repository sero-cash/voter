var globalMainPkr = {}
let ProposalDetail = {
  mainPKr: {},
  proposalDetail: {},
  init: function () {
    let that = this;
    setTimeout(function () {
      $('#successAlert').hide();


      let proposalId = GetQueryString("id");
      let proposalDetail = getProposalDetailById(proposalId);
      that.proposalDetail = proposalDetail;
      //设置提案信息
      $('#title').val(proposalDetail.title);
      $('#desc').val(proposalDetail.desc);
      $('#startTime').val(proposalDetail.startTimeDesc);
      $('#endTime').val(proposalDetail.endTimeDesc);
      $('#minHoldAmount').val(proposalDetail.minHoldAmount);
      $('#fee').val(proposalDetail.fee);
      $('#minParticipants').val(proposalDetail.minParticipants);
      $('#supportInput').val(proposalDetail.support);
      $('#opposeInput').val(proposalDetail.oppose);
      that.getAccountList();
      that.setVoteStatus();
      $('.address').bind("change", function () {
        $('#tip').html("");
        $('#successAlert').hide();
        that.setVoteStatus();
      });
      $('#support').bind("click", function () {
        let from =  $('.address').val();
        let id = GetQueryString("id");
        let seroAmount = proposalDetail.fee.plus(proposalDetail.minHoldAmount);
        $('#support').attr("disabled",true);
        $('#unsupport').attr("disabled",true);
        let tx = execute(globalMainPkr[from],from, contractAddress, contract, method_voteProposal, [numberToHexString(id), true], seroAmount);
        if ( typeof tx != 'undefined' && tx != ''){
          $('#successAlert').html($.i18n.prop('voteSuccess') + ":" + tx);
          $('#successAlert').show();
          $('#withdraw').attr("disabled",true);
          $('#unsupport').attr("disabled",true);
        }else{
          $('#withdraw').attr("disabled",false);
          $('#unsupport').attr("disabled",false);
        }
      });
      $('#unsupport').bind("click", function () {
        $('#withdraw').attr("disabled",true);
        $('#unsupport').attr("disabled",true);
        let from =  $('.address').val();
        let id = GetQueryString("id");
        let seroAmount = proposalDetail.fee.plus(proposalDetail.minHoldAmount);
        let tx = execute(globalMainPkr[from],from, contractAddress, contract, method_voteProposal, [numberToHexString(id), false], seroAmount);
        if ( typeof tx != 'undefined' && tx != ''){
          $('#successAlert').html($.i18n.prop('voteSuccess') + ":" + tx);
          $('#successAlert').show();
          $('#withdraw').attr("disabled",true);
          $('#unsupport').attr("disabled",true);
          $('#withdraw').attr("disabled",true);
        }else{
          $('#withdraw').attr("disabled",false);
          $('#withdraw').attr("disabled",false);
          $('#unsupport').attr("disabled",false);
        }
      });
      $('#withdraw').bind("click", function () {
        $('#withdraw').attr("disabled",true);
        let from =  $('.address').val();
        let id = GetQueryString("id");
        let seroAmount = new BigNumber(0);
        let tx = execute(globalMainPkr[from], $('.address').val(), contractAddress, contract, method_withDrawWithProposal, [numberToHexString(id)], seroAmount);
        if ( typeof tx != 'undefined' && tx != ''){
          $('#successAlert').html($.i18n.prop('withdrawSuccess') + ":" + tx);
          $('#successAlert').show();
          $('#withdraw').attr("disabled",true);
        }else{
          $('#withdraw').attr("disabled",false);
        }
        console.log(tx);
      });
    }, 2)

  },

  setVoteStatus: function () {
    let that = this;
    let address = that.mainPKr[$('.address').val()];
    let serojs = require("serojs");
    let contract = serojs.callContract(contractABI, contractAddress)
    let result = call(address, contractAddress, contract, method_myVotedProposalStatus, ["0x" + new BigNumber(GetQueryString("id")).toString(16)]);
    let status = result[0].toNumber();
    let amount = result[1].toNumber();
    let support = result[2];
    /**
     0 :  未参与
     1 ：已参与不可提现 
     2 ：已参与可提现
     3 :  已参与已提现
     */
    let tipHtml = "";
    if (support) {
      tipHtml = $.i18n.prop('voteForSupport');
    } else {
      tipHtml = $.i18n.prop('voteForOppse');
    }
    if (status === 1) {
      tipHtml =  tipHtml + "," + $.i18n.prop('canNotWithdraw');
    } else if (status === 2) {
      tipHtml = tipHtml + "," + $.i18n.prop('canWithdraw');
    } else if (status === 3) {
      tipHtml =  tipHtml + "," + $.i18n.prop('alreadyWithdraw');
    }
    let now = new Date();
    let nowTimeInMul = now.getTime();
    if (status === 0) {
      if (that.proposalDetail.startTimeInMil <= nowTimeInMul && that.proposalDetail.endTimeInMil >= nowTimeInMul) {
        $('#support').show();
        $('#unsupport').show();
      } else if (that.proposalDetail.startTimeInMil >= nowTimeInMul) {
        tipHtml = $.i18n.prop('notStart');
        $('#tip').html(tipHtml);
      } else if (that.proposalDetail.endTimeInMil <= nowTimeInMul) {
        tipHtml =  $.i18n.prop('notVote');
        $('#tip').html(tipHtml);
      }
    } else if (status === 1 || status === 2 || status === 3) {
      $('#tip').html(tipHtml);
      if ( status === 2){
        $('#withdraw').show();
        $('#withdraw').attr("disabled",false);
      }
    }
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
        $('h4').text($.i18n.prop('proposal_detail'));
        $('.text-dark mb-4').text($.i18n.prop('proposal_detail'));
        $('#accountLabel').html($.i18n.prop('account'));
        $('#titleLabel').html($.i18n.prop('title'));
        $('#titleTip').html($.i18n.prop('titleMax'));
        $('#descLabel').html($.i18n.prop('desc'));
        $('#descTip').html($.i18n.prop('descTip'));
        $('#startTimeLabel').html($.i18n.prop('startTime'));
        $('#endTimeLabel').html($.i18n.prop('endTime'));
        $('#pledegLabel').html($.i18n.prop('pledeg'));
        $('#feeLabel').html($.i18n.prop('fee'));
        $('#minparticipantslabel').html($.i18n.prop('minparticipants'));
        $('#homeHref').html($.i18n.prop('navbar_index'));
        $('#proposalDetailLi').html($.i18n.prop('proposal_detail'));
        $('title').html($.i18n.prop('proposal_detail'));
        $('#supportLabel').html($.i18n.prop('support'));
        $('#opposeLabel').html($.i18n.prop('oppose'));
        //
        // $('#support').attr($.i18n.prop('support'));
        // $('#oppose').html($.i18n.prop('oppose'));
        $('#withdraw').text($.i18n.prop('withdraw'));
        $('#support').text($.i18n.prop('support'));
        $('#unsupport').text($.i18n.prop('oppose'));
      }
    });
  },
};


function GetQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

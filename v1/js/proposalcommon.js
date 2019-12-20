const contractAddress = "cSiW6Gec3xdMo7HNrhkUQyHrjypg1rkEGHQRzhcJMjw6ZWLYckcCRG9pvHofYe4rihebUVHPA3j22kpmcATWR6o"; 
const pageSize = 8;

var globalMainPkr = {};


var pullup;
var contract;

var method_proposalDetais = "proposalDetais";
var method_createProposal = "createProposal";
var method_voteProposal = "voteProposal";
var method_getProposalFee = "getProposalFee";
var method_estimateProposalFee = "estimateProposalFee";
var method_getAllIds = "getAllIds";
var method_getProposalSize = "proposalsSize";
var method_getRuningIds = "getRuningIds";
var method_getRuningIdsLength = "getRuningIdsLength";
var method_ownedProposals = "ownedProposals";
var method_ownedVotedProposals = "ownedVotedProposals";
var method_myVotedProposalStatus = "myVotedProposalStatus";
var method_withDrawWithProposal = "withDrawWithProposal";


$(function () {
  serojs = require("serojs");
  pullup = new Pullup();
  pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
  contract = serojs.callContract(contractABI, contractAddress)
});


function initHeader() {
  $('.navbar-nav li:eq(0) a').text($.i18n.prop('dapp'));
  $('.navbar-nav li:eq(1) a').text($.i18n.prop('navbar_index'));
  $('.navbar-nav li:eq(2) a').text($.i18n.prop('navbar_ongoing'));
  $('.navbar-nav li:eq(3) a').text($.i18n.prop('navbar_my_create'));
  $('.navbar-nav li:eq(4) a').text($.i18n.prop('navbar_my_vote'));
  $('.backup').text($.i18n.prop('create_proposal'))

}


function formatDateTime2(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
};

function formatDateTime(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

function getMyVotedProposalStatus(pkr, id) {
  if (id <= 0) {
    return;
  }
  var serojs = require("serojs");
  var pullup = new Pullup();
  pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
  var contract = serojs.callContract(contractABI, contractAddress)
  return call(pkr, contractAddress, contract, method_myVotedProposalStatus, ["0x" + new BigNumber(id).toString(16)]);

}


function getProposalDetailByIdFromLocalStorage(proposalId) {
  if (id <= 0) {
    return;
  }

  if (typeof localStorage.proposalMap === "undefined") {
    localStorage.proposalMap = {};
  }
  if (typeof localStorage.proposalMap[proposalId] === "undefined") {
    var proposalDetail = getProposalDetailById(proposalId);
    localStorageproposalMap[index] = proposalDetail;
    return proposalDetail;
  } else {
    return localStorage.proposalMap[proposalId];
  }
}


function getProposalDetailById(id) {
  if (id <= 0) {
    return;
  }
  var serojs = require("serojs");
  var pullup = new Pullup();
  pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
  var from = pullup.local.accountList()[0].MainPKr;
  var contract = serojs.callContract(contractABI, contractAddress)
  var detail = call(from, contractAddress, contract, method_proposalDetais, ["0x" + new BigNumber(id).toString(16)]);
  var dividedByValue = new BigNumber(10).pow(18);
  var url = "proposalDetail.html?id=" + id;
  return {
    "id": id,
    "title": escapeHTML(detail[0]),
    "desc":  escapeHTML( detail[1]).replaceAll('\n','<br>'),
    "startTimeDesc": formatDateTime(((new BigNumber(detail[2]).multipliedBy(new BigNumber(1000))).toNumber())),
    "endTimeDesc": formatDateTime(((new BigNumber(detail[3]).multipliedBy(new BigNumber(1000))).toNumber())),
    "fee": detail[4].dividedBy(dividedByValue),
    "minHoldAmount": detail[5].dividedBy(dividedByValue),
    "minParticipants": detail[6],
    "status": detail[7],
    "support": detail[8],
    "oppose": detail[9],
    "startTime": detail[2],
    "endTime": detail[3],
    "startTimeInMil": (new BigNumber(detail[2]).multipliedBy(new BigNumber(1000))).toNumber(),
    "endTimeInMil": (new BigNumber(detail[3]).multipliedBy(new BigNumber(1000))).toNumber(),
    "url": url,
    "statusInt": detail[7].toNumber(),
    "startTimeWithoutSecond": formatDateTime2(((new BigNumber(detail[2]).multipliedBy(new BigNumber(1000))).toNumber())),
    "endTimeWithoutSecond": formatDateTime2(((new BigNumber(detail[3]).multipliedBy(new BigNumber(1000))).toNumber())),
  };

}


function getOngoingProposalIdLength() {
  proposalMap = getProposalMapFromLocalStorage();
  var length = 0;
  for (k in proposalMap) {
    var proposalDetail = proposalMap[k];
    if (proposalDetail.status != 5 && proposalDetail.endTimeInMil > new Date().getTime()) {
      length++;
    }
  }
  return length;
}

function getAllProposalLength() {
  proposalMap = getProposalMapFromLocalStorage();
  var length = 0;
  for (k in proposalMap) {
    var proposalDetail = proposalMap[k];
    if (proposalDetail.status != 5) {
      length++;
    }
  }
  return length;
}


function getAllProposalId() {
  var serojs = require("serojs");
  var pullup = new Pullup();
  pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
  var from = pullup.local.accountList()[0].MainPKr;
  var contract = serojs.callContract(contractABI, contractAddress);
  var start = 0;
  var limit = 1000000;
  return call(from, contractAddress, contract, method_getAllIds, ["0x" + new BigNumber(start).toString(16), "0x" + new BigNumber(limit).toString(16)]);
}


function getOngoingProposalId() {
  var serojs = require("serojs");
  var pullup = new Pullup();
  pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
  var from = pullup.local.accountList()[0].MainPKr;
  var contract = serojs.callContract(contractABI, contractAddress)
  var start = (pageNumber - 1) * pageSize;
  var limit = pageSize;
  return call(from, contractAddress, contract, method_getRuningIds, ["0x" + new BigNumber(start).toString(16), "0x" + new BigNumber(limit).toString(16)]);
}


function getMyProposalId(pkr) {
  var serojs = require("serojs");
  var pullup = new Pullup();
  pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
  var contract = serojs.callContract(contractABI, contractAddress)
  return call(pkr, contractAddress, contract, method_ownedProposals, []);
}

function getOwnedVotedProposals(pkr) {
  var serojs = require("serojs");
  var pullup = new Pullup();
  pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
  var contract = serojs.callContract(contractABI, contractAddress)
  return call(pkr, contractAddress, contract, method_ownedVotedProposals, []);
}


function timestampToStr(timestamp) {

}


function call(pkr, contractAddress, contract, method, args) {
  var pullup = new Pullup();
  pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
  var packData = contract.packData(method, args);
  var callParams = {
    from: pkr,
    to: contractAddress,
    data: packData
  };
  var callData = pullup.sero.call(callParams, "latest");
  if (callData !== "0x") {
    return contract.unPackData(method, callData);
  }
  return "";
}

function execute(mainPkr, pk, contractAddress, contract, method, args, seroAmount) {

  var pullup = new Pullup();
  pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
  var value = new BigNumber(10).pow(18);//SERO
  var packData = contract.packData(method, args);
  var executeData = {
    "from": pk,
    to: contractAddress,
    value: "0x" + (new BigNumber(value).multipliedBy(seroAmount)).toString(16),
    data: packData,
    gas_price: "0x" + new BigNumber("1000000000").toString(16),
  };

  //-- "0x " + (new BigNumber(value).multipliedBy(new BigNumber(100))).toString(16),//SERO

  var estimateParam = {
    "from": mainPkr,
    to: contractAddress,
    data: packData,
    value: "0x" + (new BigNumber(value).multipliedBy(seroAmount)).toString(16)
  }

  var estimateGas;
  try {
    estimateGas = pullup.sero.estimateGas(estimateParam);
  } catch (e) {
    alert(e);
    return;
  }
  executeData["gas"] = estimateGas;

  try {
    return pullup.local.executeContract(executeData);
  } catch (e) {
    alert(e.message)
    return
  }
}


function numberToHexString(number) {
  return "0x" + new BigNumber(number).toString(16);
}


function delingPage(total, page) {
  var that = this;
  if (total == 0) {
    total = 1;
  }
  $('.totalPage').html(total);
  totalPage = total;
  if (total <= 1) {
    $('.page-item1').addClass('cantClick');
    $('.page-item2').addClass('cantClick');
    $('.page-item3').addClass('cantClick');
    $('.page-item4').addClass('cantClick');
  } else {
    if (page === 1) {
      $('.page-item1').addClass('cantClick');
      $('.page-item2').addClass('cantClick');
    }
    $('.page-item3').unbind().on('click', function () {
      if (page < totalPage) {
        $('.page-item2').removeClass('cantClick');
        $('.page-item1').removeClass('cantClick');
        page++;
        $('.inputPage').val(page);
        genPageData(page, pageSize);
        if (page == totalPage) {
          $('.page-item3').addClass('cantClick');
          $('.page-item4').addClass('cantClick');
        }
      }
    })
    $('.page-item2').unbind().on('click', function () {
      if (page > 1) {
        $('.page-item3').removeClass('cantClick');
        $('.page-item4').removeClass('cantClick');
        page--;
        $('.inputPage').val(page);
        genPageData(page, pageSize);
        if (page == 1) {
          $('.page-item1').addClass('cantClick');
          $('.page-item2').addClass('cantClick');
        }
      }
    })
    $('.page-item1').unbind().on('click', function () {
      page = 1;
      $('.inputPage').val(page);
      $('.page-item1').addClass('cantClick');
      $('.page-item3').removeClass('cantClick');
      $('.page-item4').removeClass('cantClick');
      genPageData(page, pageSize);
    })
    $('.page-item4').unbind().on('click', function () {
      page = totalPage;
      $('.inputPage').val(page);
      $('.page-item4').addClass('cantClick');
      $('.page-item2').removeClass('cantClick');
      $('.page-item1').removeClass('cantClick');
      genPageData(page, pageSize);
    })
  }
}


function renderCard(proposalDetail) {
  if (typeof proposalDetail === "undefined") {
    return;
  }

  var cardClass;

  var badgeClass = "badge-primary"
  var badgeText = "";
  /**
   *  1 ：   未开始
   2 ：  进行中
   3 :    已结束 未成功
   4： 已结束
   5:  已删除
   */
  var rightTip = "";
  var rightTipBackground = "";
  var backgroundColor = "";
  var borderColor = "#e3e6f0";


  let address = globalMainPkr[$('.address').val()];
  let result = call(address, contractAddress, contract, method_myVotedProposalStatus, ["0x" + new BigNumber(proposalDetail.id).toString(16)]);
  proposalDetail.status = result[0].toNumber();
  proposalDetail.support = result[1].toNumber();
  proposalDetail.oppose = result[2].toNumber();

  let myStatus = result[3].toNumber();
  let myResult = result[5];


  var supportColor = "black";
  var opposeColor = "black";
  var withdrawColor = "black";


  var supportPoint = "";
  /**
   0 :  未参与
   1 ：已参与不可提现 
   2 ：已参与可提现
   3 :  已参与已提现
   */

  var timeDesc = "";
  if (proposalDetail.status === 1) {

    rightTip = $.i18n.prop('warmup');
    rightTipBackground = "#";
    supportColor = "#9D9D9D";
    opposeColor = "#9D9D9D";
    withdrawColor = "#9D9D9D";
    timeDesc = proposalDetail.startTimeWithoutSecond  + " " +  $.i18n.prop("start");
  } else if (proposalDetail.status == 2) {
    withdrawColor = "#9D9D9D";
    rightTip = $.i18n.prop('navbar_ongoing');
    rightTipBackground = "#dc3545";
    timeDesc = proposalDetail.endTimeWithoutSecond + " " +  $.i18n.prop("end");
    if (myStatus == 0) {
      supportPoint = "cursor: pointer";
    } else {
      if (myResult) {
        supportColor = "#F73809";
        opposeColor = "#9D9D9D";
      } else {
        supportColor = "#9D9D9D";
        opposeColor = "#F73809";
      }
    }
  } else if (proposalDetail.status == 3) {
    rightTip = $.i18n.prop('failed');
    rightTipBackground = "#6c757d";
    backgroundColor = "gray";
    borderColor = "#6c757d";
    supportColor = "#9D9D9D";
    opposeColor = "#9D9D9D";

    supportDisplayClass = "none";
    if (myStatus === 2) {
      withdrawDisplayClass = "inline";
    } else {
      withdrawColor = "#9D9D9D";
      withdrawDisplayClass = "none";
    }
    supportDisplayClass = "none";
    if (myStatus > 0) {
      if (myResult) {
        supportColor = "#F73809";
      } else {
        opposeColor = "#F73809";
      }
    }
    timeDesc = proposalDetail.endTimeDesc + " " +  $.i18n.prop("end");
  } else if (proposalDetail.status == 4) {
    rightTip = $.i18n.prop('success');
    supportColor = "#9D9D9D";
    opposeColor = "#9D9D9D";
    rightTipBackground = "#007bff";
    supportDisplayClass = "none";
    opposeColor = "#9D9D9D"
    if (myStatus === 2) {
      withdrawDisplayClass = "inline";
    } else {
      withdrawColor = "#9D9D9D";
      withdrawDisplayClass = "none";
    }
    if (myStatus > 0) {
      if (myResult) {
        supportColor = "#F73809";
      } else {
        opposeColor = "#F73809";
      }
    }
    timeDesc = proposalDetail.endTimeDesc + " " +  $.i18n.prop("end");
  } else if (proposalDetail.status == 5) {
    var map = getProposalMapFromLocalStorage();
    delete map[proposalDetail.id];
    setProposalMapFromLocalStorage(map);
    supportDisplayClass = "none";
    return;
  }

  $('.dapp-data').append(`
  <div class="col-md-3 col-lg-3" style="padding: 5px;">
                        <div class="clean-pricing-item" style="padding:10px;background: ` + backgroundColor + `">
                            <div class="ribbon" promosal-id="${proposalDetail.id}" style="background:` + rightTipBackground + `"><span>` + rightTip + `</span></div>
                            <div class="heading titleNoWrap" promosal-id="${proposalDetail.id}"  style="width:75%"> 
                                <h6><b>${proposalDetail.title}</b></h6>  
                            </div>
                            <div class="features descNoWrap" promosal-id="${proposalDetail.id}" style="letter-spacing: 3px">${proposalDetail.desc}</div>
                                <div style="border-top:1px solid ` + borderColor + `;padding-top: 5px"> ${$.i18n.prop('minparticipants')}&nbsp;&nbsp;:&nbsp;&nbsp;<b>${proposalDetail.minParticipants}</b> <br></div>
                                <div class="row">
                                   <div class="col-5">
                                    ${$.i18n.prop('pledge')}&nbsp;: <b>&nbsp;${proposalDetail.minHoldAmount}</b>&nbsp;SERO<br>
                                    ${$.i18n.prop('fee')}&nbsp;:<b>&nbsp;${proposalDetail.fee}</b>&nbsp;SERO
                                   </div>
                                    <div  class="col-7"  style="text-align: right;color: #6c757d"> <br/> ` + timeDesc + ` 
                                    </div>
                                </div>
                                     <div class="row" style="border-top:1px solid ` + borderColor + `;margin-top: 5px">
                                        <div class="col-12" style="padding-top: 12px;">
                                       <a promosal-id="${proposalDetail.id}" class="uphref"  style="` + supportPoint + `"> <i class="fas  fa-thumbs-up fa-1x" style="color:` + supportColor + "  ;" + supportPoint + `; "></i>&nbsp;${$.i18n.prop('support')}&nbsp;${proposalDetail.support}&nbsp;&nbsp;</a>
                                       <a promosal-id="${proposalDetail.id}" class="downhref"  style="` + supportPoint + `"> <i  promosal-id="${proposalDetail.id}"  class="fas fa-thumbs-down fa-1x" style="color:` + opposeColor + "  ;" + supportPoint + `"></i>&nbsp;${$.i18n.prop('oppose')}&nbsp;${proposalDetail.oppose}</a>
                                     &nbsp; <a promosal-id="${proposalDetail.id}" class="withdrawhref${proposalDetail.id}"  style="cursor: pointer"> <i title="withdraw" class="fa fa-sign-out-alt" style="color:` + withdrawColor + "  ;" + `"></i>${$.i18n.prop('withdraw')}</a>
                                    </div>
                            </div>
                           
                    </div>

  `);

  if (myStatus === 2) {
    $('.withdrawhref' + proposalDetail.id).show();
  }else{
    $('.withdrawhref' + + proposalDetail.id).hide();
  }

  $(".descNoWrap").unbind("click").bind("click", function () {
    var promososalId = $(this).attr("promosal-id");
    fillModalData(promososalId);
    $('#modalDetail').modal({});
  });

  $(".titleNoWrap").unbind("click").bind("click", function () {
    var promososalId = $(this).attr("promosal-id");
    fillModalData(promososalId);
    $('#modalDetail').modal({});

  });


  $(".ribbon").unbind("click").bind("click", function () {
    var promososalId = $(this).attr("promosal-id");
    fillModalData(promososalId);
    $('#modalDetail').modal({});
  });


  if (proposalDetail.status === 2 && myStatus === 0) {
    $(".downhref").unbind("click").bind("click", function () {
      var promososalId = $(this).attr("promosal-id");
      var proposalDetail = getProposalDetailById(promososalId);
      vote(proposalDetail, false)
    });

    $(".uphref").unbind("click").bind("click", function () {
      var promososalId = $(this).attr("promosal-id");
      var proposalDetail = getProposalDetailById(promososalId);
      vote(proposalDetail, true)
    });
  }

  $(".withdrawhref" + proposalDetail.id).unbind("click").bind("click", function () {
    var promososalId = $(this).attr("promosal-id");
    var proposalDetail = getProposalDetailById(promososalId);
    var id = proposalDetail.id;
    let from = $('.address').val();
    let seroAmount = new BigNumber(0).toString(16);
    let tx = execute(globalMainPkr[from], $('.address').val(), contractAddress, contract, method_withDrawWithProposal, [numberToHexString(id)], seroAmount);
    if (typeof tx != 'undefined' && tx != '') {
      alert($.i18n.prop('withdrawSuccess') + ":" + tx);
    } else {
    }
    console.log(tx);
  });


}

function fillModalData(promososalId) {


  var proposalDetail = getProposalDetailById(promososalId);


  $('#titleH6').html(proposalDetail.title);
  $('#descDiv').html(proposalDetail.desc);

  $('#timeLabel').html($.i18n.prop('time'));
  $('#timeValueLabel').html(proposalDetail.startTimeDesc + " " + $.i18n.prop("timeTo") + " " + proposalDetail.endTimeDesc);

  $('#feeLabel').html($.i18n.prop('fee'));

  console.log ( proposalDetail.fee);
  $('#feeValueLabel').html(proposalDetail.fee.toNumber() + " SERO");


  $('#minHoldLabel').html($.i18n.prop('pledeg'));
  $('#minHoldValueLabel').html(proposalDetail.minHoldAmount.toNumber() + " SERO");


  $('#minParLabel').html($.i18n.prop('minParticipants'));
  $('#minParValueLabel').html(proposalDetail.minParticipants.toNumber());

  let address = globalMainPkr[$('.address').val()];
  let result = call(address, contractAddress, contract, method_myVotedProposalStatus, ["0x" + new BigNumber(proposalDetail.id).toString(16)]);
  proposalDetail.status = result[0].toNumber();
  proposalDetail.support = result[1].toNumber();
  proposalDetail.oppose = result[2].toNumber();

}

function sortNumber(a, b) {
  return b - a;
}

function vote(proposalDetail, result) {
  let from = $('.address').val();
  var id = proposalDetail.id;
  let seroAmount = proposalDetail.fee.plus(proposalDetail.minHoldAmount);
  let tx = execute(globalMainPkr[from], from, contractAddress, contract, method_voteProposal, [numberToHexString(id), result], seroAmount);
  if (typeof tx != 'undefined' && tx != '') {
    alert($.i18n.prop('voteSuccess') + ":" + tx);
  } else {
  }
}
function  escapeHTML(a){
  a = "" + a;
  return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");;
}

String.prototype.getBytes = function() {
       var cArr = this.match(/[^\x00-\xff]/ig);
       return this.length + (cArr == null ? 0 : cArr.length);
}



String.prototype.replaceAll  = function(s1,s2){
  return this.replace(new RegExp(s1,"gm"),s2);
}

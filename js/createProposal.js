
var globalPkBalance = {}
var CreateProposal = {

  poolId: '',
  mainPKr: {},

  init: function () {

    var that = this;
    $.extend(true, $.fn.datetimepicker.defaults, {
      icons: {
        time: 'far fa-clock',
        date: 'far fa-calendar',
        up: 'fas fa-arrow-up',
        down: 'fas fa-arrow-down',
        previous: 'fas fa-chevron-left',
        next: 'fas fa-chevron-right',
        today: 'fas fa-calendar-check',
        clear: 'far fa-trash-alt',
        close: 'far fa-times-circle'
      }
    });
    $('#startTime').datetimepicker({ minDate:new Date()});
    $('#endTime').datetimepicker({ minDate:new Date()});
    that.getAccountList();


    $('.address').bind("change", function () {
      var pkr = globalMainPkr[$('.address').val()];
      var totalFeeBigNumber = call(pkr, contractAddress, contract, method_estimateProposalFee, [$('#desc').val()]);
      var balance = globalPkBalance[$('.address').val()];
      if ( balance <    totalFeeBigNumber.dividedBy(new BigNumber(10).pow(18)).toNumber()  ){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('notEnoughSero') );
        $('#verifyModalTitle').html($.i18n.prop('tip'))
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        $('#submitButton').attr("disabled",true);
        return ;
      }else{
        $('#submitButton').attr("disabled",false);
        $('#errorAlert').hide();
      }
    });



    $("#desc").blur(function(){
      var pkr = globalMainPkr[$('.address').val()];
      var baseFeeBigNumber = call(pkr, contractAddress, contract, method_getProposalFee, []);
      var totalFeeBigNumber = call(pkr, contractAddress, contract, method_estimateProposalFee, [$('#desc').val()]);
      var descFee = (totalFeeBigNumber.minus(baseFeeBigNumber));
      if ( descFee.toNumber() > 0 ){
        $('#descFeeTip').html($.i18n.prop('descFeeTip') +" " +  (descFee.dividedBy(new BigNumber(10).pow(18))).toNumber() + " SERO" );
        $('#detailLabel').html(  "("  + baseFeeBigNumber.dividedBy(new BigNumber(10).pow(18)).toNumber()  + "[" + $.i18n.prop('baseFee') + "] + " + descFee.dividedBy(new BigNumber(10).pow(18)).toNumber() + "[" + $.i18n.prop('descriptionFee') +"])");
      }else{
        $('#detailLabel').html("");
        $('#descFeeTip').html("");
      }
      $('#totalFee').html(  totalFeeBigNumber.dividedBy(new BigNumber(10).pow(18)).toNumber()  );
    });


    $('#submitButton').bind('click', function () {
      $('#errorAlert').hide();
      var title = $('#title').val();
      if ( title === "") {

        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('title') + " " + $.i18n.prop('notEmpty') );
        $('#verifyModalTitle').html($.i18n.prop('tip'))
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return;
      }
      if ( title.getBytes() > 192) {

        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('titleMax'));
        $('#verifyModalTitle').html($.i18n.prop('tip'))
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return;
      }



      var startTimeStr = $('#startTime').val();
      var endTimeStr = $('#endTime').val();
      if (  startTimeStr === ""){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('startTime') + " " + $.i18n.prop('notEmpty'));
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }
      if (  endTimeStr === ""){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop("endTime") + " " + $.i18n.prop('notEmpty'));
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }

      var startTimeInMillSecond = new Date(startTimeStr).getTime();
      var endTimeInMillSecond = new Date(endTimeStr).getTime();

      if ( endTimeInMillSecond <= startTimeInMillSecond){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop("endTimeLessThanStartTime") );
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }

      if ( endTimeInMillSecond <= new Date().getTime() ){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop("endTimeLessThanNow") );
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }


      if ( startTimeInMillSecond <= new Date().getTime() ){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop("startTimeLessThanNow") );
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }


      var pledeg =  $('#minHoldAmount').val();
      if ( !isNumber(pledeg)){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html($.i18n.prop('pledge') + " " + $.i18n.prop('notInteger') );
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }

      var fee =  $('#fee').val();
      if ( !isNumber(fee)){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html($.i18n.prop('fee') + " " + $.i18n.prop('notInteger') );
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }

      var minParticipants =  $('#minParticipants').val();
      if ( !isInteger(minParticipants)){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html($.i18n.prop('minParticipants') + " " + $.i18n.prop('notInteger') );
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }


      var desc = $('#desc').val().trim();

      if ( desc === "") {
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('desc') + " " + $.i18n.prop('notEmpty'));
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return;
      }


      var balance = globalPkBalance[$('.address').val()];
      var pkr = globalMainPkr[$('.address').val()];
      var totalFeeBigNumber = call(pkr, contractAddress, contract, method_estimateProposalFee, [$('#desc').val()]);
      if ( balance <    totalFeeBigNumber.dividedBy(new BigNumber(10).pow(18)).toNumber()  ){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('desc') + " " + $.i18n.prop('notEnoughSero'));
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }

      var desc = $('#desc').val().trim();

      if ( desc === "") {
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('desc') + " " + $.i18n.prop('notEmpty'));
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return;
      }


      if ( desc.getBytes() > 1024) {
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('descMax'));
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return;
      }
      var startTime = new BigNumber(startTimeInMillSecond).dividedBy(new BigNumber(1000)).toNumber();
      var endTime =  new BigNumber(endTimeInMillSecond).dividedBy(new BigNumber(1000)).toNumber();
      var pkr = globalMainPkr[$('.address').val()];
      var totalFeeBigNumber = call(pkr, contractAddress, contract, method_estimateProposalFee, [$('#desc').val()]);

      var base = new BigNumber(10).pow(18);//SERO
      totalFeeBigNumber = totalFeeBigNumber.dividedBy(base);
      var fee = (new BigNumber($('#fee').val()).multipliedBy(base)).toString(16);
      var minHoldAmount = (new BigNumber($('#minHoldAmount').val()).multipliedBy(base)).toString(16);
      $('#submitModalTitle').html($.i18n.prop('confirm') );
      $('#submit-modal-body').html($.i18n.prop("confirmCost") +  " " + totalFeeBigNumber + "  SERO " + $.i18n.prop("confirmCreate")  +  "?" );
      $('#submitModalCloseButton').text( $.i18n.prop('close') );
      $('#submitModalConfirmButton').text( $.i18n.prop('confirm') );
      $('#submitModal').modal({});

    });



    $('#submitModalConfirmButton').bind('click', function () {
      var title = $('#title').val();
      if ( title === "") {

        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('title') + " " + $.i18n.prop('notEmpty') );
        $('#verifyModalTitle').html($.i18n.prop('tip'))
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return;
      }
      if ( title.getBytes() > 192) {

        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('titleMax'));
        $('#verifyModalTitle').html($.i18n.prop('tip'))
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return;
      }



      var startTimeStr = $('#startTime').val();
      var endTimeStr = $('#endTime').val();
      if (  startTimeStr === ""){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('startTime') + " " + $.i18n.prop('notEmpty'));
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }
      if (  endTimeStr === ""){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop("endTime") + " " + $.i18n.prop('notEmpty'));
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }

      var startTimeInMillSecond = new Date(startTimeStr).getTime();
      var endTimeInMillSecond = new Date(endTimeStr).getTime();

      if ( endTimeInMillSecond <= startTimeInMillSecond){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop("endTimeLessThanStartTime") );
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }

      if ( endTimeInMillSecond <= new Date().getTime() ){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop("endTimeLessThanNow") );
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }


      if ( startTimeInMillSecond <= new Date().getTime() ){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop("startTimeLessThanNow") );
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }


      var pledeg =  $('#minHoldAmount').val();
      if ( !isNumber(pledeg)){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html($.i18n.prop('pledge') + " " + $.i18n.prop('notInteger') );
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }

      var fee =  $('#fee').val();
      if ( !isNumber(fee)){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html($.i18n.prop('fee') + " " + $.i18n.prop('notInteger') );
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }

      var minParticipants =  $('#minParticipants').val();
      if ( !isInteger(minParticipants)){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html($.i18n.prop('minParticipants') + " " + $.i18n.prop('notInteger') );
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }


      var desc = $('#desc').val().trim();

      if ( desc === "") {
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('desc') + " " + $.i18n.prop('notEmpty'));
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return;
      }


      var balance = globalPkBalance[$('.address').val()];
      var pkr = globalMainPkr[$('.address').val()];
      var totalFeeBigNumber = call(pkr, contractAddress, contract, method_estimateProposalFee, [$('#desc').val()]);
      if ( balance <    totalFeeBigNumber.dividedBy(new BigNumber(10).pow(18)).toNumber()  ){
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('desc') + " " + $.i18n.prop('notEnoughSero'));
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return ;
      }

      var desc = $('#desc').val().trim();

      if ( desc === "") {
        $('#verifyModal').modal({});
        $('#verify-modal-body').html( $.i18n.prop('desc') + " " + $.i18n.prop('notEmpty'));
        $('#verifyModalTitle').html($.i18n.prop('tip'));
        $('#verifyModalCloseButton').text( $.i18n.prop('close') );
        return;
      }
      var startTime = new BigNumber(startTimeInMillSecond).dividedBy(new BigNumber(1000)).toNumber();
      var endTime =  new BigNumber(endTimeInMillSecond).dividedBy(new BigNumber(1000)).toNumber();
      var pkr = globalMainPkr[$('.address').val()];
      var totalFeeBigNumber = call(pkr, contractAddress, contract, method_estimateProposalFee, [$('#desc').val()]);

      var base = new BigNumber(10).pow(18);//SERO
      totalFeeBigNumber = totalFeeBigNumber.dividedBy(base);
      var fee = (new BigNumber($('#fee').val()).multipliedBy(base)).toString(16);
      var minHoldAmount = (new BigNumber($('#minHoldAmount').val()).multipliedBy(base)).toString(16);
      var pk = $('.address').val();
      var paramArray = [$('#title').val(), $('#desc').val(), "0x" + new BigNumber(startTime).toString(16), "0x" + new BigNumber(endTime).toString(16), "0x" + fee, "0x" + minHoldAmount, "0x" + new BigNumber($('#minParticipants').val()).toString(16)];
      $('#submitModalConfirmButton').attr("disabled",true);
      var tx = execute(pkr,pk, contractAddress, contract, method_createProposal, paramArray,totalFeeBigNumber);
      $('#verifyModalTitle').html($.i18n.prop('tip'));


      if ( typeof tx !='undefined' && tx != '') {
        $('#submit-modal-body').html($.i18n.prop('createSuccess'));
          alert($.i18n.prop('createSuccess'));
          window.location.href = "myproposal.html";
      }else{
        $('#submitButton').attr("disabled",false);
        $('#submitModalConfirmButton').attr("disabled",false);
      }
    });
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
        $('#titleLabel').html($.i18n.prop('title'));
        $('#titleTip').html($.i18n.prop('titleMax'));
        $('#descLabel').html($.i18n.prop('desc'));
        $('#descTip').html($.i18n.prop('descTip'));
        $('#startTimeLabel').html($.i18n.prop('time'));
        $('#pledegLabel').html($.i18n.prop('pledeg'));
        $('#pledegTip').html($.i18n.prop('pledegTip'));
        $('#feeLabel').html($.i18n.prop('fee'));
        $('#feeTip').html($.i18n.prop('feeTip'));
        $('#homeHref').html($.i18n.prop('navbar_index'));
        $('#createProposalLi').html($.i18n.prop('createProposal'));
        $('#createProposalH4').html($.i18n.prop('createProposal'));
        $('#minparticipantslabel').html($.i18n.prop('minparticipants'));
        $('#minparticipantstip').html($.i18n.prop('minparticipantstip'));
        $('#submitButton').html($.i18n.prop('create_proposal'));
        $('title').html($.i18n.prop('create_proposal'));
        $('#totalFeeLabel').html($.i18n.prop('totalFee'));


        var pkr = globalMainPkr[$('.address').val()];

        var baseFeeBigNumber = call(pkr, contractAddress, contract, method_getProposalFee, []);
        $('#totalFee').html(  baseFeeBigNumber.dividedBy(new BigNumber(10).pow(18)).toNumber()  );
        var balance = globalPkBalance[$('.address').val()];
        if ( balance <    baseFeeBigNumber.dividedBy(new BigNumber(10).pow(18)).toNumber()  ){
          $('#verifyModal').modal({});
          $('#verify-modal-body').html( $.i18n.prop('notEnoughSero') );
          $('#verifyModalTitle').html($.i18n.prop('tip'))
          $('#verifyModalCloseButton').text( $.i18n.prop('close') );
          $('#submitButton').attr("disabled",true);

        }
      }
    });
  },
  getAccountList: function () {

    var that = this;
    var pullup = new Pullup();
    pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));
    var accountList = pullup.local.accountList();
    for (var i = 0; i < accountList.length; i++) {
      var data = accountList[i];
      that.mainPKr[data.PK] = data.MainPKr;
      globalMainPkr[data.PK] = data.MainPKr;

      var balance = new BigNumber(0).toFixed(6);
      var acName = "Account" + (i + 1);
      if (data.Name) {
        acName = data.Name;
      }
      if (data.Balance) {
        var balanceObj = data.Balance;
        for (var currency of Object.keys(balanceObj)) {
          if (currency === 'SERO') {
            balance = new BigNumber(balanceObj[currency]).dividedBy(Common.baseDecimal).toFixed(6);
            $('.address').append(`<option value="${data.PK}" ${i === 0 ? 'selected' : ''}>${acName + ": " + data.PK.substring(0, 8) + ' ... ' + data.PK.substring(data.PK.length - 8)}  ${balance + ' ' + currency}</option>`);
            globalPkBalance[data.PK] =  balance;
          }
        }
      } else {
        globalPkBalance[data.PK] = 0;
          $('.address').append(`<option value="${data.PK}" ${i === 0 ? 'selected' : ''}>${data.PK.substring(0, 8) + ' ... ' + data.PK.substring(data.PK.length - 8)}   ${'0.000 SERO'}</option>`);
      }
    }
  }

};





function isNumber(obj) {
  var bigNumber = new BigNumber(obj);
  return   bigNumber.toNumber() > 0;
}

function isInteger(obj) {
  var bigNumber = new BigNumber(obj);
  return   ( Math.round(bigNumber.toNumber()) === bigNumber.toNumber() ) && bigNumber.toNumber() > 0;
}


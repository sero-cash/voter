var localStorage = window.localStorage;


function  getProposalMapFromLocalStorage(){
  if (  typeof localStorage["proposalMap"] ===  "undefined"){
    localStorage['proposalMap']  = "";
    return {};
  }
  return  JSON.parse(localStorage['proposalMap']);
}



function  setProposalMapFromLocalStorage(map){
  if (  typeof localStorage["proposalMap"] ===  "undefined"){
    localStorage['proposalMap']  = "";
  }
  return  localStorage['proposalMap'] =  JSON.stringify(map);
}



function  getAllValidateProposalArray(){
  if (  typeof localStorage["proposalMap"] ===  "undefined"){
    localStorage['proposalMap']  = "";
    return [];
  }
   var proposalMap  =  JSON.parse(localStorage['proposalMap']);

  var result = [];
  var index = 0;
  for ( k in proposalMap){
    if ( proposalMap[k].status != 5 ) {
      result[index] = proposalMap[k].id;
      index ++ ;
    }
  }
  return result;
}




function  getAllOngoingProposalArray(){
  if (  typeof localStorage["proposalMap"] ===  "undefined"){
    localStorage['proposalMap']  = "";
    return [];
  }
  var proposalMap  =  JSON.parse(localStorage['proposalMap']);

  var result = [];
  var index = 0;
  for ( k in proposalMap){
    if ( proposalMap[k].status != 5 && proposalMap[k].endTimeInMil > new Date().getTime() ) {
      result[index] = proposalMap[k].id;
      index ++ ;
    }

  }
  return result;
}

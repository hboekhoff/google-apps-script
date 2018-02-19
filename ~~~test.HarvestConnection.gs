function test_harvestOpen() {
  var h = new HarvestConnection_v1('test_harvest');
  h.open('test_harvestOpenCallback','test_harvestAbortCallback',{a:123});
}
function test_harvestExec() {
  var h = new HarvestConnection_v2('test_harvest');
  //var r = h.execute('api/2/search',{jql:'issuekey=fdsupport-1001'});
  //LogData('result',r);
  var r = h.whoAmI();
  LogData(r);
  r = h.fetchTimeEntries(r.id,'2017-08-21');
  LogData(r);
  
}

function  test_harvestOpenCallback(name,data) {
  LogData({name:name,data:data});
}
function  test_harvestAbortCallback(name,messageCode,messageText,data) {
  LogData({name:name,code:messageCode,message:messageText,data:data});
  
}

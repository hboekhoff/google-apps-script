function formatDate(d,f) {
  return Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), f);
}
function formatSecondsToHHmm(s) {
  s /= 60;
  var h = Math.floor(s / 60);
  var m = Math.floor(s % 60);
  return h + ':' + ('0'+m).slice(-2);
}

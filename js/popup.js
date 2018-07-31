var toggle = document.getElementById('toggle--text');
var bg = chrome.extension.getBackgroundPage();
bg.getStatus(function(data) {
  var status = data.requestHeadersHasCache || false;
  toggle.checked = status;
});

toggle.onchange = function(e) {
  var val = toggle.checked;
  bg.changeStatus(val);
}

var localStatus = false;
function changeStatus(status) {
  chrome.storage.local.set({
    requestHeadersHasCache: status
  }, function() {
    console.log('设置成功，状态为' + status);
    setCache();
  });
}

function getStatus(callback) {
  chrome.storage.local.get({
    requestHeadersHasCache: false
  }, function(item) {
    callback(item);
    setCache();
  });
}
function getLocalStatus(callback) {
  chrome.storage.local.get({
    requestHeadersHasCache: false
  }, function(item) {
    callback(item)
  })
}


function setCache() {
  chrome.webRequest.onBeforeRequest.addListener(function(details) {
    getLocalStatus(function(item) {
      localStatus = item.requestHeadersHasCache;
    })
  }, {urls: ["<all_urls>"]})
  chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    var headers = details.requestHeaders,
      hasCache = false,
      blockingResponse = {};
    if (localStatus) {
      for (var i = 0, l = headers.length; i < l; ++i) {
        if (headers[i].name == 'cache-control') {
          headers[i].value = 'no-cache';
          hasCache = true;
        }
      }
      if (!hasCache) {
        headers.push({name: 'cache-control', value: 'no-cache'});
        // headers.push({name: 'If-Modified-Since', value: new Date().toString()});
      }
      blockingResponse.requestHeaders = headers;
    }
    console.log(blockingResponse)
    return blockingResponse;
  }, {
    urls: ["<all_urls>"]
  }, ['requestHeaders', 'blocking']);
}

setCache();

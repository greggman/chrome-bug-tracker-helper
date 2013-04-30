function updateVersionInfo(callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200)
        callback(JSON.parse(xhr.responseText));
    }
  }
  xhr.open('GET', 'http://omahaproxy.appspot.com/all.json', true);
  xhr.send();
}

chrome.extension.onMessage.addListener(function(request, sender, callback) {
  var now = (new Date).getTime();
  if (!localStorage.lastUpdate ||
      Number(localStorage.lastUpdate) + 24 * 60 * 60 * 1000 < now) {
    updateVersionInfo(function(data) {
      localStorage.lastUpdate = now;
      localStorage.omaha = JSON.stringify(data);
      callback(data);
    });
  } else {
    callback(JSON.parse(localStorage.omaha));
  }
  return true;
});


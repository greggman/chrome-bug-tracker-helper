var kVersionInfo = {};
chrome.extension.sendMessage('', function(data) {
  kVersionInfo = data;
  markupLinks();
});

function versionCompare(a, b) {
  var a_split = a.replace(',', '.').split('.');
  var b_split = b.replace(',', '.').split('.');
  for (var i = 0; i < a_split.length; ++i) {
    var a = parseInt(a_split[i]), b = parseInt(b_split[i]);
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    }
  }
  return 0;
}

function differenceAsString(channel, version, current, previous) {
  var cmp = versionCompare(version, current);
  if (cmp > 0) {
    return 'newer than ' + channel;
  } else if (cmp == 0) {
    return 'current ' + channel;
  } else {
    cmp = versionCompare(version, previous);
    if (cmp > 0) {
      return 'newer than previous ' + channel;
    } else if (cmp == 0) {
      return 'previous ' + channel + ' release';
    }
  }
  return null;
}

function markupLinks() {
  var pres = document.getElementsByTagName('pre');
  var kVersionRE = /((\d{2,2}\.\d{1,3}\.\d{1,4}\.\d{1,4})( \(.*?\))?)/g;
  for (var i = 0, len = pres.length; i < len; ++i) {
    pres[i].innerHTML = pres[i].innerHTML.replace(kVersionRE,
        '<span class="chrome-version" version="$2">$1</span>');
  }
  var versions = document.getElementsByClassName('chrome-version');
  for (var i = 0, len = versions.length; i < len; ++i) {
    var span = versions[i];
    var version = span.getAttribute('version');

    var title = '';
    for (var j = 0; j < kVersionInfo.length; ++j) {
      var entry = kVersionInfo[j];
      if (title.length > 0)
        title += '\n';
      title += entry.os + ': ';
      var diff;
      for (var k = 0; k < entry.versions.length; ++k) {
        var channel = entry.versions[k];
        if (channel.version == '0.0.0.0')
          continue;
        diff = differenceAsString(channel.channel, version,
                                  channel.version, channel.prev_version);
        if (diff) {
          title += diff;
          break;
        }
      }
      if (!diff)
        title += 'older than all known versions';
    }
    span.title = title;
  }
}

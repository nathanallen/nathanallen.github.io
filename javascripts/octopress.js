function testFeatures() {
  var features = ['maskImage'];
  $(features).map(function(i, feature) {
    if (Modernizr.testAllProps(feature)) {
      $('html').addClass(feature);
    } else {
      $('html').addClass('no-'+feature);
    }
  });
  if ("placeholder" in document.createElement("input")) {
    $('html').addClass('placeholder');
  } else {
    $('html').addClass('no-placeholder');
  }
}

function addCodeLineNumbers() {
  if (navigator.appName === 'Microsoft Internet Explorer') { return; }
  $('div.gist-highlight').each(function(code) {
    var tableStart = '<table><tbody><tr><td class="gutter">',
        lineNumbers = '<pre class="line-numbers">',
        tableMiddle = '</pre></td><td class="code">',
        tableEnd = '</td></tr></tbody></table>',
        count = $('.line', code).length;
    for (var i=1;i<=count; i++) {
      lineNumbers += '<span class="line-number">'+i+'</span>\n';
    }
    var table = tableStart + lineNumbers + tableMiddle + '<pre>'+$('pre', code).html()+'</pre>' + tableEnd;
    $(code).html(table);
  });
}

function daysSinceStarting() {
  if ($('#startdate').length){
    var $date = $('#startdate')
    var startdate = 1383202800000 // Oct 31, 2013
    var days = Math.ceil((Date.now() - startdate)/1000/60/60/24)
    $date.text(days + " days ago")
  }
}

function blinkingCursor(elem){
  var elem = elem || document.querySelector('#blinking-cursor')
  setInterval(function(){
    elem.style.visibility = 'hidden'
    setTimeout(function(){
      elem.style.visibility = ''
    }, 600)
  }, 1200)
}

$('document').ready(function() {
  daysSinceStarting()
  blinkingCursor()
  testFeatures();
  addCodeLineNumbers();
});

// iOS scaling bug fix
// Rewritten version
// By @mathias, @cheeaun and @jdalton
// Source url: https://gist.github.com/901295
(function(doc) {
  var addEvent = 'addEventListener',
      type = 'gesturestart',
      qsa = 'querySelectorAll',
      scales = [1, 1],
      meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];
  function fix() {
    meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
    doc.removeEventListener(type, fix, true);
  }
  if ((meta = meta[meta.length - 1]) && addEvent in doc) {
    fix();
    scales = [0.25, 1.6];
    doc[addEvent](type, fix, true);
  }
}(document));
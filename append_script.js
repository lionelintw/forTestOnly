function init() {
  // quit if this function has already been called
  if (arguments.callee.done) return;

  // flag this function so we don't do the same thing twice
  arguments.callee.done = true;

  // kill the timer
  if (_timer) clearInterval(_timer);

  // do stuff
  append_script();
}

/* for Mozilla/Opera/IE */
if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", init, false);
}
else if(document.attachEvent){
document.attachEvent("onDOMContentLoaded", init);
}	
else{;
/* for old Internet Explorer */
/*@cc_on 
if (@_jscript_version < 6){
  document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
  var script = document.getElementById("__ie_onload");
  script.onreadystatechange = function() {
    if (this.readyState == "loaded" || this.readyState == "complete") {
      init(); // call the onload handler
    }
  };
}  
@*/
}

/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
  var _timer = setInterval(function() {
    if (/loaded|complete/.test(document.readyState)) {
      init(); // call the onload handler
    }
  }, 10);
}

/* for other browsers */
window.onload = init;

//*
function append_script(){
// Create the element
var script = document.createElement("script");
//script.type = "text/javascript";
//script.src = "http://somedomain.com/somescript";

// Add script content
script.text = "alert('pure javascript inline is also ok, just more lines')";

// Append
document.body.appendChild(script);
}
//*/

//*
$(document).ready(function(){
$("body").append("<script type=\"text/javascript\">alert('jquery is simple, but no way for inline use');</script>");
});
//*/
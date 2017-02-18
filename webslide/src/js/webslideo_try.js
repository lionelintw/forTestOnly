
;!function(doc,win){
(function () {
  'use strict';
  var _slice = Array.prototype.slice;

  try {
    // Can't be used with DOM elements in IE < 9
    _slice.call(document.documentElement);
  } catch (e) { // Fails in IE < 9
    // This will work for genuine arrays, array-like objects, 
    // NamedNodeMap (attributes, entities, notations),
    // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
    // and will not fail on other DOM objects (as do DOM elements in IE < 9)
    Array.prototype.slice = function(begin, end) {
      // IE < 9 gets unhappy with an undefined end argument
      end = (typeof end !== 'undefined') ? end : this.length;

      // For native Array objects, we use the native slice function
      if (Object.prototype.toString.call(this) === '[object Array]'){
        return _slice.call(this, begin, end); 
      }

      // For array like object we handle it ourselves.
      var i, cloned = [],
        size, len = this.length;

      // Handle negative value for "begin"
      var start = begin || 0;
      start = (start >= 0) ? start: len + start;

      // Handle negative value for "end"
      var upTo = (end) ? end : len;
      if (end < 0) {
        upTo = len + end;
      }

      // Actual expected size of the slice
      size = upTo - start;

      if (size > 0) {
        cloned = new Array(size);
        if (this.charAt) {
          for (i = 0; i < size; i++) {
            cloned[i] = this.charAt(start + i);
          }
        } else {
          for (i = 0; i < size; i++) {
            cloned[i] = this[start + i];
          }
        }
      }

      return cloned;
    };
  }
}());

// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}
/*
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
*/

/* 
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}
}

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

	
	/**
	 * 工具函數定義區
	 * @param {Object} el
	 * @param {Object} props
	 */
	 var byId = function ( id ) {
	 	if(typeof id !== 'string' || id === ''){
			return false;
		}
        return doc.getElementById(id);
    },
	$ = function ( selector, context ) {
        context = context || doc;
        return context.querySelector(selector);
    },
	$$ = function ( selector, context ) {
        context = context || doc;
        return toArray( context.querySelectorAll(selector) );
    }, 
	toArray = function(nodelist){
		return [].slice.call(nodelist);
	},getElementFromUrl = function(){
		return byId(win.location.hash.replace(/^#\/?/, ""));
	},
	parseParam = function(oSource, oParams, isown){
		var key, obj = {};
		oParams = oParams || {};
		for (key in oSource) {
			obj[key] = oSource[key];
			if (oParams[key] != null) {
				if (isown) {// 僅複製自己
					if (oSource.hasOwnProperty[key]) {
						obj[key] = oParams[key];
					}
				}
				else {
					obj[key] = oParams[key];
				}
			}
		}
		return obj;
	};
	
	var $slide, 
		steps = [],
		len = 0,
		doHash = true,
		progress,
		curNode,
		prevNode,
		nextNode;
	var lines = [],
		oldLines = lines,
		dobuild = false,
		curLine,
		prevLine,
		nextLine;
	var canvas;
	
	var presentClass,
		pastClass,
		futureClass;
	
	//更新slide主函數
	function update(active,direction){
		if(dobuild){
			return;
		}
		direction = direction || 'down';
		removePaint();//去掉畫圖
		var index = 0;
		
		if(!~(index = steps.indexOf( active ))){
			index = 0;
			active = steps[0];
			//return;
		}
		curNode = active;
		
		if (active.classList.contains('rebuild')) {
//			console.log(active);
//			console.log(toArray($$('[data-build] > *',active)));
			if(direction==='down'){
				lines = toArray($$('[data-build] > *',active));
				oldLines = [];
			}else{
				oldLines = toArray($$('[data-build] > *.visible',active));
				lines = [];
			}
		} else {
			lines = [];
			oldLines = [];
		}
		
//		console.log(active);
		
		var prev = index - 1;
		prevNode = prev >= 0 ? steps[ prev ] : steps[ len-1 ];
//		console.log(prevNode);
		
		var next = index + 1;
		nextNode = next < len ? steps[ next ] : steps[ 0 ];
//		console.log(nextNode);
		
		clearClass();
		curNode.classList.add(presentClass);
		prevNode.classList.add(pastClass);
		nextNode.classList.add(futureClass);
		//更新進度條
		progress.style.width = ((index+1)/len)*win.innerWidth +'px';
		doHash = false;
		win.location.hash = "#" + active.id;
		
		return false;
	}
	//清除class
	function clearClass(){
		toArray($$('.'+presentClass+',.'+pastClass+',.'+futureClass,$slide)).forEach(function(el){
			el.className = el.className.replace(/(?:\s*past|present|future\s*)/g, '');
		});
	}
	//canvas寬高準備了~
	function canvasReady(){
		if(!canvas){
			return;
		}
		canvas.width = win.innerWidth;
	    canvas.height = win.innerHeight;
		canvas.context = canvas.getContext('2d');
	    canvas.context.lineWidth = 5;
	    canvas.context.lineCap = 'round';
	    canvas.context.strokeStyle = "red";
//	    css(canvas, {
//		 	width:win.innerWidth,
//		 	height: win.innerHeight
//		 });
		
	}
	function showPaint(){
		if(!canvas){
			return;
		}
		canvasReady();
		
//		 css(canvas, {
//		 	display: "",
//		 	cursor: "crosshair"
//		 });
		canvas.style.display = '';
		canvas.style.cursor = 'crosshair';
		if(!window.addEventListener){canvas.attachEvent('onmousedown', pMouseDown);}
		else{canvas.addEventListener('mousedown',pMouseDown,false);}
		if(!window.addEventListener){canvas.attachEvent('onmouseup', pMouseUp);}
		else{canvas.addEventListener('mouseup',pMouseUp,false);}
		if(!window.addEventListener){canvas.attachEvent('onmousemove', pMouseMove);}
		else{canvas.addEventListener('mousemove',pMouseMove,false);}
	}
	
	function clearPaint(){
		if(!canvas){
			return;
		}
		canvas.context && canvas.context.clearRect(0, 0, canvas.width, canvas.height);
		canvas.style.display = 'none';
	}
	var removePaint = function(){
		if(!canvas){
			return;
		}
		clearPaint();
		if(!window.removeEventListener){canvas.detachEvent('onmousedown', pMouseDown);}
		else{canvas.removeEventListener('mousedown', pMouseDown);}
		if(!window.removeEventListener){canvas.detachEvent('onmouseup', pMouseUp);}
		else{canvas.removeEventListener('mouseup', pMouseUp);}
		if(!window.removeEventListener){canvas.detachEvent('onmousemove', pMouseMove);}
		else{canvas.removeEventListener('mousemove', pMouseMove);}
	}
	
	/**
	 * 畫圖部分事件處理函數
	 * @param {Object} e
	 */
		var pMouseDown = function(e){
			var evt = e ? e:window.event;
			canvas.isMouseDown = true;
			canvas.iLastX = evt.clientX - canvas.offsetLeft + (win.pageXOffset || doc.body.scrollLeft || doc.documentElement.scrollLeft);
			canvas.iLastY = evt.clientY - canvas.offsetTop + (win.pageYOffset || doc.body.scrollTop || doc.documentElement.scrollTop);
		}, pMouseUp = function(){
			canvas.isMouseDown = false;
			canvas.iLastX = -1;
			canvas.iLastY = -1;
		}, pMouseMove = function(e){
			var evt = e ? e:window.event;
			if (canvas.isMouseDown) {
				var iX = evt.clientX - canvas.offsetLeft + (win.pageXOffset || doc.body.scrollLeft || doc.documentElement.scrollLeft);
				var iY = evt.clientY - canvas.offsetTop + (win.pageYOffset || doc.body.scrollTop || doc.documentElement.scrollTop);
				canvas.context.beginPath();
				canvas.context.moveTo(canvas.iLastX, canvas.iLastY);
				canvas.context.lineTo(iX, iY);
				canvas.context.stroke();
				canvas.iLastX = iX;
				canvas.iLastY = iY;
			}
		};
	
	var bindDOM = function(){
		//事件綁定區域
		if(!window.addEventListener){doc.attachEvent('onkeydown', function(e){
			var evt = e ? e:window.event;
			var code = evt.keyCode ? evt.keyCode : evt.which ? evt.which : evt.charCode;
			if (code === 80 || code == 67/* || code==72*/) {
				switch (code) {
					case 80://p
						showPaint();
						break;
					case 67://c
						removePaint();
						break;
				//				case 72://h
				//					
				//				break;
				}
				if(evt.preventDefault)
						{
         			evt.preventDefault(); 
      			}else
      			{
         			evt.returnValue=false;
      			}
			}
			else 
				if (code === 9 || (code >= 32 && code <= 34) || (code >= 37 && code <= 40)) {
					var next = steps.indexOf(curNode);
					dobuild = false;
					direction = 'up';
					switch (code) {
					
						case 33:; // pg up
						case 37:; // left
						case 38: // up
							if (oldLines.length) {
								dobuild = true;
								var temp = oldLines.pop();
								lines.splice(0, 0, temp);
								temp.classList.remove("visible");
							}
							next = next - 1;
							next = next >= 0 ? steps[next] : steps[steps.length - 1];
							
							break;
						case 9:; // tab
						case 32:; // space
						case 34:; // pg down
						case 39:; // right
						case 40: // down
							if (lines.length) {
								dobuild = true;
								var temp = lines.shift();
								temp.classList.add("visible");
								oldLines.push(temp);
							}
							next = next + 1;
							next = next < steps.length ? steps[next] : steps[0];
							direction = 'down';
							break;
						//添加ESC鍵
//						case 27:
//							next = steps[steps.length - 1];
//							break;
					}
					update(next, direction);					
					if(evt.preventDefault)
						{
         			evt.preventDefault(); 
      			}else
      			{
         			evt.returnValue=false;
      			}
				}
		});}
	else{
		doc.addEventListener("keydown", function(e){
			var evt = e ? e:window.event;
			var code = evt.keyCode ? evt.keyCode : evt.which ? evt.which : evt.charCode;
			if (code === 80 || code == 67/* || code==72*/) {
				switch (code) {
					case 80://p
						showPaint();
						break;
					case 67://c
						removePaint();
						break;
				//				case 72://h
				//					
				//				break;
				}
				if(evt.preventDefault)
						{
         			evt.preventDefault(); 
      			}else
      			{
         			evt.returnValue=false;
      			}
			}
			else 
				if (code === 9 || (code >= 32 && code <= 34) || (code >= 37 && code <= 40)) {
					var next = steps.indexOf(curNode);
					dobuild = false;
					direction = 'up';
					switch (code) {
					
						case 33:; // pg up
						case 37:; // left
						case 38: // up
							if (oldLines.length) {
								dobuild = true;
								var temp = oldLines.pop();
								lines.splice(0, 0, temp);
								temp.classList.remove("visible");
							}
							next = next - 1;
							next = next >= 0 ? steps[next] : steps[steps.length - 1];
							
							break;
						case 9:; // tab
						case 32:; // space
						case 34:; // pg down
						case 39:; // right
						case 40: // down
							if (lines.length) {
								dobuild = true;
								var temp = lines.shift();
								temp.classList.add("visible");
								oldLines.push(temp);
							}
							next = next + 1;
							next = next < steps.length ? steps[next] : steps[0];
							direction = 'down';
							break;
						//添加ESC鍵
//						case 27:
//							next = steps[steps.length - 1];
//							break;
					}
					update(next, direction);					
					if(evt.preventDefault)
						{
         			evt.preventDefault(); 
      			}else
      			{
         			evt.returnValue=false;
      			}
				}
		}, false);
		}
		///
		
		if(!window.addEventListener){win.attachEvent('onhashchange', function(){
			if (doHash) {
				update(getElementFromUrl(), 'down');
			}
			else {
				doHash = true;
			}
			
		});}
		else{
			win.addEventListener("hashchange", function(){
			if (doHash) {
				update(getElementFromUrl(), 'down');
			}
			else {
				doHash = true;
			}
			
		}, false);
		}
		
		win.onresize = canvasReady;
		if(args.ctrlId){
			if(!window.addEventListener){win.attachEvent('onhashchange', function(e){
				var evt = e ? e:window.event;
				if (evt.target) {var target = evt.target;}
				else if (evt.srcElement)  {var target = evt.srcElement;} 				
				dobuild = false;
				var next = steps.indexOf(curNode);
				if (target.classList.contains('home')) {
					doHash = true;
					win.location.hash = '#cover';
				}else if (target.classList.contains('left')) {
					if (oldLines.length) {
								dobuild = true;
								var temp = oldLines.pop();
								lines.splice(0, 0, temp);
								temp.classList.remove("visible");
							}
					next = next - 1;
					next = next >= 0 ? steps[next] : steps[steps.length - 1];
					update(next, 'up');				
				}else if (target.classList.contains('right')) {
					if (lines.length) {
								dobuild = true;
								var temp = lines.shift();
								temp.classList.add("visible");
								oldLines.push(temp);
							}
					next = next + 1;
					next = next < steps.length ? steps[next] : steps[0];
					update(next, 'down');				
				}else if (target.classList.contains('paint')) {	
					showPaint();
				}else if (target.classList.contains('clearIt')) {
					removePaint();
				}
				
				
			});}
		else{
			byId(args.ctrlId).addEventListener('click', function(e){
				var evt = e ? e:window.event;
				if (evt.target) {var target = evt.target;}
				else if (evt.srcElement)  {var target = evt.srcElement;} 				
				dobuild = false;
				var next = steps.indexOf(curNode);
				if (target.classList.contains('home')) {
					doHash = true;
					win.location.hash = '#cover';
				}else if (target.classList.contains('left')) {
					if (oldLines.length) {
								dobuild = true;
								var temp = oldLines.pop();
								lines.splice(0, 0, temp);
								temp.classList.remove("visible");
							}
					next = next - 1;
					next = next >= 0 ? steps[next] : steps[steps.length - 1];
					update(next, 'up');				
				}else if (target.classList.contains('right')) {
					if (lines.length) {
								dobuild = true;
								var temp = lines.shift();
								temp.classList.add("visible");
								oldLines.push(temp);
							}
					next = next + 1;
					next = next < steps.length ? steps[next] : steps[0];
					update(next, 'down');				
				}else if (target.classList.contains('paint')) {	
					showPaint();
				}else if (target.classList.contains('clearIt')) {
					removePaint();
				}
				
				
			}, false);
			}
			
		}
		
	}
	
	function touchHandler(e)
{
		var evt = e ? e:window.event;
    var touches = evt.changedTouches,
        first = touches[0],
        type = "";
         switch(evt.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }

             //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //           screenX, screenY, clientX, clientY, ctrlKey, 
    //           altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY, 
                              first.clientX, first.clientY, false, 
                              false, false, false, 0/*left*/, null);

                              first.target.dispatchEvent(simulatedEvent);
    /*
    if(evt.preventDefault)
						{
         			evt.preventDefault(); 
      			}else
      			{
         			evt.returnValue=false;
      			}
    //*/  			
}
	
	var init = function(){
	 	doc.body.height = "100%",
	 	doc.body.overflow = "hidden"
		
		$slide = byId(args.slideId), 
		canvas = byId(args.canvasId);
		canvas && (canvas.style.display = 'none');
		
		progress = $$('.progress > span',$slide)[0],
		
		presentClass = args.presentClass;
		pastClass = args.pastClass;
		futureClass = args.futureClass;
		
		
		steps = toArray($$('.step',$slide));
		len = steps.length;
		
		bindDOM();
		if(!window.addEventListener){doc.attachEvent('ontouchstart', touchHandler);}
		else{doc.addEventListener("touchstart", touchHandler, false);}
		if(!window.addEventListener){doc.attachEvent('ontouchmove', touchHandler);}
    else{doc.addEventListener("touchmove", touchHandler, false);}
    if(!window.addEventListener){doc.attachEvent('ontouchend', touchHandler);}
    else{doc.addEventListener("touchend", touchHandler, false);}
    if(!window.addEventListener){doc.attachEvent('ontouchcancel', touchHandler);}
    else{doc.addEventListener("touchcancel", touchHandler, false);}
		doHash = true;
		update(getElementFromUrl()||steps[0],'down');
	}
	var args = {
		slideId:'slide',
		canvasId:'',
		ctrlId:'',
		presentClass:'present',
		pastClass: 'past',
		futureClass:'future'
	};
	win.wSlide = function(opt){
		args = parseParam(args,opt);
		if(!args.slideId){
			alert('need slideId~O(∩_∩)O~');
			return;
		}
		init();
	}
}(document,window);
wSlide({
	slideId:'slide',
	canvasId:'myCanvas',
	ctrlId:'slideCtrl'
});

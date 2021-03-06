
;!function(doc,win){
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
			canvas.isMouseDown = true;
			canvas.iLastX = e.clientX - canvas.offsetLeft + (win.pageXOffset || doc.body.scrollLeft || doc.documentElement.scrollLeft);
			//canvas.iLastY = e.clientY - canvas.offsetTop + (win.pageYOffset || doc.body.scrollTop || doc.documentElement.scrollTop);
			canvas.iLastY = e.clientY;
		}, pMouseUp = function(){
			canvas.isMouseDown = false;
			canvas.iLastX = -1;
			canvas.iLastY = -1;
		}, pMouseMove = function(e){
			if (canvas.isMouseDown) {
				var iX = e.clientX - canvas.offsetLeft + (win.pageXOffset || doc.body.scrollLeft || doc.documentElement.scrollLeft);
				//var iY = e.clientY - canvas.offsetTop + (win.pageYOffset || doc.body.scrollTop || doc.documentElement.scrollTop);
				var iY = e.clientY;
				canvas.context.beginPath();
				canvas.context.moveTo(canvas.iLastX, canvas.iLastY);
				canvas.context.lineTo(iX, e.clientY);
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
			if(!window.addEventListener){args.ctrlId.attachEvent('click', function(e){
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

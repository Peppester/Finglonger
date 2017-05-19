(function(){
	if (typeof window.FileReader === 'undefined')
		alert('File API & FileReader not supported');

	var drophidden = document.getElementById("drophidden");
	var duration = document.getElementById("duration");
	var playbutton = document.getElementById("playbutton");

	var dropper = document.getElementById("dropper");
	var results = document.getElementById("results");
	var prev_image = null, body = document.body;

	//Returns true if it is a DOM node
	function isNode(o){
		return (
			typeof Node === "object" ? o instanceof Node : 
			o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
		);
	}

	//Returns true if it is a DOM element    
	function isElement(o){
		return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
		);
	}

	function fadeOut(element, parent, removeChild) {
		//if (!element) return;
		var op = 1;  // initial opacity
		element.style.opacity = op;
		element.style.display = 'block';
		requestAnimationFrame(function myTimer() {
			if (op <= 0){
				if (removeChild){
					parent.removeChild(element);
				} else {
					element.style.display = 'none';
				}
				return;
			}
			element.style.opacity = op;
			op -= 0.05;
			requestAnimationFrame(myTimer);
		});
	}

	function fadeIn(element, parent) {
		//if (!element) return;
		var op = 0;  // initial opacity
		element.style.opacity = op;
		if (element.parentNode !== parent) parent.appendChild(element);
		element.style.display = 'block';
		requestAnimationFrame(function myTimer() {
			if (op > 1){
				return;
			}
			element.style.opacity = op;
			op += 0.05;
			requestAnimationFrame(myTimer);
		});
	}

	function fileLoaded(dataUri) {
		if (typeof dataUri === 'string') {
			var img=new Image();
			img.src = dataUri;
			var prevTime = Date.now();
			img.onload = function(){
				if(prev_image)
					fadeOut(	prev_image,	results );
				fadeIn( 	img,		results );
				prev_image = img;
				setTimeout(
					nextImage,
					Math.max(duration.value*1000 - Math.max(Date.now()-prevTime,0) + 500,500)
				);
			};
			return img;
		} else {
			fadeOut(	prev_image,	results );
			fadeIn( 	dataUri,	results );
			prev_image = dataUri;
			setTimeout(
				nextImage,
				Math.max(duration.value*1000 - Math.max(Date.now()-prevTime,0) + 500,500)
			);
		}
	}

	function readFile(file, myRandom) {
		if ( ! isElement(file) ){
			var reader = new FileReader();
			console.log(file);
			reader.onload = function(event) {
				originalFiles.push( fileLoaded( URL.createObjectURL(new Blob([event.target.result])) ) );
			};
			reader.readAsArrayBuffer(file);
		} else {
			fileLoaded( file );
		}
		files.splice(myRandom, 1);
		if ( ! files.length ) window.files = window.originalFiles.slice(0);
		dropper.className = '';
	}

	function nextImage(){
		var myRandom = Math.floor( Math.random() * (files.length-0.5) );
		readFile(files[myRandom], myRandom);
	}
	window.files = [];
	window.originalFiles = [];

	dropper.ondragover = function () { dropper.className = 'hover'; return false; };
	dropper.ondragend = function () { dropper.className = ''; return false; };
	dropper.ondrop = function (e) {
		e.preventDefault();
		dropper.className = '';
		if (e.dataTransfer.files.length){
			var oldlen=files.length;
			window.files = window.files.concat([].slice.call(e.dataTransfer.files));
			var i=files.length;
			while(i--){
				if ( ! /^image/.test(files[i].type) ){
					files.splice(i,1);
				}
			}
			if (oldlen !== files.length){
				document.body.className = "setting";
				fadeIn(drophidden, body);
				var myRandom = Math.floor(Math.random()*(files.length-0.5));
				playbutton.onclick = function(){
					document.getElementById('relative').removeChild(dropper);
					playbutton.onclick = null;
					document.body.className = "presenting";
					readFile(files[myRandom], myRandom);
				}
			} else {
				alert("You can't upload files that are not images.");
			}
		} else {
			alert("You can't upload folders! Please try again.");
		}
	};
})();























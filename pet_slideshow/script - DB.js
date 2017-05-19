(function(){
	// Open (or create) the database
	var DBrequest = indexedDB.open("SSimgs", 1), db, objectStore;

	window.onbeforeunload = function(){
		indexedDB.deleteDatabase("SSimgs");
	}
	
	DBrequest.onupgradeneeded = function(){
		window.datab = db = DBrequest.result;
		console.log(db);
		window.objectStore = db.createObjectStore("imgs");
	}

	// Create the schema
	DBrequest.onsuccess = function() {
		
		if (typeof window.FileReader === 'undefined')
			alert('File API & FileReader not supported');
		
		var drophidden = document.getElementById("drophidden");
		var dropshown = document.getElementById("dropshown");
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
				op -= 0.04;
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
				op += 0.04;
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
					setTimeout(function(){
						setTimeout(
							nextImage,
							Math.max(duration.value*1000 - Math.max(Date.now()-prevTime,0),250)
						);
					}, 250);
				};
				return img;
			} else {
				fadeOut(	prev_image,	results );
				fadeIn( 	dataUri,	results );
				prev_image = dataUri;
				setTimeout(function(){
					setTimeout(
						nextImage,
						Math.max(duration.value*1000 - Math.max(Date.now()-prevTime,0),250)
					);
				},750);
			}
		}
		
		function readFile(file, myRandom) {
			if ( ! isElement(file) ){
				var reader = new FileReader();
				reader.onload = function(event) {
					var request = objectStore.add(myRandom, event.target.result);
					console.log( event, request );
					window.req = request;
					originalFiles.push( myRandom );
					fileLoaded( event.target.result );
				};
				reader.readAsDataURL(file);
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

		dropper.ondragover = function () { dropper.className = 'hover'; return false; };
		dropper.ondragend = function () { dropper.className = ''; return false; };
		dropper.ondrop = function (e) {
			e.preventDefault();
			document.body.removeChild(dropper);
			fadeOut(dropshown, body);
			fadeIn(drophidden, body);
			window.files = [].slice.call(e.dataTransfer.files);
			var i=files.length;
			while(i--){
				if ( ! /^image/.test(files[i].type) ){
					files.splice(i,1);
				}
			}
			window.originalFiles = [];
			var myRandom = Math.round(Math.random()*(files.length-1));
			playbutton.onclick = function(){
				playbutton.onclick = null;
				document.body.className = "presenting";
				readFile(files[myRandom], myRandom);
			}
			return false;
		};
	};
})();























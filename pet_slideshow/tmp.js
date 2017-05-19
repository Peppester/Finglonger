(function(){
	var keyElements	= document.getElementsByTagName('keysound'),
		i			= keyElements.length,
		keys		= {};
	while (i--){
		var cur		= (keyElements[i].getAttribute('keys')||"").toString().split(''),
			v		= cur.length,
			audio	= keyElements[i].getAttribute('src'),
			caseinsensitive	= keyElements[i].getAttribute('lowercase'),
			regexp	= keyElements[i].getAttribute('regexp')!==null?true:false;
		if (audio){
			while (v--){
				var src=!regexp?audio:
				audio.replace('${key}', cur[v])
				.replace('${code}', cur[v].charCodeAt(0));
				var ele = document.createElement('audio');
				ele.src = src;
				document.body.appendChild(ele);
				(keys[cur[v].toLowerCase()] = keys[cur[v].toLowerCase()] || []).push(
					ele
				);
				if (caseinsensitive){
					(keys[cur[v].toUpperCase()] = keys[cur[v].toUpperCase()] || []).push(
						ele
					);
				}
			}
		}
	}
	window.addEventListener('keydown',function(evt){
		var clist	= keys[evt.keyCode.fromCharCode()],
			clen	= clist.length;
		while (clen--){
			try { clist[clen].play() } catch(e) {}
		}
	});
})();
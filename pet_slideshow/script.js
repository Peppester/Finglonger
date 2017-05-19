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
					if (element.getAttribute('src')){
						element.setAttribute('srcTmp', element.getAttribute('src'));
						element.setAttribute('src', "");
					}
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
		if (!element.getAttribute('src')){
			element.setAttribute('src', element.getAttribute('srcTmp'));
		}
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
			var img = new Image();
			img.src = dataUri;
			var prevTime = performance.now();
			img.onload = function(){
				if(prev_image)
					fadeOut(	prev_image,	results );
				fadeIn( 	img,		results );
				prev_image = img;
				setTimeout(
					nextImage,
					Math.max(duration.value*1000 - Math.max(performance.now()-prevTime,0) + 400,1000)
				);
			};
			return img;
		} else {
			fadeOut(	prev_image,	results );
			fadeIn( 	dataUri,	results );
			prev_image = dataUri;
			setTimeout(
				nextImage,
				Math.max(duration.value*1000 + 400,1000)
			);
		}
	}
	//window.dehFnames = "";

	function readFile(file, myRandom) {
		var file = typeof file === 'string' ? { name: file } : file;
		if ( ! isElement(file) ){
			/*var reader = new FileReader();
			console.log(file);
			reader.onload = function(event) {
				originalFiles.push( fileLoaded( URL.createObjectURL(new Blob([event.target.result])) ) );
			};
			reader.readAsArrayBuffer(file);*/
			console.log( file );
			originalFiles.push( fileLoaded( "../dem_puppy_pics/" + file.name ) );
			//window.dehFnames += file.name + "\n"
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
		//e.preventDefault();
		dropper.className = '';
		if (e.dataTransfer.files.length){
			var oldlen=files.length;
			window.files = window.files.concat([].slice.call(e.dataTransfer.files));
			/*var i=files.length;
			while(i--){
				if ( ! /^image/.test(files[i].type) ){
					files.splice(i,1);
				}
			}*/
			if (true/*oldlen !== files.length*/){
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
	
	var filesNamesToLoadNow = [
		"Zebu.jpg",
		"Zebras.jpg",
		"WoolyOpossum.jpg",
		"Woodchuck.jpg",
		"Yak.JPG",
		"Wombat.jpg",
		"Wolverine.jpg",
		"Wolf.jpg",
		"Wisent.jpg",
		"WildRabbit.jpg",
		"WildCanadianLynx.jpg",
		"WildBoar.jpg",
		"WhiteTiger.jpg",
		"WhiteYak.JPG",
		"WhiteTailedDeer.jpg",
		"WhiteTailedDeer-2.jpg",
		"WhiteRhinoceros.jpg",
		"WhiteMouse.jpg",
		"WhiteRhinoCalf.jpg",
		"WhiteLion-3.jpg",
		"WhiteLion-2.jpg",
		"WhiteLion.jpg",
		"WhiteKomondorDog.jpg",
		"WhiteFallowDeers.jpg",
		"WhiteChinchilla.jpg",
		"WaterVole.JPG",
		"WhiteBengalTigers.jpg",
		"WhiteBengalTiger.jpg",
		"Waterbuck.jpg",
		"Wallaroo.jpg",
		"TurkmenianMarkhor.jpg",
		"Warthog.JPG",
		"Wallaby.jpeg",
		"Tiger.jpg",
		"Tayra.jpg",
		"Tiger-2.jpg",
		"Tayra-2.jpg",
		"TasmanianDevils.JPG",
		"Tapir.jpg",
		"Thomson'sGazelles.jpg",
		"SugarGlider.jpg",
		"Takin.jpg",
		"SunBears.jpg",
		"Stag.jpg",
		"Squirrel.jpg",
		"Squirrel-4.jpg",
		"SpectacledCaiman.jpg",
		"Squirrel-3.jpg",
		"SouslikSquirrel.jpg",
		"SouthernTamandua.jpg",
		"Squirrel-2.jpg",
		"SnowErmine.jpg",
		"SnowLeopard.jpg",
		"SnowLeopards.jpg",
		"Skunk.jpg",
		"SnowErmine-2.jpg",
		"Sloth.jpg",
		"snake - NATHANIEL WOLKING.jpg",
		"SilkySifakaPinkFacedLemur.JPG",
		"SifakaLemurs.jpg",
		"SikaDeers.jpg",
		"SiberianTiger.jpg",
		"Serval.jpg",
		"SeraFina (1) - Emily Bockweg.jpg",
		"ShortBeakedEchidna(SpinyAnteater).jpg",
		"ShortTailedShrew.jpg",
		"SandCat.jpg",
		"SeraFina - Emily Bockweg.jpg",
		"SaltWaterCrocodile.JPG",
		"SableAntelope.jpg",
		"SableAntelope-2.jpg",
		"RuffedLemur.jpg",
		"RuddyMongoose.jpg",
		"RockSquirrel.jpg",
		"RooseveltElk.JPG",
		"RoeDeers.jpg",
		"RockHyrax.jpg",
		"RingTailedLemurs.jpg",
		"RingTailedLemur.jpg",
		"Rhinoceroses.jpg",
		"RhimGazelle.jpg",
		"RedSquirrel.jpg",
		"Reindeer.jpeg",
		"RedStag.jpg",
		"Rhinoceros.jpg",
		"Reedbuck.jpg",
		"RedSlenderLoris.jpg",
		"RedPanda.jpg",
		"RedSlenderLoris-2.jpg",
		"RedNeckedWallaby.jpg",
		"RedRuffedLemur.jpg",
		"RedKangaroos.jpg",
		"RedKangaroo.jpg",
		"RedFrontedBrownLemur.jpg",
		"RedFox.jpg",
		"Raccoon.jpg",
		"RaccoonBabies.jpg",
		"rat - NATHANIEL WOLKING.jpg",
		"Rabbits.jpg",
		"Rabbits-2.jpg",
		"Rabbit.jpg",
		"PygmyHippos.JPG",
		"PygmyHippo.jpg",
		"Pronghorn(AntilocapraAmericana).jpg",
		"PrairieDog.jpg",
		"Porcupine.jpg",
		"PygmyHippo-2.jpg",
		"Porcupine-2.jpg",
		"Pony.jpg",
		"Ponies.jpg",
		"Polecat.jpg",
		"PolarBears-4.jpg",
		"PolarBears-3.jpg",
		"PolarBears.jpg",
		"PolarBears-2.jpg",
		"PolarBear.jpg",
		"PocketGopher.jpg",
		"PereDavidDeers.jpg",
		"Pepper (7) - JACK GIFFIN.jpg",
		"Pepper (9) - JACK GIFFIN.jpg",
		"Pepper (8) - JACK GIFFIN.jpg",
		"Pepper (4) - JACK GIFFIN.jpg",
		"Pepper (6) - JACK GIFFIN.jpg",
		"Pepper (5) - JACK GIFFIN.jpg",
		"Pepper (3) - JACK GIFFIN.jpg",
		"Pepper (1) - JACK GIFFIN.jpg",
		"Pepper (2) - JACK GIFFIN.jpg",
		"Pepper - JACK GIFFIN.jpg",
		"Penguins.jpg",
		"PenguinChick.jpg",
		"PatagonianCavy(PatagonianMara).jpg",
		"Pangolin.jpg",
		"Panda.jpg",
		"Oryx.jpg",
		"Otter.jpg",
		"Okapi.jpg",
		"Opossum.jpg",
		"NorthAmericanPorcupine.jpg",
		"NorthernTamandua.JPG",
		"Ocelot.jpg",
		"NileMonitor.jpg",
		"Muskrat.jpg",
		"Nilgai.jpg",
		"NileCrocodile-2.jpg",
		"NileCrocodile.jpg",
		"MuskOx.jpg",
		"MuleDeer.jpg",
		"MountainLynx.jpg",
		"MountainHare.jpg",
		"MountainGoats.jpg",
		"MongooseLemur.jpg",
		"MountainLion.jpg",
		"MongolianGerbils.jpg",
		"Mole.jpg",
		"Merton'sWaterMonitor.jpg",
		"Meerkats.jpg",
		"Meerkat.jpg",
		"Mink.jpg",
		"MarineIguana.jpg",
		"Markhor.jpg",
		"Martens.jpg",
		"ManedWolf.jpg",
		"MalayanSunBear.jpg",
		"LynxKitten.jpg",
		"LongEaredJerboa.jpg",
		"Llama.jpg",
		"Llamas.jpg",
		"Lizard-2.jpg",
		"Lions.jpg",
		"Lizard.jpg",
		"Lion.jpg",
		"LionCub.jpg",
		"Leopards.jpg",
		"Leopard.jpg",
		"LesserKudu.jpg",
		"Lemur.jpg",
		"Lemurs-2.jpg",
		"LeastChipmunk.jpg",
		"Kulan(TurkmenianWildAss).JPG",
		"KodiakBear.jpg",
		"IMG_3765 - KYLEE SHELDON.JPG",
		"KomodoDragon.jpg",
		"IMG_2659 - KYLEE SHELDON.JPG",
		"IMG_3752 - KYLEE SHELDON.JPG",
		"IMG_3729 - KYLEE SHELDON.JPG",
		"IMG_2331 - BROOKE NORRIS.JPG",
		"IMG_1500 - LEXI KEIPERT.JPG",
		"IMG_2333 - BROOKE NORRIS.JPG",
		"IMG_1499 - LEXI KEIPERT.JPG",
		"Image-1 - MAGGIE DARPEL(3).jpg",
		"Image-1 - MAGGIE DARPEL(2).jpg",
		"IMG_0050 - KYLEE SHELDON.JPG",
		"Image-1 - MAGGIE DARPEL.jpg",
		"Image-1 - MAGGIE DARPEL(1).jpg",
		"horse - NATHANIEL WOLKING.jpg",
		"bunny - NATHANIEL WOLKING.jpg",
		"Bird - NATHANIEL WOLKING.jpg",
		"17904173_1611903858837591_9162769624316254006_n.jpg",
		"17904062_1612010295493614_8217008843575236250_n.jpg",
		"17903983_1611909425503701_5736224728012798456_n.jpg",
		"17883869_1612010368826940_8120991091979768583_n.jpg",
		"17884368_1612010445493599_1594268689595923428_n.jpg",
		"17884427_1611903782170932_2921158985602458514_n.jpg",
		"17883963_1612010375493606_8905744308059915367_n.jpg",
		"17903908_1611903728837604_4266199747058096493_n.jpg",
		"17884078_1611912888836688_5945664145604805564_n.jpg",
		"17862732_1612010548826922_313327888624353396_n.jpg",
		"17883848_1612010558826921_2412217098403951666_n.jpg",
		"17883699_1612010428826934_7392617159336976888_n.jpg",
		"17883606_1611903845504259_1005084876961903204_n.jpg",
		"17883676_1611906632170647_7613200413836346113_n.jpg",
		"17862655_1612010568826920_6698613576801762654_n.jpg",
		"17861795_1612010505493593_642826828384042899_n.jpg",
		"17862562_1612010588826918_4266416905628281469_n.jpg",
		"8f4b2c40-7915-45c0-8603-8544ed03eee2 - JACK GIFFIN.jpg",
		"17757223_1611903738837603_4439009402940519296_n.jpg",
		"17523709_1612010302160280_994246808056580499_n.jpg",
		"14468f8c-d1f2-428f-9423-1140903d4f1a - JACK GIFFIN.jpg"
	];
	dropper.ondrop({
		dataTransfer: {
			files: filesNamesToLoadNow
		}
	});
})();























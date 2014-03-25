



var GameObj = function () 
{

	/* =============================  Reference Data  ========================= */

	this.fixtureType = [
		{
			"name"	: "pine tree"
			,"size"	: { x : 120, y : 180, z : 1 }
			,"classString" : "pine_tree"
		},{
			"name"	: "berry bush"
			,"size"	: { x : 60, y : 60, z : 1 }		
			,"classString" : "berry_bush"
		}
	];

	this.itemType = [
		{//0
			"name"	: "stone"
			,"size"	: { x : 60, y : 60, z : 1 }
			,"classString" : "stone"
			,"damage" 	: 1
			,"health" 	: 10
		},{//1
			"name"	: "sharp stone"
			,"size"	: { x : 60, y : 60, z : 1 }
			,"classString" : "sharp_stone"
			,"damage" 	: 1
			,"health" 	: 10
		},{//2
			"name"	: "twisted stick"
			,"size"	: { x : 60, y : 60, z : 1 }		
			,"classString" : "twisted_stick"
			,"damage" 	: 0
			,"health" 	: 1
		},{//3
			"name"	: "straight stick"
			,"size"	: { x : 60, y : 60, z : 1 }		
			,"classString" : "straight_stick"
			,"damage" 	: 0
			,"health" 	: 2
		},{//4
			"name"	: "berries"
			,"size"	: { x : 60, y : 60, z : 1 }		
			,"classString" : "berries"
			,"damage" 	: 0
			,"health" 	: 1
			,"heals"	: 1
		},{//5
			"name"	: "stone spear"
			,"size"	: { x : 60, y : 60, z : 1 }		
			,"classString" : "stone_spear"
			,"damage" 	: 2
			,"health" 	: 30
		},{//6
			"name"	: "stone axe"
			,"size"	: { x : 60, y : 60, z : 1 }		
			,"classString" : "stone_axe"
			,"damage" 	: 2
			,"health" 	: 30
		},{//7
			"name"	: "log"
			,"size"	: { x : 60, y : 60, z : 1 }		
			,"classString" : "log"	
			,"damage" 	: 0
			,"health" 	: 10			
		}
	];	

	/* =================== OBJECTS/CLASSES ================== */
	
	this.TerrainObj = function (h) {
		this.height = h;
		// *** terrain type
		this.actorIndexArray = [];
		this.itemIndexArray = [];
	}
	
	this.ActorObj = function (actorId, posX, posY, rgbObj, domColor) 
	{
		this.actorId	= actorId;
		this.pos		= { x: posX, y: posY, z: 0 };
		this.lastPos	= { x: posX, y: posY, z: 0 };
		//this.mood
		this.color 		= { r: rgbObj.r, g: rgbObj.g, b: rgbObj.b };
		this.dominantColor = domColor;
		/*
		this.friendship = 0;
		this.fear		= 0;
		this.respect	= 0;
		*/
		this.tribeId	= 0;
		this.size		= {
			x : 60		// width
			,y : 60		// height
			,z : 1
		};
		this.facing		= -1;
		this.velocity	= {	x : 0, y : 0, z : 0	};
		this.$elt 		= $([]);
		this.maxHealth	= 6;
		this.health		= 6;
		this.inventorySlots = 1;
		this.inventoryArray = [];
		this.readiedItem = 0;
	
	}
	
	/*
	this.TribeObj = function (n) {
		this.name = n;
		this.getPopulation = function () {
		
		}
	}
	*/
	
	this.FixtureObj = function (typeIndex, posX) {
		this.typeIndex 	= typeIndex;
		this.pos		= { x: posX, y: 0, z: 0 };
		this.$elt 		= $([]);
		this.maxHealth	= 3;
		this.health		= 3;
	}

	this.ItemObj = function (typeIndex, posX) {
		this.typeIndex 	= typeIndex;
		this.pos		= { x: posX, y: 0, z: 0 };
		this.$elt 		= $([]);
		this.maxHealth	= 3;
		this.health		= 3;
		this.carriedByActorIndex = -1;
	}

	

	/* =============================  Variables  ====================== */

	this.terrainPositiveArray = [];
	this.terrainNegativeArray = [];
	this.actorArray = [];	
	this.fixtureArray = [];
	this.itemArray = [];
	
	this.worldWidth = 200;
	this.tickCount	= 0;
	this.isPaused	= false;
	this.isHalfWon	= false;
	this.isWon		= false;
	
	this.numOfActors 	= 0;
	this.numOfAllies 	= 0;

	//====== Constants
	this.baseTickTime	= 200;
	this.loopTimer		= 0;
	this.cssXMultiplier	= 50;
	this.cssYBase 		= 470;
	this.iconPerMuscle	= 20;
	this.isMovingLeft	= false;
	this.isMovingRight	= false;
	
	this.heightVariation = 50;	// 50


	/* ==== Load ==== */
	
	this.loadTerrain = function ()
	{
		// *** See if terrain exists in localstorage; if not, then generate new terrain
		this.terrainPositiveArray[0] = new this.TerrainObj( 201 );
		var lastHeight = 50;
		for (var i = 1; i < this.worldWidth; i++) {
			var h = (lastHeight + this.rollBell(this.heightVariation));
			if (h < 1) h = 1;
			else if (h > 200) h = 200;
			lastHeight = h;
			this.terrainPositiveArray[i] = new this.TerrainObj( h );
		}
		this.terrainPositiveArray[this.worldWidth] = new this.TerrainObj( (lastHeight+101) );
	
	}
	
	this.loadActors = function ()
	{
		var getDominantColor = function (color) {
			if (color.r > color.g || color.r > color.b) 		return "r";
			else if (color.g > color.r || color.g > color.b) 	return "g";
			else if (color.b > color.r || color.b > color.g) 	return "b";
			else return "b"; //*** should make this random
		}
		var charStartX = 10;
		var charStartY = this.terrainPositiveArray[charStartX].height;
		var color = { r: this.roll1d(255), g: this.roll1d(255), b: this.roll1d(255) };
		var domColor = getDominantColor(color);
		color[domColor] += 120;
		if (color[domColor] > 255) color[domColor] = 255;
		this.actorArray[0] = new this.ActorObj(0, charStartX, charStartY, color, domColor);
		this.actorArray[0].maxHealth = 8;
		this.actorArray[0].health = 8;
		this.actorArray[0].inventorySlots = 9;
		
		var usedXArray = [charStartX];
		for (var i = 1; i < 13; i++) {
			color = { r: this.roll1d(255), g: this.roll1d(255), b: this.roll1d(255) };
			domColor = getDominantColor(color);
			color[domColor] += 80;
			if (color[domColor] > 255) color[domColor] = 255;
			var x = this.roll1d(this.worldWidth);
			while ($.inArray(x, usedXArray) > -1) {
				x = this.roll1d(this.worldWidth);
			}
			var y = this.terrainPositiveArray[x].height;
			this.actorArray[i] = new this.ActorObj(i, x, y, color, domColor);
			usedXArray.push(x);
		}
	}
	
	this.loadFixtures = function ()
	{
		// Trees
		for (var i = 0; i < 20; i++) {
			this.fixtureArray[i] = new this.FixtureObj(0, this.roll1d(this.worldWidth));
		}
		// Bushes
		for (var i = 0; i < 10; i++) {
			this.fixtureArray[i] = new this.FixtureObj(1, this.roll1d(this.worldWidth));
		}			
	}
	
	this.loadItems = function ()
	{
		// Stones
		for (var i = 0; i < 30; i++) {
			this.itemArray[i] = new this.ItemObj(0, this.roll1d(this.worldWidth));
		}		
	}	

	
	/* ====================================  Get Calculated Values  ========================= */
	
	this.getCSSPosition = function (pos, size) 
	{
		// *** assumes you're on near path
		var groundHeight = this.terrainPositiveArray[pos.x].height;
		var groundTop = this.cssYBase - groundHeight;
		
		var cssPos = { 
			top : ((groundTop - size.y) +2) + "px"
			,left : ((pos.x * this.cssXMultiplier) - (size.x/2)) + "px" 
		};
		return cssPos;
	}
	
	this.sumPositions = function (pos1, pos2) {
		var sumPos =  { x : (pos1.x + pos2.x), y : (pos1.y + pos2.y), z : (pos1.z + pos2.z) };
		return sumPos;
	}
	
	this.getColorDistance = function (color1, color2) {
		return (Math.sqrt( Math.pow((color1.r - color2.r),2) + Math.pow((color1.g - color2.g),2) + Math.pow((color1.b - color2.b),2) ));
	}
	
	this.getColorMood = function (color1, color2) {
		var d = this.getColorDistance(color1, color2);	// Range: 0 - 441.673
		if (d <= 88.3) 			return 2;	// Ally
		else if (d <= 176.7) 	return 1;	// Friendly
		else if (d <= 264.6) 	return 0;	// Neutral
		else if (d <= 352.8) 	return -1;	// Angry
		else 					return -2;	// Hostile
	}
	
	/*
	this.getColorMoodName = function (color1, color2) {
		var m = this.getColorMood(color1, color2);
		return this.getMoodName(m);
	}
	*/
	
	this.getMoodName = function (m) {
		var moodNames = ["Hostile", "Unfriendly", "Neutral", "Friendly", "Ally"];
		return moodNames[ (m + 2) ];	
	}
	
	this.getColorMoodByActorIndex = function (actorIndex1, actorIndex2) {
		return this.getColorMood(this.actorArray[actorIndex1].color, this.actorArray[actorIndex2].color);
	}
	
	
	
	
	/* =========================================================  Change Values  ================================= */
	
	this.readyInventoryItem = function (invItemIndex) 
	{
		var actor = this.actorArray[0];
		actor.readiedItem = invItemIndex;
		/*
		if (invItemIndex < actor.inventoryArray.length) {
			actor.readiedItem = invItemIndex;
		}*/
		this.refreshInventory();
		// *** update item held in hand
	}
	
	this.activateReadiedInventoryItem = function () 
	{
		var o = this;
		var actor = this.actorArray[0];
		var harvestCount = 0;
		//.readiedItem
		for (var i = 0; i < o.fixtureArray.length; i++) {
			if (o.fixtureArray[i].pos.x == actor.pos.x) {
				harvestCount = o.actorHarvestFixture(0, i);
				if (harvestCount > 0) return harvestCount;
			} else if ((o.fixtureArray[i].pos.x - actor.pos.x) == actor.facing) {
				var nearbyFixtureIndex = i;
			}
		}
		if (harvestCount == 0 && typeof nearbyFixtureIndex !== 'undefined') {
			harvestCount += o.actorHarvestFixture(0, nearbyFixtureIndex);
		}
		if (harvestCount == 0) {
			console.log("Nothing nearby to harvest.");
		}
		return harvestCount;
	}
	
	this.activateTalk = function (actorIndex) 
	{
		console.log("Talk!");
		var o = this;
		var actor = this.actorArray[actorIndex];
		var listenerActorIndexArray = [];
		console.log(actor.pos);
		listenerActorIndexArray = listenerActorIndexArray.concat(
			this.terrainPositiveArray[(actor.pos.x - 2)].actorIndexArray
			,this.terrainPositiveArray[(actor.pos.x - 1)].actorIndexArray
			,this.terrainPositiveArray[actor.pos.x].actorIndexArray
			,this.terrainPositiveArray[(actor.pos.x + 1)].actorIndexArray
			,this.terrainPositiveArray[(actor.pos.x + 2)].actorIndexArray
		);
		var listenerCount = listenerActorIndexArray.length - 1;
		console.log("Talking to " + listenerCount + " listeners.");
		if (listenerCount > 0) {
			var colorChoices = ["r","g","b"];
			var storyColorLetter = colorChoices[(o.roll1d(3)-1)];
			var storyColorValue = actor.color[storyColorLetter];
			for (var a = 0; a < listenerActorIndexArray.length; a++) {
				var listenerActorIndex = listenerActorIndexArray[a];
				if (listenerActorIndex != actorIndex) {
					var listener = this.actorArray[listenerActorIndex];
					//console.log(listener.color);
					var originalColorValue = listener.color[storyColorLetter];
					// The listener gets an even blend of both colors
					listener.color[storyColorLetter] = ((storyColorValue + originalColorValue)/2);
					// The talker gets a small change in their color as well!
					// But only if it's not the talker's dominant color
					if (actor.dominantColor != storyColorLetter) {
						actor.color[storyColorLetter]	= ((storyColorValue * (3/4)) + (originalColorValue/4));
					}
					//console.log(listener.color);
					o.animateActorTalking(listenerActorIndex, 0.5);
				}
			}
			//console.log(actor.color);
			//console.log(storyColorLetter);
		}
		o.animateActorTalking(actorIndex);
	}
	
	
	this.actorHarvestFixture = function (actorIndex, fixtureIndex)
	{
		console.log("Harvesting");
		var actor = this.actorArray[actorIndex];
		var fixture = this.fixtureArray[fixtureIndex];
		if (fixture.health <= 0) {
			this.removeFixture(fixtureIndex);
			return 0;
		} else {
		
			// *** make sure actor has the right item (axe for tree)
		

		
			fixture.health -= 1;
			this.playSound("woodchop");
			if (fixture.health <= 0) {
				this.removeFixture(fixtureIndex);
			} else {
				if (fixture.health <= (fixture.maxHealth / 3)) {
					fixture.$elt.addClass("bigDamage");
				} else if (fixture.health <= (fixture.maxHealth *  (2/3))) {
					fixture.$elt.addClass("smallDamage");
				} 
				this.animateFixture(fixtureIndex);
			}
			var lootItemTypeArray = [];
			var lootAmount = 0;
			switch (fixture.typeIndex) {
				case 0: // pine tree
					if (fixture.health <= 0) {
						lootItemTypeArray = [7,7,7,2];
					} else {
						lootItemTypeArray = [2,2,3];
					}
					lootAmount = this.roll1d(3);
				break;
				case 1: // berries
					lootItemTypeArray = [4];
					lootAmount = 1;
				break;
			}			
			
			
			for (var loot = 0; loot < lootAmount; loot++) {
				var itemTypeIndex = lootItemTypeArray[ (this.roll1d(lootItemTypeArray.length) - 1) ];
				this.makeItem(itemTypeIndex, fixture.pos);
			}
			return 1;
		}
	}
	
	this.removeFixture = function (fixtureIndex) 
	{
		var o = this;
		var removedFixture = o.fixtureArray.splice(fixtureIndex, 1);
		console.log(removedFixture);
		var fixturePos = removedFixture[0].$elt.position();
		removedFixture[0].$elt.animate({
			opacity	: 0.0
			,top 	: (fixturePos.top + 80) + "px"
		}, 1000, function(){
			removedFixture[0].$elt.remove();
		});
	}
	
	
	this.makeItem = function (itemTypeIndex, fixturePos)
	{
		var x = fixturePos.x + this.roll1d(3) - 2;
		if (x < 0) x = 0; 
		else if (x > this.worldWidth) x = this.worldWidth;
		console.log(x);
		this.itemArray[this.itemArray.length] = new this.ItemObj(itemTypeIndex, x);
		this.drawItems();
	}
	
	
	this.actorTakeItem = function (actorIndex, itemIndex) 
	{
		var actor = this.actorArray[actorIndex];
		if (actor.inventorySlots > actor.inventoryArray.length) {
			var item = this.itemArray[itemIndex];
			item.carriedByActorIndex = actorIndex;
			actor.inventoryArray.push(itemIndex);
			item.$elt.hide(120);
			if (actorIndex == 0) {
				this.refreshInventory();
				this.playSound("pickup");
			} else {
				// *** refresh NPC to show he's carrying something
			}
			return 1;
		} else {
			return 0;
		}
	}
	
	
	this.actorDropItem = function (actorIndex, itemIndex)
	{
		// ***
	
	
	}
	
	
	this.changeActorFacing = function (actorIndex, facingValue) 
	{
		var actor = this.actorArray[actorIndex];
		if (actor.facing != facingValue) {
			actor.facing = facingValue;
			if (facingValue > 0) {
				actor.$elt.removeClass("facingLeft").addClass("facingRight");
			} else if (facingValue < 0) {
				actor.$elt.removeClass("facingRight").addClass("facingLeft");
			}
		}
	}
	


	/* ========================================================= U . I. - Updates / Refreshes ===================== */

	this.drawTerrain = function ()
	{
		var o = this;
		//o.$nearRoad
		//o.$farRoad
		var $ground1 = o.$nearRoad.find('div.foreground');
		var ground1Paper = Raphael($ground1[0], 10000, 1000);
		/*var circle = ground1Paper.circle(0, 1000, 1000);
		circle.attr("fill", "#f00");
		*/
		var pathString = "M0,1000";
		for (var i = 0; i <= this.worldWidth; i++) {
			pathString += "L" + (i * o.cssXMultiplier) + "," + (o.cssYBase - o.terrainPositiveArray[i].height);
		}
		pathString += "L" + (this.worldWidth * o.cssXMultiplier) + ",1000";
		console.log(pathString);
		var ground1Path = ground1Paper.path(pathString);
		ground1Path.attr({ "stroke" : "#000", "stroke-width" : 3, "fill" : "#fff" });
	}
	

	this.refreshActorsColor = function () {
		for (var i = 0; i < this.actorArray.length; i++) {
			var actor = this.actorArray[i];
			//console.log(actor);
			actor.$elt.find('span.mood').css({
				"background-color" : "rgba(" + Math.round(actor.color.r) + "," + Math.round(actor.color.g) + "," + Math.round(actor.color.b) + ",0.9)"
				//"background-color" : "rgba(0,0,0,0.9)"
			});	
		}
		//console.log("updated");
	}

	
	this.drawActors = function () {
		for (var i = 0; i < this.actorArray.length; i++) {
			this.drawActor(i);
		}
	}
	this.drawActor = function (actorIndex) 
	{
		var o = this;
		var actor = o.actorArray[actorIndex];
		var cssPos = o.getCSSPosition(actor.pos, actor.size);	
		// See if actor div exists
		var $actor = actor.$elt;
		if ($actor.length == 0) {
			$actor = $('<div class="actor" id="actor-' + actor.actorId + '"><span class="mood"></span></div>');
			actor.$elt = $actor;
			$actor.css({
				"top" : 	cssPos.top
				,"left" : 	cssPos.left
				//,"background-color" : "rgba(" + actor.color.r + "," + actor.color.g + "," + actor.color.b + ",0.7)"
			}).appendTo( o.$nearEntities );
		} else {
			$actor.stop().animate({ 
				"top" : 	cssPos.top
				,"left" : 	cssPos.left
			}, 190);
		}
		/*
		$actor.find('span.mood').css({
			"background-color" : "rgba(" + actor.color.r + "," + actor.color.g + "," + actor.color.b + ",0.9)"
		});	
		*/
	}
	
	
	this.drawFixtures = function () 
	{
		var o = this;
		for (var i = 0; i < o.fixtureArray.length; i++) 
		{
			var fixture = o.fixtureArray[i];
			//console.log(fixture);
			var fixtureType = o.fixtureType[fixture.typeIndex];
			var cssPos = o.getCSSPosition(fixture.pos, fixtureType.size);
			var $fixture = fixture.$elt;
			if ($fixture.length == 0) {
				$fixture = $('<div class="fixture ' + fixtureType.classString + '"></div>');
				fixture.$elt = $fixture;
				$fixture.css({
					"top" : 	cssPos.top
					,"left" : 	cssPos.left
					,"width" :	fixtureType.size.x + "px"
					,"height" :	fixtureType.size.y + "px"
				}).appendTo( o.$nearEntities );
			} else {
				$fixture.stop().animate({ 
					"top" : 	cssPos.top
					,"left" : 	cssPos.left
				}, 200);
			}
		}
	}
	
	this.animateFixture = function (fixtureIndex) 
	{
		var o = this;
		console.log("Animate fixture");
		var $fixture = o.fixtureArray[fixtureIndex].$elt;
		var fixturePos = $fixture.position();
		$fixture.stop().animate({ 
			"top" : 	(fixturePos.top + 10) + "px"
			,"left" : 	(fixturePos.left + o.rollBell(10)) + "px"
		}, 150, function(){
			$fixture.stop().animate({ 
				"top" : 	fixturePos.top
				,"left" : 	fixturePos.left
			}, 50);
		});
	}
	
	this.drawItems = function () 
	{
		var o = this;
		for (var i = 0; i < o.itemArray.length; i++) 
		{
			var item = o.itemArray[i];
			//console.log(fixture);
			var itemType = o.itemType[item.typeIndex];
			var cssPos = o.getCSSPosition(item.pos, itemType.size);
			var $item = item.$elt;
			if ($item.length == 0) {
				$item = $('<div class="item ' + itemType.classString + '"></div>');
				item.$elt = $item;
				$item.css({
					"top" : 	cssPos.top
					,"left" : 	cssPos.left
					,"width" :	itemType.size.x + "px"
					,"height" :	itemType.size.y + "px"
				}).appendTo( o.$nearEntities );
			} else {
				$item.stop().animate({ 
					"top" : 	cssPos.top
					,"left" : 	cssPos.left
				}, 200);
			}
		}
	}		
	
	
	this.moveMap = function (movePos)
	{
		var o = this;
		var mapPos 			= o.$map.position();
		var characterPos 	= o.actorArray[0].$elt.position();
		var mapFrameWidth 	= o.$mapFrame.width();
		var charLeftRelativeToFrame = characterPos.left + mapPos.left;
		
		//console.log("mapPos.left = " + mapPos.left + ", characterPos.left = " + characterPos.left + ", " + charLeftRelativeToFrame);
		var shouldMove = (charLeftRelativeToFrame > (mapFrameWidth/3)) && movePos.x > 0;
		shouldMove = shouldMove || ((charLeftRelativeToFrame < (mapFrameWidth * (2/3))) && movePos.x < 0 );
		if (shouldMove) {
			var top = (mapPos.top + movePos.y);
			var left = (mapPos.left - (movePos.x * o.cssXMultiplier));
			if (left > 0) left = 0;
			o.$map.stop().animate({
				"top" :		top + "px"
				,"left" :	left  + "px"
			}, 200);
		}
	}
	
	
	
	this.moveCharacter = function (movePos) 
	{
		var didMove = this.moveActor(0, movePos);
		if (didMove) {
			this.moveMap(movePos);
			this.playSound("footsteps");
		} else {
			this.playSound("bump");
		}
	}
	
	this.moveActor = function (actorIndex, movePos)
	{
		var o = this;
		var didMove = false;
		var actor = o.actorArray[actorIndex];
		var newPos = o.sumPositions(actor.pos, movePos);
		if (newPos.x < 0) newPos.x = 0;
		else if (newPos.x >= o.worldWidth) newPos.x = o.worldWidth;
		var newPosTerrain = o.terrainPositiveArray[newPos.x];
		if (typeof newPosTerrain === 'undefined') console.log(newPos.x);
		newPos.y = newPosTerrain.height;
		
		//console.log("newPos.y = " + newPos.y + ", actor.pos.y = " + actor.pos.y);
		if (newPos.y > (actor.pos.y + 100)) {
			// Cannot move there..dddddddd. Too steep!
			//console.log("Too steep!");
			o.animateActorMoveFail(actorIndex);
			//if (actorIndex == 0) 
			console.log("Too steep! " + actorIndex);
			return false;
		} else {
			// Is there one or more people already in the spot you're trying to go?
			if (newPosTerrain.actorIndexArray.length > 1) {
				// Already two people, so we cannot move there
				o.animateActorMoveFail(actorIndex);
				if (actorIndex == 0) console.log("Too many people at that spot!");
				return false;
			} else if (newPosTerrain.actorIndexArray.length == 1) {
				// If mood is NOT positive
				if (o.getColorMoodByActorIndex(newPosTerrain.actorIndexArray[0], actorIndex) <= 0) {
					// Cannot pass someone who's not friendly
					o.animateActorMoveFail(actorIndex);
					if (actorIndex == 0) console.log("Cannot pass unfriendly NPC!");
					return false;
				}		
			}
		}
		actor.lastPos 	= { x: actor.pos.x, y: actor.pos.y, z: actor.pos.z};
		actor.pos 		= { x: newPos.x, y: newPos.y, z: newPos.z};
		o.drawActor(actorIndex);		
		return true;
	}
	
	this.moveBackActor = function (actorIndex)
	{
		var actor = this.actorArray[actorIndex];
		actor.pos 	= { x: actor.lastPos.x, y: actor.lastPos.y, z: actor.lastPos.z};
		this.drawActor(actorIndex);
	}
	
	this.animateActorMoveFail = function (actorIndex) {
		this.animateActorJump(actorIndex);
	}
	
	this.animateActorJump = function (actorIndex) {
		var o = this;
		var didMove = false;
		var actor = o.actorArray[actorIndex];
		var aPos = actor.$elt.position();
		actor.$elt.animate({
			top : (aPos.top - 10) + "px"
		}, 80, function(){
			actor.$elt.animate({
				top : aPos.top + "px"
			}, 80);
		});
	}
	
	
	this.animateActorTalking = function (actorIndex, sizeMultiplier) 
	{
		var o = this;
		this.animateActorJump(actorIndex);
		var startSize = 50;
		var endSize = 200;
		if (typeof sizeMultiplier !== 'undefined') {
			startSize = startSize * sizeMultiplier;
			endSize = endSize * sizeMultiplier;
		}
		var actor = o.actorArray[actorIndex];
		var actorPos = actor.$elt.position();
		var actorCenterX = (actorPos.left + (actor.size.x/2));
		var actorCenterY = (actorPos.top + (actor.size.y/3));
		var talkCircle = o.aura1Paper.circle( actorCenterX, actorCenterY, startSize);
		console.log(o.aura1Paper);
		console.log(talkCircle);
		var actorColor = "rgb(" + Math.round(actor.color.r) + "," + Math.round(actor.color.g) + "," + Math.round(actor.color.b) + ")";
		talkCircle.attr({ "stroke" : "#000", "fill" : actorColor, "fill-opacity" : 0.5 });
		talkCircle.animate({ opacity : 0, r: endSize}, 500, function(){
			talkCircle.remove();
		});
		o.playSound("jibber");
	}
	
	this.blowActorBubble = function(actorIndex, text)
	{
		var o = this;
		var actor = o.actorArray[actorIndex];	
		var actorPos = actor.$elt.position();
		var $bubble = $('<div class="bubble">' + text + '</div>').css({
			top : 	(actorPos.top - 40)
			,left :	(actorPos.left - 20)
		}).appendTo( o.$dialog );
		$bubble.animate({
			top : (actorPos.top - 140)
		}, 2000, function(){
			$bubble.remove();
		});
	}

	
	this.refreshInventory = function ()
	{
		var o = this;
		var character = o.actorArray[0];
		var $invSlots = o.$inventory.find('ol > li');
	
		for (var i = 0; i < 9; i++) {
			if (character.inventoryArray.length > i) {
				var invItemType = o.itemType[o.itemArray[character.inventoryArray[i]].typeIndex];
				$invSlots.eq(i)
					.removeClass("empty")
					.addClass("item")
					.addClass(invItemType.classString);
			} else {
				// *** this is inefficient
				$invSlots.eq(i).removeClass().addClass("empty");
			}
		}
		$invSlots.removeClass("readied");
		$invSlots.eq(character.readiedItem).addClass("readied");
	}
	

	this.refreshStats = function ()
	{
		var o = this;
		var hearts = Math.ceil(o.actorArray[0].maxHealth / 2);
		var currentHealth = o.actorArray[0].health;
		var healthHtml = "";
		for (var h = 1; h <= hearts; h++) {
			if ((currentHealth / 2) >= h) {
				healthHtml += '<li class="full"></li>';
			} else if ((currentHealth / 2) > (h-1)) {
				healthHtml += '<li class="half"></li>';
			} else {
				healthHtml += '<li class="empty"></li>';
			}
		}
		var percent = parseInt((o.numOfAllies / (o.numOfActors - 1))*100);
		healthHtml = '<ul class="hearts">' + healthHtml + '</ul>';
		healthHtml += '<div class="meter"><div style="width:' + percent + '%"><span>';
		healthHtml += percent + '%</span></div></div>';
		healthHtml += 'Allies: ' + o.numOfAllies + " / " + (o.numOfActors - 1);
		o.$stats.html(healthHtml);
	}
	
	/* ====================================================================================== */
	/* ====================================  Game Loops  ==================================== */
	
	this.togglePause = function () {
		if (this.isPaused) 	this.doMainLoop();
		else 				this.pause();
	}
	this.pause = function () {
		clearTimeout(this.loopTimer);
		this.isPaused = true;
	}
	this.doMainLoop = function () {
		var o = this;
		this.isPaused = false;
		o.loopTimer = setTimeout( function(){ o.mainLoop(); }, o.baseTickTime );
	}
	this.unpause = this.doMainLoop;
	
	this.mainLoop = function () 
	{
		var o = this;
		o.tickCount++;

		var character = o.actorArray[0];
		
		// loop vars
		var a, t, i;
		o.numOfActors = o.actorArray.length;
		o.numOfAllies = 0;
		
		// Loop through NPCs and move them
		for (var a = 1; a < o.numOfActors; a++) 
		{
			var npc = o.actorArray[a];
			// Figure out mood, save it, count it, and blow a bubble
			var m = o.getColorMoodByActorIndex(0, a);
			if (npc.mood != m) {
				npc.mood = m;
				o.blowActorBubble( a, o.getMoodName(m) );
			}
			if (m >= 2) o.numOfAllies++;
			// A 6 on 1d6 means the NPC moves on this tick
			if (o.roll1d(6) == 6) {
				var newX = 0;
				// Rules:
				// 	+2 Allies move towards you
				// 	+1 Friends move randomly
				// 	0 Neutral move randomly
				// 	-1 Unfriends move away from you
				// 	-2 Enemies move towards you (to be hostile!)
				var diff = character.pos.x - npc.pos.x;
				var absDiff = Math.abs(diff);
				if (m == 2 && absDiff <= 8 && absDiff >= 2) {
					newX = (diff / absDiff);
				} else if (m == -2 && absDiff <= 8) {
					newX = (diff / absDiff);
				} else if (m == -1 && absDiff <= 6) {
					newX = (diff / absDiff) * -1;	// reverse direction
				} else {
					newX = (o.roll1d(3) - 2);
				}
				var movePos = { x : newX, y : 0 };
				o.moveActor(a, movePos);
				o.changeActorFacing(a, movePos.x);
			}

		}
		// Move the character
		if (o.isMovingLeft) {
			//o.actorArray[0].velocity.x = -1;
			o.moveCharacter({ x : -1, y : 0 });
			o.changeActorFacing(0, -1);
		} else if (o.isMovingRight) {
			//o.actorArray[0].velocity.y = -1;
			o.moveCharacter({ x : 1, y : 0 });
			o.changeActorFacing(0, 1);
		}
		// Reset button styles
		//o.$controlButtons.removeClass("activated");
		
		// Figure out who & what is where
		for (t = 0; t < o.terrainPositiveArray.length; t++) {
			// Clear the terrain's arrays 
			o.terrainPositiveArray[t].actorIndexArray = [];
			o.terrainPositiveArray[t].itemIndexArray = [];
		}
		for (a = 0; a < o.numOfActors; a++) {
			var actorX = o.actorArray[a].pos.x;
			o.terrainPositiveArray[actorX].actorIndexArray.push(a);
		}
		for (i = 0; i < o.itemArray.length; i++) {
			// Record only items not being carried
			if (o.itemArray[i].carriedByActorIndex < 0) {
				var itemX = o.itemArray[i].pos.x;
				o.terrainPositiveArray[itemX].itemIndexArray.push(i);
			}
		}
		// Loop through terrain again and see if there are any actors intersecting with items
		var intersections = 0;
		var takenitems = 0;
		for (t = 0; t < o.terrainPositiveArray.length; t++) {
			var terrain = o.terrainPositiveArray[t];
			if (terrain.actorIndexArray.length > 0 && terrain.itemIndexArray.length > 0)
			{
				intersections++;
				// *** This should be improved; it doesn't take into account full
				// *** ...inventories and multiple actors and items on the same spot
				takenitems += o.actorTakeItem(terrain.actorIndexArray[0], terrain.itemIndexArray[0]);
			}
			// Is there more than one person on an X location?
			if (terrain.actorIndexArray.length > 1) {
				
				// *** This only handles 2 people colliding, not more than 2... Expand this
				if (o.getColorMoodByActorIndex(terrain.actorIndexArray[0], terrain.actorIndexArray[1]) > 0) {
				
				} else {
					console.log("More than one person on a spot! They're unfriendly so they're moving back.");
					o.moveBackActor(terrain.actorIndexArray[0]);
					o.moveBackActor(terrain.actorIndexArray[1]);
				}
			}
		}
		//console.log(intersections + ", " + takenitems);
		//o.drawActors();
		o.refreshActorsColor();
		o.refreshStats();
		// Check for progress towards winning!
		if (!o.isHalfWon && (o.numOfAllies > ((o.numOfActors - 1)/2))) {
			o.isHalfWon = true;
			o.openSection(o.$progress);	
		} else if (!o.isWon && (o.numOfAllies >= (o.numOfActors - 1))) {
			o.isWon = true;
			o.actorArray[0].$elt.addClass("crowned");
			o.openSection(o.$win);
		} else {
			o.doMainLoop();
		}
	}

	this.openSection = function ($section) {
		this.pause();
		$section.fadeIn(500);
	}
	
	this.closeSection = function ($section) {
		var o = this;
		$section.fadeOut(1000, function(){
			o.unpause();
		});
	}
	

	//=== Ignition!
	this.start = function () {
		var o = this;
		$(document).ready(function(){
			var isMinimalism = (location.hash == '#minimalism');
			var isMusicOnAtStart = (location.hash != '#nomusic');
			//alert(location.hash + isMusicOnAtStart);
			if (isMinimalism) {
				$('#mainStylesheet').attr("href", "css/minimalism.css");
				o.heightVariation = 0;
			}
			o.loadTerrain();
			o.loadFixtures();
			o.loadActors();
			o.loadItems();
			o.setupUI();
			o.drawFixtures();
			o.drawActors();
			o.drawTerrain();
			o.drawItems();
			o.readyInventoryItem(0);
			if (!isMinimalism) {
				o.$intro.show();
				o.openSection(o.$intro);
			} else {
				o.unpause();
			}
			if (isMusicOnAtStart) {
				o.playMusic();
			}
		});
	}

	

	
	
	/* ========================================================= U . I. - Run Once / Setup ======================== */
	this.setupUI = function () 
	{
		var o = this;
		this.$game 		= $('#game');
		this.$mapFrame	= this.$game.find('div.mapFrame');
		this.$stats 	= this.$game.find('div.stats');
		this.$inventory = this.$game.find('div.inventory');
		this.$menu 		= this.$game.find('div.menu');
		this.$intro 	= this.$game.find('div.intro');
		this.$progress	= this.$game.find('div.progress');
		this.$win 		= this.$game.find('div.win');
		this.$controls 	= this.$game.find('div.controls');
		this.$map 		= this.$mapFrame.find('div.map');
		this.$sky		= this.$map.find('div.sky');
		this.$farRoad	= this.$map.find('div.farRoad');
		this.$nearRoad	= this.$map.find('div.nearRoad');
		this.$dialog	= this.$map.find('div.dialog');
		this.$nearEntities = this.$nearRoad.find('div.entities');
		this.$controlButtons = this.$controls.find('button');

		var $aura1 = o.$nearRoad.find('div.aura');
		this.aura1Paper = Raphael($aura1[0], 10000, 600);
		
		// Intro Buttons
		//this.$intro.find('button.play').on("click", function(e){
			this.$intro.on("click", function(e){
			o.closeSection(o.$intro);
		});	
		
		// Menu Buttons
		this.$menu.find('button.playMin').on("click", function(e){
			if (confirm("You will lose your current game if you restart. Is this okay?")) {
				window.location = 'game.html#minimalism';
				window.location.reload(true);
			}
		});			
		this.$menu.find('button.sound').on("click", function(e){
			var isSoundOn = o.toggleSound();
			alert("Sound effects are now " + ((isSoundOn) ? "ON" : "OFF") + ".");
		});
		this.$menu.find('button.music').on("click", function(e){
			var isMusicOn = o.toggleMusic();
			alert("Music is now " + ((isMusicOn) ? "ON" : "OFF") + ".");
		});		
		this.$menu.find('button.help').on("click", function(e){
			o.closeSection(o.$menu);
		});
		this.$menu.find('button.return').on("click", function(e){
			o.closeSection(o.$menu);
		});

		// Win / Progress Buttons
		this.$win.find('button.return').on("click", function(e){
			o.closeSection(o.$win);
		});
		this.$progress.find('button.return').on("click", function(e){
			o.closeSection(o.$progress);
		});		
		
		// Handle control buttons same as hitting the key
		$('.btn-A').on("mousedown touchstart", function(e){
			o.isMovingLeft = true;
			o.changeActorFacing(0, -1);			
		}).on("mouseup mouseout touchend", function(e){
			o.isMovingLeft = false;
		});
		$('.btn-D').on("mousedown touchstart", function(e){
			o.isMovingRight = true;
			o.changeActorFacing(0, 1);		
		}).on("mouseup mouseout touchend", function(e){
			o.isMovingRight = false;
		});
		$('.btn-ESC').on("click", function(e){
			o.openSection(o.$menu);
		});
		$('.btn-SPACE').on("click", function(e){
			o.activateReadiedInventoryItem();
		});
		$('.btn-E').on("click", function(e){
			o.activateTalk(0);
		});
		
		// Inventory Buttons, handle same as hitting the key
		this.$inventory.find("ol > li").on("click", function(e){
			o.readyInventoryItem( (parseInt($(this).html()) - 1) );
		});
		
		
		$(document).keydown(function(e){
			switch(e.which) {
				case 65:	// "a"
				case 37:	// Left
					o.isMovingLeft = true;
					$('.btn-A').addClass("activated");
					o.changeActorFacing(0, -1);
				break;
				case 38:
					//console.log("Up");
					//o.moveCharacter({ x : 0, y : 0 });
				break;
				case 68:	// "d"
				case 39:	// Right
					o.isMovingRight = true;
					$('.btn-D').addClass("activated");
					o.changeActorFacing(0, 1);
				break;
				case 40:
					//console.log("Down");
					//o.moveCharacter({ x : 0, y : 0 });
				break;
				case 16:	// Shift
				break;
				case 32:	// Space
					$('.btn-SPACE').addClass("activated");
				break;
				case 69:	// "e"
					$('.btn-E').addClass("activated");
				break;
				case 27:	// ESC
					$('.btn-ESC').addClass("activated");
				break;
				case 80:	// "p"
					o.togglePause();
				break;

				default: return; // allow other keys to be handled
			}

			// prevent default action (eg. page moving up/down)
			// but consider accessibility (eg. user may want to use keys to choose a radio button)
			e.preventDefault();		
		});
		
		$(document).keyup(function(e){
			//console.log("Key up - " + e.which);
			switch(e.which) {
				case 65:	// "a"
				case 37:	// Left
					o.isMovingLeft = false;
					$('.btn-A').removeClass("activated");
				break;
				case 38:	// Up
				break;
				case 68:	// "d"
				case 39:	// Right
					o.isMovingRight = false;
					$('.btn-D').removeClass("activated");
				break;
				case 40:	// Down
				break;
				case 16:	// Shift

				break;
				case 32:	// Space
					o.activateReadiedInventoryItem();
					$('.btn-SPACE').removeClass("activated");
				break;
				case 67:	// "c"
					// Crafting
				break;
				case 69:	// "e"
					o.activateTalk(0);
					$('.btn-E').removeClass("activated");
				break;
				case 88:	// "x"
					// ?
				break;	
				case 81:	// "q"
					// ?
				break;
				case 90:	// "z"
					// ?
				break;
				case 27:	// ESC
					o.openSection(o.$menu);
					$('.btn-ESC').removeClass("activated");
				break;					
				case 49:	// 1
				case 50:	// 2
				case 51:	// 3
				case 52:	// 4
				case 53:	// 5
				case 54:	// 6
				case 55:	// 7
				case 56:	// 8
				case 57:	// 9
					o.readyInventoryItem(e.which - 49);
				break;
				default: return; // allow other keys to be handled
			}
			// prevent default action (eg. page moving up/down)
			// but consider accessibility (eg. user may want to use keys to choose a radio button)
			e.preventDefault();		
		});
		
	}

	
	
	/* =========================================================  Sound  ============================== */

	this.isSoundOn = true;
	this.isMusicOn = true;
	this.musicSoundName = "glassian";
	
	this.toggleSound = function (forceSound) {
		if (typeof forceSound === 'boolean') 	this.isSoundOn = forceSound;
		else									this.isSoundOn = (this.isSoundOn) ? false : true;
		return this.isSoundOn;	
	}
	
	this.toggleMusic = function (forceMusic) {
		if (typeof forceMusic === 'boolean') 	this.isMusicOn = forceMusic;
		else									this.isMusicOn = (this.isMusicOn) ? false : true;
		if (this.isMusicOn)	this.playMusic();
		else				this.pauseMusic();
		return this.isMusicOn;	
	}

	this.sounds = {
		"attack" 		: new Audio("sounds/attack_1.mp3")
		,"bump" 		: new Audio("sounds/bump_1.mp3")
		,"footsteps" 	: new Audio("sounds/footsteps_1.mp3")
		,"jibber1" 		: new Audio("sounds/jibber1.mp3")
		,"jibber2" 		: new Audio("sounds/jibber2.mp3")
		,"jibber3" 		: new Audio("sounds/jibber3.mp3")
		,"jibber4" 		: new Audio("sounds/jibber4.mp3")
		,"pickup" 		: new Audio("sounds/pickup_chime_1.mp3")
		,"woodchop" 	: new Audio("sounds/wood_chop_1.mp3")
		,"glassian"		: new Audio("sounds/Glassian.mp3")
	}
	this.sounds["jibber1"].volume = 0.6;
	this.sounds["jibber2"].volume = 0.6;
	this.sounds["jibber3"].volume = 0.6;
	this.sounds["jibber4"].volume = 0.6;
	this.sounds["glassian"].volume = 0.4;
	
	this.playMusic = function () {
		this.sounds[this.musicSoundName].loop = true;
		this.sounds[this.musicSoundName].play();
	}
	this.pauseMusic = function () {
		this.sounds[this.musicSoundName].pause();
	}	
	
	this.playSound = function (soundName, isLooped)
	{
		var o = this;
		if (o.isSoundOn) {	
			if (soundName == "jibber") {
				soundName += o.roll1d(4);
			}		
			if (typeof o.sounds[soundName] === 'undefined') {
				console.log("Sound does not exist: " + soundName);
				return false;
			} else {
				if (typeof isLooped === 'boolean') o.sounds[soundName].loop = isLooped;
				o.sounds[soundName].play();
				return true;
			}
		} else {
			return false;
		}
	}
	

	/* =========================================================  Helper Functions  ============================== */
	this.roll1d = function (sides) {
		return (Math.floor(Math.random()*sides) + 1);
	}
	this.rollBell = function (sides) {
		return (this.roll1d(sides) - this.roll1d(sides));
	}


}

var dg = new GameObj();
dg.start();



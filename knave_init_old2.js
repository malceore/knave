// Knave 1.0.3
// Created by Brandon T. Wood on December 1st, 2013
// Knave is meant to be a combination Incremental Game and MMORPG, combining
//	the best aspects of both to make a fun browser based hybrid people
//	can pour their free time into. 


//GLOBAL VARS, sometime gonna make them all capitalized!
var stage;
var areaBackground;
var map;
var doors;
var outDoor;
var currentArea = [];
var INDEX = 0;
var kills = 0;
var gold = 0;
var ready = 0; // Acts as a Semaphore to the loaded jsons.

//Calls all the initial methods needed to setup and play the game.
function init(){

	//This needs to be before any PIXI code. Stops Antialiasis
        PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

	//	Loads json and javascript file to load the first area background and monsters. 
	//sets up stage for combat and places all the assets loaded onto the map
	//var ready = 0; // Acts as a Semaphore to the loaded jsons.
	console.log("Calling load!");
	load("sprite.json"); //Has too be called separately on all JSONs

	//      Maybe an area object with a background, number of monster 
	// needed to kill and list of monster objects generated inside of it
	// First area must be loaded in before the game loop, every level after
	// that will be loaded upon completion of the current one. 
}


//This load function will load any and all files nessisary before the game can run.
function load(json){

        ready++;

	//Gonna load those sprites as PIXI objects
        var loader = new PIXI.JsonLoader(json);
       	loader.on('loaded', function(evt) {

               	evt.content.json
               	console.log("Load Successful!");
               	ready--;;
		if(ready <= 0){

			console.log("Calling setup!");
			setup();
		}
       	});
       	loader.load();
}


//This function will construct everything in the game and start the loop when complete.
function setup(){
//function loadLevel(name, type, numDoors, prev, next){
	//This stuff is just needed to setup the canvas and such.
        stage = new PIXI.Stage(0x50503E);
        var renderer = PIXI.autoDetectRenderer(1246, 680);
        document.body.appendChild(renderer.view);

	//This is the large background piece on the left.
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0x757585);
        //graphics.lineStyle(10, 0xACACB6, 1);
        graphics.drawRect(20, 150, 930, 340);

        graphics.endFill();
        graphics.interactive = true;
        graphics.buttonMode = true;
	stage.addChild(graphics);


//temp, So background will be the floor texture. while the wall in teh backgorund is printed using a loop and plans from the area object.
	var BG = PIXI.Texture.fromImage("dungeon_bg1.png");
	areaBackground = new PIXI.Sprite(BG);
	areaBackground.position.x = 20;
	areaBackground.position.y = 20;
        areaBackground.scale.x = 6.1;
	areaBackground.scale.y = 8.1;
	stage.addChild(areaBackground);
//

	//This is all the upgrades button, the panel on the right.
        var button = new PIXI.Graphics();
        button.beginFill(0x757585);
        button.lineStyle(10, 0xACACB6, 1);
        button.drawRect(930, 150, 295, 340);
        button.endFill();
        button.interactive = true;
        button.buttonMode = true;
        stage.addChild(button);

	//Here is where teh player Character is setup.
        var texture = PIXI.Texture.fromImage("char.PNG");
        var char = new PIXI.Sprite(texture);
	char.position.x = 100;
	char.position.y = 375;
        char.anchor.x = 0.5;
        char.anchor.y = 0.5;
        char.scale.x = char.scale.y = 2;
	stage.addChild(char);
	
	//Setting up upgrades
	var firstUpgrade = new upgrade();	

//TEMP 
	//Instead I'm just gonna leave the area descriptors inside the file
	map = [{"name":"dungeon1", "type":"dungeon", "doors":2, "prev":"NULL", "next":"dungeon2"},
		{"name":"dungeon2", "type":"dungeon", "doors":3, "prev":"dungeon1", "next":"forest1"},
                {"name":"forest1", "type":"dungeon", "doors":5, "prev":"dungeon2", "next":"dungeon3"},
                {"name":"dungeon3", "type":"dungeon", "doors":6, "prev":"forest1", "next":"dungeon4"},
                {"name":"dungeon4", "type":"dungeon", "doors":7, "prev":"dungeon3", "next":"forest2"},
		{"name":"forest2", "type":"forest", "doors":8, "prev":"dungeon4", next:"NULL"}];
//
	console.log("MADE I T " + map[0].name);

	var currentArea = new area(map[INDEX].name, texture, map[INDEX].type, map[INDEX].doors, map[INDEX].prev, map[INDEX].next);
	//loadLevel(map[INDEX].name, map[INDEX].type, map[INDEX].doors, map[INDEX].prev, map[INDEX].next);
	//loadLevel();

	console.log("MADE IT HERE TOO!");

	//var kills = 0;
	doors = [];//["door1", "door2", "door3"];
	// This entire door loop is a messand needs to be redone cleverly, right now it just floats a sprite over 
	//	the last opened door. All doors should stay open in fial product.
	var texture;



	//loadLevel(currentArea.name, currentArea.type, map, currentArea.doors, currentArea.prev, currentArea.next);

        for(var i=0; i<currentArea.doors; i++){ // The number of these should be saved into the area and loaded.

		//texture = PIXI.Texture.fromImage("dungeon_door_1.png");
		// create a new Sprite using the texture
		//doors[i] = new PIXI.Sprite(texture);
		texture = PIXI.Texture.fromImage("dungeon_door_1.png");
                doors[i] = new PIXI.Sprite(texture);

                doors[i].position.x = (20 + 130 * i);
                doors[i].position.y = 20;
                doors[i].scale.x = doors[i].scale.y = 8.1;

                //Tint starts on spawn to let you know you can't open this door yet.
                doors[i].tint = 0x999966;
                stage.addChild(doors[i]);
		doors[i].click = function (e) {

			var door = currentArea.door;
                	currentArea.door.openDoor();

                	//Prints out what type of door is secretly was.
                	console.log(currentArea.door.currentDoor);

			//Hold y position to place on new image.
			//var holder = this.position.y;

                	//Gotta remove before we can add.
                	//stage.removeChild(doors[i]);

                	//Next we change the image based on what type of door and add affect
                	if(door.currentDoor == "Treasure"){

                	        var texture = PIXI.Texture.fromImage("dungeon_door_gold.png");
                	        // create a new Sprite using the texture
                	        doors[i] = new PIXI.Sprite(texture);
                	        gold += 30;
                	}else if(door.currentDoor == "Trap"){

                	        var texture = PIXI.Texture.fromImage("dungeon_door_trap.png");
                	        // create a new Sprite using the texture
                	        doors[i] = new PIXI.Sprite(texture);
                	        console.log("  (Would take away health!)");
                	}else if(door.currentDoor == "Monster"){

                	        var texture = PIXI.Texture.fromImage("dungeon_door_empty.png");
                	        // create a new Sprite using the texture
                	        doors[i] = new PIXI.Sprite(texture);
                	        console.log("  (Would add monster to queue! But is empty..)");    
                	}
                	doors[i].scale.x = doors[i].scale.y = 8.1;
                	stage.addChild(doors[i]);
			doors[i].position.y = 20;
			doors[i].position.x = this.position.x;//(20 + 130 * this.position.x);
               		this.interactive = false;
			doors[i].interactive = false;
                	document.getElementById("demo").innerHTML = gold + " GP";
		}
        }

        doorOut = new PIXI.Sprite(texture);
        doorOut.position.x = (20 + 130 * i);
        doorOut.position.y = 20;
        doorOut.scale.x = doorOut.scale.y = 8.1;
        //Tint starts on spawn to let you know you can't open this door yet.
        doorOut.interactive = false;
        doorOut.buttonMode = false;
        doorOut.tint = 0x999966;
        stage.addChild(doorOut);
	doorOut.click = function (e) {

                INDEX++;
		//texture = PIXI.Texture.fromImage("dungeon_door_1.png");
                //currentArea = new area(map[INDEX].name, texture, map[INDEX].type, parseInt(map[INDEX].doors), map[INDEX].prev, map[INDEX].next);
                //update();

                //Gotta reload all doors and level assets.
                kills = 0;
                //doorOut.interactive = false;
                //doorOut.buttonMode = false;

		//console.log("Reloading level!");
                //loadLevel(currentArea.name, currentArea.type, map, currentArea.doors, currentArea.prev, currentArea.next);
		//loadLevel();		
		
		//console.log("Reloading level!");
		//Firstly we create a new area.
		//currentArea = new area(map[INDEX].name, texture, map[INDEX].type, parseInt(map[INDEX].doors), map[INDEX].prev, map[INDEX].next);
		//update();
		
		//Gotta reload all doors and level assets.
		//kills = 0;
        	//doorOut.interactive = false;
        	//doorOut.buttonMode = false;
		//loadLevel(map[INDEX].name, map[INDEX].type, map[INDEX].doors, map[INDEX].prev, map[INDEX].next);
		//console.log("Complete!");
	}




	var currentMonster = currentArea.monster;
	currentMonster.getNewMonster();
	var monster = PIXI.Sprite.fromFrame(currentMonster.sprite);
        monster.scale.x = monster.scale.y = 6;
        monster.position.x = 200;
        monster.position.y = 360;
        stage.addChild(monster);

	//Monster Name
	var name = new PIXI.Text(currentMonster.name, {font:"bold 20px sans-serif", fill:"maroon", align:"center"});
	name.position.x = 210;
	name.position.y = 330;
	stage.addChild(name);

	//Creating Monster Health Bar
	var health = 5;
        var bar = new PIXI.Graphics();
        bar.beginFill(0xCC0000);
        bar.lineStyle(8, 0x999966, 1);
	bar.drawRect(215,460,(6/100)*800,14)
        stage.addChild(bar);

	var currentHealth = 6;
	var totalHealth = 6;
	var health = 6;
	//var gold = 0;	
	var areaNum = 0;
	//var kills = 0;
	console.log("Setup successful!\nGame Start!");
	update();

	function update(){

		//     Check to see if monster health is equal or less than 0,
		// if so he is dead, if it is the last number of monster 
		// needed to be killed to unlock the next area then load next 
		// area and spit out the gold and load a new one.
                if(currentHealth <= 0){

                        gold += totalHealth;
			kills++;

			currentMonster.getNewMonster();
			console.log("Defeated, " + currentMonster.sprite);
			stage.removeChild(monster);
		        monster = PIXI.Sprite.fromFrame(currentMonster.sprite);

		        monster.scale.x = monster.scale.y = 6;
        		monster.position.x = 200;
        		monster.position.y = 360;
			stage.addChild(monster);

			document.getElementById("demo").innerHTML = gold + " GP";

			//Reset Health and health Bar
			totalHealth = currentMonster.health;
			currentHealth = totalHealth; 
			health = totalHealth;

			//bar.drawRect(215,460,(currentHealth/100)*800, 14);
			stage.removeChild(bar);
			bar = new PIXI.Graphics();
        		bar.beginFill(0xCC0000);

        		bar.lineStyle(8, 0x999966, 1);
        		bar.drawRect(215,460,(health/100)*800,14)
			stage.addChild(bar);

			//Change Name
			name.setText(currentMonster.name);

			//Checking to see if reached enough kills to unlock a door.
        		console.log(currentArea.doors);
        		var temp = (kills / 3) - 1;
        		if((temp < parseInt(currentArea.doors)) && ((kills % 3) == 0)){

                		console.log("Killed enough! " + temp);
                		doors[temp].tint = 0xFFFFFF;
                		doors[temp].interactive = true;
                		doors[temp].buttonMode = true;
        		}else if((temp + 1) > parseInt(currentArea.doors)){

				doorOut.tint = 0xFFFFFF;
                                doorOut.interactive = true;
                                doorOut.buttonMode = true;
			}
		}

		//bar.drawRect(0, 0,(health/100)*140, 14);
		renderer.render(stage);
		requestAnimFrame(update);
	}


	// Functions for Controls
	//----------------------
	graphics.click = function (e) {

	        currentHealth = currentHealth - firstUpgrade.getDamage();
		health--;
		//console.log(health);
		bar.drawRect(215,460,(currentHealth/100)*800, 14);
	}


        button.click = function (e) {
                if(gold >= 10){

                        gold -= 10;
			firstUpgrade.increaseClickDamage();
                        console.log("Bought something! " + firstUpgrade.clickDamage);
			document.getElementById("demo").innerHTML = gold + " GP";
                }
        }
}


function loadLevel(){

	console.log("Reloading Levels!");

}


/*function loadLevel(name, type, map, numDoors, prev, next){
//function loadLevel(){

	var texture;
	//console.log(name + " loading captain!");
	//var currentArea = new area(name, type, numDoors, numDoors, prev, next);
        //var currentArea = new area("Dungeon 1", "test", 2, 3, null, null);
        kills = 0;
        doors = [];//["door1", "door2", "door3"];

        // This entire door loop is a messand needs to be redone cleverly, right now it just floats a sprite over
        //      the last opened door. All doors should stay open in fial product.
        for(var i=0; i<currentArea.doors; i++){ // The number of these should be saved into the area and loaded.
		
		//stage.removeChild(doors[i]);
		//stage.addChild(doors[i])
                texture = PIXI.Texture.fromImage("dungeon_door_1.png");
                doors[i] = new PIXI.Sprite(texture);
		//texture = PIXI.Texture.fromImage("dungeon_door_1.png");

                // create a new Sprite using the texture
                doors[i] = new PIXI.Sprite(texture);
                doors[i].position.x = (20 + 130 * i);
                doors[i].position.y = 20;
                doors[i].scale.x = doors[i].scale.y = 8.1;

                //Tint starts on spawn to let you know you can't open this door yet.
                doors[i].tint = 0x999966;
		doors[i].interactive = false;
	        doors[i].buttonMode = false;

                stage.addChild(doors[i]);
                doors[i].click = function (e) {
			var door = currentArea.door;
                        currentArea.door.openDoor();

                        //Prints out what type of door is secretly was.
                        console.log(currentArea.door.currentDoor);

                        //Hold y position to place on new image.
                        //var holder = this.position.y;

                        //Gotta remove before we can add.
                        stage.removeChild(doors[i]);

                        //Next we change the image based on what type of door and add affect
                        if(door.currentDoor == "Treasure"){

                                var texture = PIXI.Texture.fromImage("dungeon_door_gold.png");
                                // create a new Sprite using the texture
                                doors[i] = new PIXI.Sprite(texture);
                                gold += 30;
                        }else if(door.currentDoor == "Trap"){

                                var texture = PIXI.Texture.fromImage("dungeon_door_trap.png");
                                // create a new Sprite using the texture
                                doors[i] = new PIXI.Sprite(texture);
                                console.log("  (Would take away health!)");
                        }else if(door.currentDoor == "Monster"){

                                var texture = PIXI.Texture.fromImage("dungeon_door_empty.png");
                                // create a new Sprite using the texture
                                doors[i] = new PIXI.Sprite(texture);

                                var texture = PIXI.Texture.fromImage("dungeon_door_empty.png");
                                // create a new Sprite using the texture
                                doors[i] = new PIXI.Sprite(texture);
                                console.log("  (Would add monster to queue! But is empty..)");
                        }
                        doors[i].scale.x = doors[i].scale.y = 8.1;
                        stage.addChild(doors[i]);
                        doors[i].position.y = 20;

                        doors[i].position.x = this.position.x; //(20 + 130 * this.position.x);
                        this.interactive = false;
                        doors[i].interactive = false;
                        document.getElementById("demo").innerHTML = gold + " GP";
                }
        }

        //var texture = PIXI.Texture.fromImage("dungeon_door_1.png");
	doorOut = [];
        doorOut = new PIXI.Sprite(texture);
        doorOut.position.x = (20 + 130 * i);
        doorOut.position.y = 20;
        doorOut.scale.x = doorOut.scale.y = 8.1;

        //Tint starts on spawn to let you know you can't open this door yet.
        doorOut.interactive = true;
        doorOut.buttonMode = true;
        doorOut.tint = 0x999966;
        //doors[i].openDoor();
        stage.addChild(doorOut);

	doorOut.click = function (e) {

                //loadLevel(name, type, numDoors, prev, next);
                console.log("Reloading level!");

                //Firstly we create a new area.
		INDEX++;
                currentArea = new area(map[INDEX].name, texture, map[INDEX].type, parseInt(map[INDEX].doors), map[INDEX].prev, map[INDEX].next);
                //update();

                //Gotta reload all doors and level assets.
                kills = 0;
                doorOut.interactive = false;
                
		doorOut.buttonMode = false;
                //loadLevel(currentArea.name, currentArea.type, map, currentArea.doors, currentArea.prev, currentArea.next); //map[INDEX].name, map[INDEX].type, map[INDEX].doors, map[INDEX].prev, map[INDEX].next);
		loadLevel();
                console.log("Complete!");
        }

}*/

// Knave 1.0.9
// Created by Brandon T. Wood on December 1st, 2013
// Knave is meant to be a combination Incremental Game, combining
//	the best aspects of all to make a fun browser based hybrid people
//	can pour their free time into. 


// -- Index of Functions --
//Global Variables
//Init
//Load
//createChar
//setup
//-update
//-monster.click
//-check
//-loadLevel


//GLOBAL VARS, sometime gonna make them all capitalized!
var stage;
var renderer;
var areaBackground;
var map;
var doors;
var outDoor;
var currentArea = [];
var INDEX = 0;
var damage = 1;
var upgrades;
var kills = 0;
var gold = 0;
var ready = 0; // Acts as a Semaphore to the loaded jsons
var char_stamina;
var char;
var monster;
var newLevel = 0;
var char_container;
var upgradeNames;
var Char;
var ready = 0;
var currentArea;
var doors;
var chests = [];
var TPText;
var TPGold;

// Calls all the initial methods needed to setup, load and play the game.
function init(){

	// This needs to be before any PIXI code. Stops Antialiasis
        PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

	// JSON files for sprites must be loaded ahead of time, but PIXI loads them async.
	//	So we have to use a semaphore, 'ready' to stop race conditions.
	console.log("Calling loads!");
	load("monsters_1.json"); //Has too be called separately on all JSONs
	load("monsters_2.json");
	load("backgrounds.json");
	load("races.json");
}



// This load function will load any and all files necessary before the game can run, such as bulk sprites and saved data.
function load(json){

	ready--;
	// Will let us know if we need to create a character before playing.
	var newChar = false;
	// Sets up character object.
	var temp = document.cookie.split(',');

	// If no cookie initalized will set a boolean to true, which will call createChar instead of going straight to setup.
	if(temp[0] == ""){

		newChar = true;
	}

	// Gonna load those sprites as PIXI objects
        var loader = new PIXI.JsonLoader(json);
       	loader.on('loaded', function(evt) {

		ready++;
               	evt.content.json
               	console.log("Load Successful!");
		if(ready == 0 && newChar == false){

			// This means we already have a char saved in cookies and we call setup with what we got from cookies.
			console.log("Char loaded, callings setup!");
		        stage = new PIXI.Stage(0x50503E);
        		renderer = PIXI.autoDetectRenderer(1040, 640);
        		document.body.appendChild(renderer.view);
			console.log("Calling setup!");
			setup(temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], temp[6]);
		}else if(ready == 0 && newChar == true){

		        stage = new PIXI.Stage(0x50503E);
		        renderer = PIXI.autoDetectRenderer(1028, 750);
        		document.body.appendChild(renderer.view);

			// Means this person has a character to create. 
			console.log("Character creation hoe!");
			createChar();
		}
       	});
       	loader.load();
}


// Function that brings up character creation menu, cleans up upon completion and calls setup.
function createChar(){

	// A bad name, but really only a temporary array that will hold the player's choices and passed to setup.
	var array = ["Keith", "Human1", "M", 0, 1, "null", "null"];
			// n, r, ge, go, l, t, a

	// The placeholder image that  
	var tempTex = PIXI.Texture.fromImage("Human1_M.png");
        var tempSprite = new PIXI.Sprite(tempTex);
        tempSprite.position.x = 540;
        tempSprite.position.y = 180;
        tempSprite.scale.x = tempSprite.scale.y = 9;
	stage.addChild(tempSprite);

        // Next gotta create toggle button that prompts you to input character name.
        var nameButton = new PIXI.Graphics();
        nameButton.beginFill(0x757585);
        nameButton.lineStyle(5, 0xACACB6, 1);
        nameButton.drawRect(760, 60 + 45, 208, 50);
        nameButton.endFill();
        nameButton.interactive = true;
        nameButton.buttonMode = true;
        stage.addChild(nameButton);

        var nameText = new PIXI.Text("Name");
        nameText.position.x = 780;
        nameText.position.y = 60 + 65;
        stage.addChild(nameText);

        nameButton.click = nameButton.touchstart = function(e){
	
		array[0] = prompt("Choose a name.", "Keith");
		//console.log(array[0]);
		nameText.setText(array[0]);
                renderer.render(stage);
	}


	// Next gotta create toggle button that changes gender.
        var genderButton = new PIXI.Graphics();
        genderButton.beginFill(0x757585);
        genderButton.lineStyle(5, 0xACACB6, 1);
        genderButton.drawRect(760, 60 + 145, 208, 50);
        genderButton.endFill();
        genderButton.interactive = true;
        genderButton.buttonMode = true;
	stage.addChild(genderButton);

	var genderText = new PIXI.Text("Male");
        genderText.position.x = 780;
        genderText.position.y = 60 + 165;
        stage.addChild(genderText);

	genderButton.click = genderButton.touchstart = function(e){

		if(array[2] == "M"){

			genderText.setText("Female"); 
			array[2] = "F";
	                tempSprite.setTexture(PIXI.Texture.fromImage(array[1] + "_" + array[2] + ".png"));
			//console.log(array[1] + " " + array[2]);
		}else{

			genderText.setText("Male");
			array[2] = "M";
	                tempSprite.setTexture(PIXI.Texture.fromImage(array[1] + "_" + array[2] + ".png"));
			//console.log(array[1] + " " + array[2]);
		}
	        renderer.render(stage);
	};


        // Next gotta create toggle button that changes race.
        var raceButton = new PIXI.Graphics();
        raceButton.beginFill(0x757585);
        raceButton.lineStyle(5, 0xACACB6, 1);
        raceButton.drawRect(760, 160 + 145, 208, 50);
        raceButton.endFill();
        raceButton.interactive = true;
        raceButton.buttonMode = true;
        stage.addChild(raceButton);
        var raceText = new PIXI.Text("Human");
        raceText.position.x = 780;
        raceText.position.y = 160 + 165;
        stage.addChild(raceText);

	// Incrementer for race array.
	var temp = 0;
	raceButton.click = raceButton.touchstart = function(e){

		//Race arrays
		var races = ["Human1", "Ogre", "Dryad", "Elf", "Fishman", "Human2"];		
		if(temp >= races.length-1){

			temp = 0;
		}else{

			temp++;
		}
		array[1] = races[temp]; 
		raceText.setText(races[temp]);
		tempSprite.setTexture(PIXI.Texture.fromImage(array[1] + "_" + array[2] + ".png"));
		//console.log("" + array[1] + "_" + array[2] + ".png");
	        renderer.render(stage);
        };

        // Next gotta do a done button to complete creation and cleanup.
        var doneButton = new PIXI.Graphics();
        doneButton.beginFill(0x757585);
        doneButton.lineStyle(5, 0xACACB6, 1);
        doneButton.drawRect(760, 260 + 145, 208, 50);
        doneButton.endFill();
        doneButton.interactive = true;
        doneButton.buttonMode = true;
        stage.addChild(doneButton);
        var doneText = new PIXI.Text("Done");
        doneText.position.x = 780;
        doneText.position.y = 260 + 165;
        stage.addChild(doneText);
        doneButton.click = doneButton.touchstart = function(e){

		stage.removeChild(tempSprite);
		stage.removeChild(nameButton);
		stage.removeChild(nameText);
		stage.removeChild(genderButton);
		stage.removeChild(genderText);
                stage.removeChild(raceButton);
                stage.removeChild(raceText);
                stage.removeChild(doneButton);
                stage.removeChild(doneText);
		document.cookie = array[0] + ',' + array[1] + ',' + array[2] + ',' + array[3] + ',' + array[4] + ',' + array[5] + ',' + array[6] + "; expires=Thu, 01 Jan 2020 00:00:00 UTC";
		//console.log(document.cookie);
                setup(array[0], array[1], array[2], array[3], array[4], array[5], array[6]);
        };

        renderer.render(stage);
}
// TEMP for testing purposes really.
function clearChar(){

	document.cookie = ";expires=Thu, 01 Jan 2020 00:00:00 UTC";
}

// This function writes the cookie that stores your character. 
function savedChar(){

	document.cookie = array[0] + ',' + array[1] + ',' + array[2] + ',' + array[3] + ',' + array[4] + ',' + array[5] + ',' + array[6] + "; ";
}


//This function will construct everything in the game and start the loop when complete.
// name, race, gender, gold, level, tier, attributes in array format.
function setup(n, r, ge, go, l, t, a){

	// Top bar and gold information. 
        TPBar = new PIXI.Graphics();
        TPBar.beginFill(0x757585);
        //topbar.lineStyle(5, 0xACACB6, 1);
        TPBar.drawRect(20, 5, 1250, 40);
        TPBar.endFill();
	stage.addChild(TPBar);

	// Top bar gold words.
	TPGold = new PIXI.Text("0 GP", {font:"35px Arial", fill:"yellow"});
	TPGold.position.x = 250;
	TPGold.position.y = 12;
	stage.addChild(TPGold);

	// Top bar descriptions for loot and upgrade
        TPText = new PIXI.Text("Loot Chests          Upgrades", {font:"25px Arial", fill:"black"});
        TPText.position.x = 650;
        TPText.position.y = 20;
        stage.addChild(TPText);

	addGold(parseInt(go));
	//document.getElementById("demo").innerHTML = gold + " GP";

	// Setting up upgrades, this means printing out each attribute button.
        upgrades = new upgrade();	
	var upgradeButtons = [];
	upgradeNames = [];

	// Loop for printing purchasable upgrades to attributes.
	for(var i = 0; i < 6; i++){

		//console.log(i);
		upgradeButtons[i] = new PIXI.Graphics();
	        upgradeButtons[i].beginFill(0x757585);
	        //upgradeButtons[i].lineStyle(5, 0xACACB6, 1);
                upgradeButtons[i].drawRect(775, 60 * i + 65, 258, 50);
        	upgradeButtons[i].endFill();

                //Tint starts on spawn to let you know you can't open this door yet.
                upgradeButtons[i].interactive = false;
                upgradeButtons[i].buttonMode = false;
		upgradeButtons[i].tint = 0x999966;

		stage.addChild(upgradeButtons[i]);

		upgradeNames[i] = new PIXI.Text(upgrades.attributes[i].name + "     " + upgrades.attributes[i].level + " LVL     " + upgrades.attributes[i].cost + "GP", {font:"bold 15px sans-serif", fill:"yellow", align:"center"});
 	      	upgradeNames[i].position.x = 790;
        	upgradeNames[i].position.y = 60 * i + 85;
		stage.addChild(upgradeNames[i]);		

	};
	// List of each attribute's individual click function.
	upgradeButtons[0].click = upgradeButtons[0].touchstart = function(e){

		addGold(-1 * upgrades.attributes[0].cost);
		upgrades.attributes[0].cost *= 2;
		upgrades.attributes[0].level += 1;
		upgradeNames[0].setText(upgrades.attributes[0].name + "     " + upgrades.attributes[0].level + " LVL     " + upgrades.attributes[0].cost + "GP");
		//document.getElementById("demo").innerHTML = gold + " GP";
	};
        upgradeButtons[1].click = upgradeButtons[1].touchstart = function(e){

                //gold = gold - upgrades.attributes[1].cost;
                addGold(-1 * upgrades.attributes[1].cost);
                upgrades.attributes[1].cost *= 2;
                upgrades.attributes[1].level += 1;
                upgradeNames[1].setText(upgrades.attributes[1].name + "     " + upgrades.attributes[1].level + " LVL     " + upgrades.attributes[1].cost + "GP");
                //document.getElementById("demo").innerHTML = gold + " GP";
        };
        upgradeButtons[2].click = upgradeButtons[2].touchstart = function(e){

                addGold(-1 * upgrades.attributes[2].cost);
                upgrades.attributes[2].cost *= 2;
                upgrades.attributes[2].level += 1;
                upgradeNames[2].setText(upgrades.attributes[2].name + "     " + upgrades.attributes[2].level + " LVL     " + upgrades.attributes[2].cost + "GP");
                //document.getElementById("demo").innerHTML = gold + " GP";
        };
        upgradeButtons[3].click = upgradeButtons[3].touchstart = function(e){

                addGold(-1 * upgrades.attributes[3].cost);
                upgrades.attributes[3].cost *= 2;
                upgrades.attributes[3].level += 1;
                upgradeNames[3].setText(upgrades.attributes[3].name + "     " + upgrades.attributes[3].level + " LVL     " + upgrades.attributes[3].cost + "GP");
                //document.getElementById("demo").innerHTML = gold + " GP";
        };
        /*upgradeButtons[4].click = upgradeButtons[4].touchstart = function(e){

                addGold(-1 * upgrades.attributes[4].cost);
                upgrades.attributes[4].cost *= 2;
                upgrades.attributes[4].level += 1;
                upgradeNames[4].setText(upgrades.attributes[4].name + "       " + upgrades.attributes[4].level + " LVL     " + upgrades.attributes[4].cost + "GP$
                //document.getElementById("demo").innerHTML = gold + " GP";
        };*/


//TEMP 
	/* Instead I'm just gonna leave the area descriptors inside the file for ease right now.
	map = [{"name":"mistymountain", "type":"forest", "doors":2, "prev":"NULL", "next":"ropebridge"},
		//{"name":"Mountains", "type":"forest", "doors":3, "prev":"Misty_Forest", "next":"Rope_Bridge"},
                {"name":"ropebridge", "type":"forest", "doors":3, "prev":"Mountains", "next":"darkcave"},
                //{"name":"Craven Beach", "type":"forest", "doors":5, "prev":"Rope_Bridge", "next":"Dark_Cave"},
                {"name":"darkcave", "type":"dungeon", "doors":4, "prev":"Craven_Beach", "next":"deepdungeon"},
		{"name":"deepdungeon", "type":"dungeon", "doors":5, "prev":"darkcave", next:"NULL"}
	];
	*/
        map = [{"name":"Level_1", "type":"forest", "doors":2, "prev":"NULL", "next":"Level_2"},
                {"name":"Level_2", "type":"forest", "doors":3, "prev":"Level_1", "next":"Level_3"},
                {"name":"Level_3", "type":"forest", "doors":3, "prev":"Level_2", "next":"Level_4"},
                {"name":"Level_4", "type":"forest", "doors":5, "prev":"Level_3", "next":"Level_5"},
                {"name":"Level_5", "type":"dungeon", "doors":4, "prev":"Level_4", "next":"Level_6"},
                {"name":"Level_6", "type":"dungeon", "doors":5, "prev":"Level_5", next:"Level_7"},
                {"name":"Level_7", "type":"dungeon", "doors":4, "prev":"Level_6", "next":"Level_8"},
                {"name":"Level_8", "type":"dungeon", "doors":4, "prev":"Level_7", "next":"Level_9"},
                {"name":"Level_9", "type":"dungeon", "doors":5, "prev":"Level_8", next:"Level_10"},
                {"name":"Level_10", "type":"dungeon", "doors":4, "prev":"Level_9", "next":"Level_11"},
                {"name":"Level_11", "type":"dungeon", "doors":4, "prev":"Level_10", "next":"Level_12"},
                {"name":"Level_12", "type":"dungeon", "doors":4, "prev":"Level_11", "next":"NULL"},
        ];

//

	// Setting up 'loot chests' and level loading.
	//	Need to replace DOOR with CHEST for all.
	console.log("Loading level 1!");
	currentArea = new area(map[INDEX].name, texture, map[INDEX].type, map[INDEX].doors, map[INDEX].prev, map[INDEX].next);

	// New chests area!
	for(var i = 0; i < 4; i++){

		chests[i] = new chest(INDEX, i);
                chests[i].sprite.position.x = 670; //20 + (90 * i);
                chests[i].sprite.position.y = 50 + (90 * i); //50;
		stage.addChild(chests[i].sprite);
	}

	// Setup placement for next level button!
	//var texture = PIXI.Texture.fromImage("Flameskull.png");
        var texture = PIXI.Texture.fromImage("res/sign.png");
        doorOut = new PIXI.Sprite(texture);
        doorOut.position.x = 670;//(20 + 130 * i);
        doorOut.position.y = 50 + (90 * i);
        //doorOut.scale.x = doorOut.scale.y = 8.1;
	doorOut.scale.x = doorOut.scale.y = 6;

        //Tint starts on spawn to let you know you can't open this sign yet and load the next level.
        doorOut.interactive = false;
        doorOut.buttonMode = true;
        doorOut.tint = 0x999966;
        stage.addChild(doorOut);

        doorOut.click = doorOut.touchstart = function (e) {

                INDEX++;
                console.log("Loading level " + INDEX + ", " + currentArea.name);
                currentArea = new area(map[INDEX].name, texture, map[INDEX].type, parseInt(map[INDEX].doors), map[INDEX].prev, map[INDEX].next);

                //Gotta reload all doors and level assets.
                kills = 0;
                doorOut.interactive = false;
                loadLevel();
        }

        // Next we get to change the background
        //var BG = PIXI.Texture.fromImage("res/" + currentArea.name + ".png");
	var BG = PIXI.Texture.fromImage(currentArea.name + ".png");
        areaBackground = new PIXI.Sprite(BG);
        areaBackground.position.x = 20;
        areaBackground.position.y = 50;
        areaBackground.scale.y = 8.1;
        areaBackground.scale.x = 9.1;
        stage.addChild(areaBackground);

	// Now Placing everything into a neat little container!
        char_container = new PIXI.DisplayObjectContainer();

        // Here is where the player Character's sprites and bars are setup.
	texture = PIXI.Texture.fromImage(r + "_" + ge + ".png");
        char = new PIXI.Sprite(texture);
        char.position.x = 0;
        char.position.y = 25;
        char.scale.x = char.scale.y = 6;
	char_container.addChild(char);

	var char_health = 5;
        var health_bar = new PIXI.Graphics();
        health_bar.beginFill(0xCC0000);
        health_bar.lineStyle(8, 0x999966, 1);
        health_bar.drawRect(5,228,(10/100)*800,14)
        char_container.addChild(health_bar);

        char_stamina = 1;
        var critical_bar = new PIXI.Graphics();
        critical_bar.beginFill(0x999966);
        //critical_bar.beginFill(0x0099FF);
//temp  critical_bar.lineStyle(8, 0x999966, 1);
        critical_bar.drawRect(5,248,(10/100)*800,14)
        char_container.addChild(critical_bar);

        var char_name = new PIXI.Text(n, {font:"bold 25px sans-serif", fill:"pink", align:"center"});
        char_name.position.x = 5;
        char_name.position.y = 0;
        char_container.addChild(char_name);

	//Positions entire character container, healthbar and name and sprite.
	char_container.position.x = 50; 
	char_container.position.y = 300;
	stage.addChild(char_container);

        // New monster stuff starts here
        var monsters = [ 

			new Monsters(INDEX),
			new Monsters(INDEX),
			new Monsters(INDEX)	
	];

	// Positioning monsters so not to overlap.
	for(var i = 0; i < monsters.length-1; i++){

		//console.log("	x:" + monsters[i].monsterContainer.position.x + " x2:" + monsters[i+1].monsterContainer.position.x);
		var j = 0;
		while((Math.abs(monsters[i].monsterContainer.position.x - monsters[i+1].monsterContainer.position.x) < 120) && j < 5){

			//console.log("	Replaced! " + i);
			monsters[i].randomXY();
			j++;
		}
	}

	stage.addChild(monsters[0].monsterContainer);
	stage.addChild(monsters[1].monsterContainer);
	stage.addChild(monsters[2].monsterContainer);

	// Basic update globals.
	var currentHealth = 6;
	var totalHealth = 6;
	var health = 6;
	var areaNum = 0;
	console.log("Setup successful!\nGame Start!");

	// Starting stamina power bar fill and defill
	setInterval(function() { bars() }, 2000)

	// Kick the tires and lite the fires.
	update();

	// Main Game loop.
	function update(){

		// Checks if upgrades are purchasable, monsters are dead or chests unlocked.
		checkAttributes();
		checkMonsters();
		checkChests();

		// Cleanup for next level and reseting bool.
		if(newLevel > 0){

			//stage.removeChild(chests[0].sprite);
			//stage.removeChild(chests[1].sprite);
			//stage.removeChild(chests[2].sprite);
			//stage.removeChild(chests[3].sprite);

			stage.removeChild(monsters[0].monsterContainer);
                        stage.addChild(monsters[0].monsterContainer);

                        stage.removeChild(monsters[1].monsterContainer);
                        stage.addChild(monsters[1].monsterContainer);

                        stage.removeChild(monsters[2].monsterContainer);
                        stage.addChild(monsters[2].monsterContainer);

			stage.removeChild(char_container);
			stage.addChild(char_container);
			newLevel--;
		}
		renderer.render(stage);
		requestAnimFrame(update);
	}


	// Simple function
	function addGold(value){

		//console.log(" Current gold:" + gold + " Additional value:" + value + " = new value:" + (gold + value));
		gold = gold + value;
		TPGold.setText("" + gold + " GP");
                //document.getElementById("demo").innerHTML = gold + " GP";

		saveChar(n, r, ge, go, l, t, a);
		//checkAttributes();
		//checkChests();
	}


	// This function writes the cookie that stores your character.
	function saveChar(na, re, gen, gol, le, ti, at){ 

		//console.log("" + na + ',' + re + ',' + gen + ',' + gold + ',' + le + ',' + ti + ',' + at);
	        document.cookie = na + ',' + re + ',' + gen + ',' + gold + ',' + le + ',' + ti + ',' + at + ";expires=Thu, 01 Jan 2020 00:00:00 UTC";
	}



	// This function controls the stamina bars regen and roll over
	function bars(){

		var critical_bar = new PIXI.Graphics();
		if(char_stamina < 10){

			char_stamina++;
                	critical_bar.beginFill(0x0099FF);
                	critical_bar.drawRect(67,600,(char_stamina/100)*800,14)
                	char_container.addChild(critical_bar);
			
		}else{

			console.log("	Crit hit!");
			monsters[0].current_health = 0;

			/*
			Does a critical hit.
			currentHealth = currentHealth - 10;
	                bar.drawRect(215,580,(currentHealth/100)*800, 14);
			*/

			char_stamina = 0;
			critical_bar.beginFill(0x999966);
                        critical_bar.drawRect(67,600,(10/100)*800,14)
                        char_container.addChild(critical_bar);
		}
		char_container.addChild(critical_bar);
	};



	// Makes sure that you can buy what you buy, and nothing else.
	function checkAttributes(){

		for(var i = 0; i < 4; i++){
			if(gold >= parseInt(upgrades.attributes[i].cost)){

				//console.log("You can buy something!");
                                upgradeButtons[i].tint = 0xFFFFFF;
                                upgradeButtons[i].interactive = true;
                                upgradeButtons[i].buttonMode = true;
                        }else{

		                upgradeButtons[i].interactive = false;
		                upgradeButtons[i].buttonMode = false;
		                upgradeButtons[i].tint = 0x999966;		
			}
                }
		
	};


	// Checks to see if a monster has been killed, if so remove it and select a new one for that place in the array.
	function checkMonsters(){
		for(var i = 0; i < monsters.length; i++){
			if(monsters[i].current_health <= 0){

				//console.log("You killed a " + monsters[i].name);
				addGold(monsters[i].gold);
				stage.removeChild(monsters[i].monsterContainer);
				monsters[i] = new Monsters(INDEX);
				for(var j = 0; j < monsters.length; j++){

					var l = 0;
					if(((monsters[i] != monsters[j]) && (Math.abs(monsters[j].monsterContainer.position.x - monsters[i].monsterContainer.position.x) < 80)) && l < 7){

                        			//console.log("   Replaced! " + i);
                        			monsters[i].randomXY();
                        			l++;
					}
                		}
     				stage.addChild(monsters[i].monsterContainer);   
				kills++;
			}
		}
	}

	// Checks to see if any of the chests needs to be unlocked yet.
	function checkChests(){

		for(var i = 0; i < chests.length; i ++){

			if(kills > chests[i].seal){

				//console.log("	Unlock noise!");
                                chests[i].sprite.tint = 0xFFFFFF;
				chests[i].sprite.interactive = true;
			}
			if(chests[i].gold != 0){

				addGold(chests[i].gold);
				chests[i].gold = 0;
			}
		}
		if(kills > 5){

			doorOut.interactive = true;
			doorOut.tint = 0xFFFFFF;
		}
	}


	// Self explainitory, will increase the current level number, reset all the loot chests 
	//	and changing the background.
	function loadLevel(){

		//saveChar(n, r, ge, go, l, t, a);
		newLevel++;
                // Next we get to change the background
                //var BG = PIXI.Texture.fromImage("res/" + currentArea.name + ".png");
		var BG = PIXI.Texture.fromImage(currentArea.name + ".png");
	        doorOut.tint = 0x999966;

		console.log("	" + newLevel + " " + currentArea.name);

		// Gotta reset those chests, jsut gonna make new ones for now, will 'reset' them later.
 	        for(var i = 0; i < 4; i++){

 	               chests[i] = new chest(INDEX, i);
	               chests[i].sprite.position.x = 670; //20 + (90 * i);
        	       chests[i].sprite.position.y = 50 + (90 * i); //50;
 	               stage.addChild(chests[i].sprite);
 	        }
		
		// Next we get to change the background
        	//var BG = PIXI.Texture.fromImage("res/" + currentArea.name + ".png");
		areaBackground.setTexture(BG);
		//stage.addChild(areaBackground);
	};
}

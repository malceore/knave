// Knave 1.3.2
// Created by Brandon T. Wood on December 1st, 2013
// Knave is meant to be a combination Incremental Game, combining
//	the best aspects of all to make a fun browser based hybrid people
//	can pour their free time into. 


// -- Index of Functions --
//Global Variables
//Init
//Load
//createChar
//charClear
//setup
//-update
//-checkAttributes
//-checkChest
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
var TPSin;
var sin = 0;
var buff_ren;
var buff_poi;
var buff_fre;


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

	var gameWidth = window.innerWidth;
	var gameHeight = window.innerHeight;
	var scaleToFitX = gameWidth / 1000;
	var scaleToFitY = gameHeight / 500;
	stage = new PIXI.Stage(0x50503E);
	var canvas = document.getElementById("game");

	// Scaling statement belongs to: https://www.davrous.com/2012/04/06/modernizing-your-html5-canvas-games-part-1-hardware-scaling-css3/
	var optimalRatio = Math.min(scaleToFitX, scaleToFitY);
	var currentScreenRatio = gameWidth / gameHeight;
	if(currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
		canvas.style.width = gameWidth + "px";
		canvas.style.height = gameHeight + "px";
	}else{
		canvas.style.width = 1000 * optimalRatio + "px";
		canvas.style.height = 500 * optimalRatio + "px";
	}
	renderer = PIXI.autoDetectRenderer(1024, 570, {view:document.getElementById("game")} );
	canvas.focus();

	// Gonna load those sprites as PIXI objects
        var loader = new PIXI.JsonLoader(json);
       	loader.on('loaded', function(evt) {

		ready++;
               	evt.content.json
               	console.log("Load Successful!");
		if(ready == 0 && newChar == false){
 
			// This means we already have a char saved in cookies and we call setup with what we got from cookies.
			//console.log("Char loaded, callings setup!");
		        //stage = new PIXI.Stage(0x50503E);
        		//renderer = PIXI.autoDetectRenderer(1024, 570, {view:document.getElementById("game")} );

			console.log("Calling setup!");
			setup(temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], temp[6], temp[7], temp[8], temp[9], temp[10], temp[11], temp[12]);
		}else if(ready == 0 && newChar == true){

		        //stage = new PIXI.Stage(0x50503E);
		        //renderer = PIXI.autoDetectRenderer(1024, 570, {view:document.getElementById("game")} );

			//document.body.game.appendChild(renderer.view);
        		//document.body.appendChild(renderer.view);

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
	var array = ["Keith", "Human1", "M", 0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
			// n, r, ge, go, si, l, t, ats 

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
		var races = ["Human1", "Ogre", "Dryad", "Elf", "Fishman", "Human2", "Arachni", "Centaur", "Naga", "Lycan", "Manitaur", "Tengu"];		
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
		stage.removeChild(titleText);
		stage.removeChild(tutorialText);
		document.cookie = array[0] + ',' + array[1] + ',' + array[2] + ',' + array[3] + ',' + array[4] + ',' + array[5] + ',' + array[6] + ',' + array[7] + "; expires=Thu, 01 Jan 2020 00:00:00 UTC";
		//console.log(document.cookie);
                setup(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7], array[8], array[9], array[10], array[11], array[12]);
        };

	// Print out title and race descriptions.
	var titleText = new PIXI.Text("Welcome to Knave ");
	titleText.setStyle({font:"bold 60px Arial", fill:"yellow"});
        titleText.position.x = 40;
        titleText.position.y = 50;
	stage.addChild(titleText);

	var tutorialText = new PIXI.Text("Click or Tap to attack monsters,\n then on chests to collect even\n more gold and finally spend\n your gold on upgrading your\n attributes. The arrow sign will\n take you to the next level\n when you are ready.");
        tutorialText.setStyle({font:"bold 32px Arial", fill:"black"});
        tutorialText.position.x = 40;
        tutorialText.position.y = 120;
	stage.addChild(tutorialText);

        renderer.render(stage);
}
// TEMP for testing purposes really.
function clearChar(){

	document.cookie = ";expires=Thu, 01 Jan 2020 00:00:00 UTC";
}


//This function will construct everything in the game and start the loop when complete.
// name, race, gender, gold, sin, level, tier, attributes 0-5 (6).
function setup(n, r, ge, go, si, l, ti, at0, at1, at2, at3, at4, at5){

	at = [at0,at1,at2,at3,at4,at5]
	// Top bar and gold information. 
        TPBar = new PIXI.Graphics();
        TPBar.beginFill(0x757585);
        //topbar.lineStyle(5, 0xACACB6, 1);
        TPBar.drawRect(0, 0, 1250, 40);
        TPBar.endFill();
	stage.addChild(TPBar);

	// Top bar gold words.
	TPGold = new PIXI.Text("0 GP", {font:"35px Arial", fill:"yellow"});
	TPGold.position.x = 100;
	TPGold.position.y = 12;
	stage.addChild(TPGold);

	// Top bar descriptions for loot and upgrade
        TPText = new PIXI.Text("Loot Chests          Upgrades", {font:"25px Arial", fill:"black"});
        TPText.position.x = 650;
        TPText.position.y = 20;
        stage.addChild(TPText);

	TPSin = new PIXI.Text("0 SIN", {font:"35px Arial", fill:"white"});
        TPSin.position.x = 400;
        TPSin.position.y = 12;
        stage.addChild(TPSin);

	// Setting up upgrades, this means printing out each attribute button.
        upgrades = new upgrade();	
	var upgradeButtons = [];
	upgradeNames = [];

	// Loop for printing purchasable upgrades to attributes.
	for(var i = 0; i < 6; i++){

		//Init levels
		upgrades.attributes[i].level = parseInt(at[i]); 
		upgrades.attributes[i].cost = Math.round(parseInt(at[i]) * 1.15) + 1;

		//console.log(i);
		upgradeButtons[i] = new PIXI.Graphics();
	        upgradeButtons[i].beginFill(0x757585);
	        //upgradeButtons[i].lineStyle(5, 0xACACB6, 1);
                upgradeButtons[i].drawRect(745, 58 * i + 50, 270, 50);
        	upgradeButtons[i].endFill();

                //Tint starts on spawn to let you know you can't open this door yet.
                upgradeButtons[i].interactive = false;
                upgradeButtons[i].buttonMode = false;
		upgradeButtons[i].tint = 0x999966;

		stage.addChild(upgradeButtons[i]);

		upgradeNames[i] = new PIXI.Text(upgrades.attributes[i].name + "     " + upgrades.attributes[i].level + " LVL     " + upgrades.attributes[i].cost + "GP", {font:"bold 15px sans-serif", fill:"yellow", align:"center"});
 	      	upgradeNames[i].position.x = 760;
        	upgradeNames[i].position.y = 58 * i + 65;
		stage.addChild(upgradeNames[i]);		
	};
	// List of each attribute's individual click function.
	upgradeButtons[0].click = upgradeButtons[0].touchstart = function(e){

		addGold(-1 * upgrades.attributes[0].cost);
		upgrades.attributes[0].cost = Math.round(upgrades.attributes[0].cost * 1.15) + 1;
		upgrades.attributes[0].level += 1;
		upgradeNames[0].setText(upgrades.attributes[0].name + "     " + upgrades.attributes[0].level + " LVL     " + upgrades.attributes[0].cost + "GP");
	};
        upgradeButtons[1].click = upgradeButtons[1].touchstart = function(e){

                addGold(-1 * upgrades.attributes[1].cost);
                upgrades.attributes[1].cost = Math.round(upgrades.attributes[1].cost * 1.15) + 1;
                upgrades.attributes[1].level += 1;
                upgradeNames[1].setText(upgrades.attributes[1].name + "     " + upgrades.attributes[1].level + " LVL     " + upgrades.attributes[1].cost + "GP");
        };
        upgradeButtons[2].click = upgradeButtons[2].touchstart = function(e){

                addGold(-1 * upgrades.attributes[2].cost);
                upgrades.attributes[2].cost = Math.round(upgrades.attributes[2].cost * 1.15) + 1;
                upgrades.attributes[2].level += 1;
                upgradeNames[2].setText(upgrades.attributes[2].name + "     " + upgrades.attributes[2].level + " LVL     " + upgrades.attributes[2].cost + "GP");
        };
        upgradeButtons[3].click = upgradeButtons[3].touchstart = function(e){

                addGold(-1 * upgrades.attributes[3].cost);
                upgrades.attributes[3].cost = Math.round(upgrades.attributes[3].cost * 1.15) + 1;
                upgrades.attributes[3].level += 1;
                upgradeNames[3].setText(upgrades.attributes[3].name + "     " + upgrades.attributes[3].level + " LVL     " + upgrades.attributes[3].cost + "GP");
        };
        upgradeButtons[4].click = upgradeButtons[4].touchstart = function(e){

                addGold(-1 * upgrades.attributes[4].cost);
                upgrades.attributes[4].cost = Math.round(upgrades.attributes[4].cost * 1.15) + 1;
                upgrades.attributes[4].level += 1;
                upgradeNames[4].setText(upgrades.attributes[4].name + "       " + upgrades.attributes[4].level + " LVL     " + upgrades.attributes[4].cost + "GP" );
        };
        upgradeButtons[5].click = upgradeButtons[5].touchstart = function(e){

                addGold(-1 * upgrades.attributes[5].cost);
                upgrades.attributes[5].cost = Math.round(upgrades.attributes[5].cost * 1.15) + 1;
                upgrades.attributes[5].level += 1;
                upgradeNames[5].setText(upgrades.attributes[5].name + "       " + upgrades.attributes[5].level + " LVL     " + upgrades.attributes[5].cost + "GP");
        };


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
                {"name":"Level_6", "type":"dungeon", "doors":5, "prev":"Level_5", "next":"Level_7"},
                {"name":"Level_7", "type":"dungeon", "doors":4, "prev":"Level_6", "next":"Level_8"},
                {"name":"Level_8", "type":"dungeon", "doors":4, "prev":"Level_7", "next":"Level_9"},
                {"name":"Level_9", "type":"dungeon", "doors":5, "prev":"Level_8", "next":"Level_10"},
                {"name":"Level_10", "type":"dungeon", "doors":4, "prev":"Level_9", "next":"Level_11"},
                {"name":"Level_11", "type":"dungeon", "doors":4, "prev":"Level_10", "next":"Level_12"},
                {"name":"Level_12", "type":"dungeon", "doors":4, "prev":"Level_11", "next":"Level_13"},
                {"name":"Level_13", "type":"dungeon", "doors":4, "prev":"Level_12", "next":"Level_14"},
                {"name":"Level_14", "type":"dungeon", "doors":4, "prev":"Level_13", "next":"Level_15"},
                {"name":"Level_15", "type":"dungeon", "doors":5, "prev":"Level_14", "next":"Level_16"},
                {"name":"Level_16", "type":"dungeon", "doors":4, "prev":"Level_15", "next":"Level_17"},
                {"name":"Level_17", "type":"dungeon", "doors":4, "prev":"Level_16", "next":"Level_18"},
                {"name":"Level_18", "type":"dungeon", "doors":4, "prev":"Level_17", "next":"Level_19"},
                {"name":"Level_19", "type":"dungeon", "doors":4, "prev":"Level_18", "next":"Level_20"},
                {"name":"Level_20", "type":"dungeon", "doors":4, "prev":"Level_19", "next":"Level_21"},
                {"name":"Level_21", "type":"dungeon", "doors":4, "prev":"Level_20", "next":"Level_22"},
                {"name":"Level_22", "type":"dungeon", "doors":4, "prev":"Level_21", "next":"Level_23"},
                {"name":"Level_23", "type":"dungeon", "doors":4, "prev":"Level_22", "next":"Level_24"},
                {"name":"Level_24", "type":"dungeon", "doors":4, "prev":"Level_23", "next":"Level_25"},
                {"name":"Level_25", "type":"dungeon", "doors":4, "prev":"Level_24", "next":"Level_26"},
                {"name":"Level_26", "type":"dungeon", "doors":4, "prev":"Level_25", "next":"Level_27"},
                {"name":"Level_27", "type":"dungeon", "doors":4, "prev":"Level_26", "next":"Level_28"},
                {"name":"Level_28", "type":"dungeon", "doors":4, "prev":"Level_27", "next":"Level_29"},
                {"name":"Level_29", "type":"dungeon", "doors":4, "prev":"Level_28", "next":"Level_30"},
                {"name":"Level_30", "type":"dungeon", "doors":4, "prev":"Level_29", "next":"Level_31"},
                {"name":"Level_31", "type":"dungeon", "doors":4, "prev":"Level_30", "next":"Level_32"},
                {"name":"Level_32", "type":"dungeon", "doors":4, "prev":"Level_31", "next":"Level_33"},
                {"name":"Level_33", "type":"dungeon", "doors":4, "prev":"Level_32", "next":"Level_34"},
                {"name":"Level_34", "type":"dungeon", "doors":4, "prev":"Level_33", "next":"Level_35"},
                {"name":"Level_35", "type":"dungeon", "doors":4, "prev":"Level_34", "next":"Level_36"}
        ];

//
	// Initializing gold and sin.
        addGold(parseInt(go));
        addSin(parseInt(si));
	// Initializing level
	INDEX = parseInt(l);

	// Setting up 'loot chests' and level loading.
	//	Need to replace DOOR with CHEST for all.
	console.log("Loading level 1!");
	currentArea = new area(map[INDEX].name, texture, map[INDEX].type, map[INDEX].doors, map[INDEX].prev, map[INDEX].next);

	// New chests area!
	for(var i = 0; i < 5; i++){

		chests[i] = new chest(INDEX, i);
                chests[i].sprite.position.x = 650; //20 + (90 * i);
                chests[i].sprite.position.y = 42 + (85 * i); //50;
		stage.addChild(chests[i].sprite);
	}

	// Setup placement for next level button!
        var texture = PIXI.Texture.fromImage("res/sign.png");
        doorOut = new PIXI.Sprite(texture);
        doorOut.position.x = 650;//(20 + 130 * i);
        doorOut.position.y = 42 + (85 * i);
        //doorOut.scale.x = doorOut.scale.y = 8.1;
	doorOut.scale.x = doorOut.scale.y = 5.2;

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
        areaBackground.position.x = 0;
        areaBackground.position.y = 40;
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
	char_container.position.y = 290;
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

	// Setup weapon if already unlocked
	if(ti >= 1){

                    // Draw sword in player's hand.
                    console.log("*Gives Sword*");
                    texture = PIXI.Texture.fromImage("res/" + "sword_char.png");
                    weapon_char = new PIXI.Sprite(texture);
                    weapon_char.position.x = -12;
                    weapon_char.position.y = 115;
                    weapon_char.scale.x = weapon_char.scale.y = 6;
                    char_container.addChild(weapon_char);

                    // Repair buttons
                    //repair_button = new PIXI.Graphics();
                    //repair_button.beginFill(0x757585);
                    //repair_button.drawRect(775, 60 * 8 + 65, 258, 50);
                    //repair_button.endFill();
                    //Tint starts on spawn to let you know you can't open this door yet.
                    //upgradeButtons[i].interactive = false;
                    //upgradeButtons[i].buttonMode = false;
                    //upgradeButtons[i].tint = 0x999966;
                    //stage.addChild(repair_button);

                    //repair_text = new PIXI.Text("Repair");
                    //repair_text.position.x = 790;
                    //repair_text.position.y = 60 * 8 + 85;
                    //stage.addChild(repair_text);
	}


	// Basic update globals.
	var currentHealth = 6;
	var totalHealth = 6;
	var health = 6;
	var areaNum = 0;
	console.log("Setup successful!\nGame Start!");

	// Starting stamina power bar fill and defill
        var bar = new PIXI.Graphics();
        bar.drawRect(5,248,(10/100)*800,14)
        stage.addChild(bar);
	//setInterval(function() { bars() }, 2000)
	bars(2003 - (upgrades.attributes[3].level * 3));

	// Kick the tires and lite the fires. 1000 = a second and 30 = frames per.
	//update();
	setInterval(update(), 1000/30);

	// Main Game loop.
	function update(){

		// Checks if upgrades are purchasable, monsters are dead or chests unlocked.
		//checkAttributes();
		checkMonsters();
		checkChests();

		// Cleanup for next level and reseting bool.
		if(newLevel > 0){

			// If you have met the dragon and taken his sword
			if(INDEX == 1){

				//increase tier to 1
				ti = 1;
				// Draw sword in player's hand.
				console.log("*Gives Sword*");
			        texture = PIXI.Texture.fromImage("res/" + "sword_char.png");
			        weapon_char = new PIXI.Sprite(texture);
        			weapon_char.position.x = -12;
        			weapon_char.position.y = 115;
        			weapon_char.scale.x = weapon_char.scale.y = 6;
        			char_container.addChild(weapon_char);

                                texture = PIXI.Texture.fromImage("res/" + "renewal.png");
                                buff_fre = new PIXI.Sprite(texture);
                                buff_fre.position.x = 745;
                                buff_fre.position.y = 435;
                                buff_fre.scale.x = buff_fre.scale.y = 5.2;
                                buff_fre.interactive = true;
                                buff_fre.buttonMode = true;
                                stage.addChild(buff_fre);

                                texture = PIXI.Texture.fromImage("res/" + "poison.png");
                                buff_poi = new PIXI.Sprite(texture);
                                buff_poi.position.x = 840;
                                buff_poi.position.y = 435;
                                buff_poi.scale.x = buff_poi.scale.y = 5.2;
                                buff_poi.interactive = true;
                                buff_poi.buttonMode = true;
                                stage.addChild(buff_poi);

                                texture = PIXI.Texture.fromImage("res/" + "frenzy.png");
                                buff_ren = new PIXI.Sprite(texture);
                                buff_ren.position.x = 930;
                                buff_ren.position.y = 440;
                                buff_ren.scale.x = buff_ren.scale.y = 5.2;
				buff_ren.interactive = true;
				buff_ren.buttonMode = true;
                                stage.addChild(buff_ren);

                		//upgradeButtons[i].tint = 0x999966;
                		var buff_text = new PIXI.Text("Buffs");
        		        buff_text.position.x = 750;
        		        buff_text.position.y = 400;
		                stage.addChild(buff_text);

			}

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


	// Simple function increases number of gold pieces
	function addGold(value){

		gold = gold + value;
		TPGold.setText("" + gold + " GP");
		//saveChar(n, r, ge, gold, sin, l, t, at);
		checkAttributes();
		//checkChests();
	}
        // Simple function increases number of sins
        function addSin(value){

		//console.log(" sin:" + sin);
                sin = sin + value;
                TPSin.setText("" + sin + " SIN");
                saveChar(n, r, ge, gold, sin, l, ti, at);
        }


	// This function writes the cookie that stores your character.
	function saveChar(na, re, gen, gol, sin, le, ti, at){ 

		/*console.log( "" +

			na + ',' + re + ',' + gen + ',' + gold + "," + sin + ',' + INDEX + ',' + ti + ',' 
                	+ upgrades.attributes[5].level + ","  
                	+ upgrades.attributes[4].level + ","
                	+ upgrades.attributes[3].level + ","
                	+ upgrades.attributes[2].level + ","
                	+ upgrades.attributes[1].level + ","
                	+ upgrades.attributes[0].level + ""
		);*/

	        document.cookie = na + ',' + re + ',' + gen + ',' + gold + "," + sin + ',' + INDEX + ',' + ti + ',' 
			+ upgrades.attributes[5].level + ","  
	                + upgrades.attributes[4].level + ","
	                + upgrades.attributes[3].level + ","
	                + upgrades.attributes[2].level + ","
        	        + upgrades.attributes[1].level + ","
                	+ upgrades.attributes[0].level + ""	
		+ ";expires=Thu, 01 Jan 2020 00:00:00 UTC";
	}



	// This function controls the stamina bars regen and roll over
	function bars(value){

		var critical_bar = new PIXI.Graphics();
		if(char_stamina < 10){

			char_stamina++;

			bar.beginFill(0x0099FF);
			bar.drawRect(55,538,(char_stamina/100)*800,14);
		}else{
                        bar.beginFill(0x999966);
			bar.drawRect(55,538,(char_stamina/100)*800,14);

			//console.log("	Crit hit!");
			//console.log("	" + upgrades.attributes[0].level * 3);
			monsters[0].current_health = monsters[0].current_health - (upgrades.attributes[0].level * 3);
			char_stamina = 0;
		}
		stage.addChild(bar);

		//console.log("	waiting in bar for " + value);
		//setTimeout(bars(2000), 2000)
		setTimeout(function(){ bars(2000 - (upgrades.attributes[3].level * 3)) }, value)
	};



	// Makes sure that you can buy what you buy, and nothing else.
	function checkAttributes(){

		//console.log("	" + upgrades.attributes[0].level);
		for(var i = 0; i < 6; i++){
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

			monsters[i].clickDamage = upgrades.attributes[1].level;
			if(monsters[i].current_health <= 0){

				addGold( parseInt( (monsters[i].gold + upgrades.attributes[2].level)) );
				addSin(parseInt(upgrades.attributes[4].level));
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
		if(kills > INDEX + 4){

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
 	        for(var i = 0; i < 5; i++){

 	               chests[i] = new chest(INDEX, i);
	               chests[i].sprite.position.x = 650; //20 + (90 * i);
        	       chests[i].sprite.position.y = 42 + (85 * i); //50;
 	               stage.addChild(chests[i].sprite);
 	        }
		
		// Next we get to change the background
        	//var BG = PIXI.Texture.fromImage("res/" + currentArea.name + ".png");
		areaBackground.setTexture(BG);
		//stage.addChild(areaBackground);
	};
}

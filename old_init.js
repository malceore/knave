// Knave 1.0.1
// Created by Brandon T. Wood on December 1st, 2013
// Knave is meant to be a combination Incremental Game and MMORPG, combining
//	the best aspects of both to make a fun browser based hybrid people
//	can pour their free time into. 


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
	//setup(); gets called by loader when completed.

	//      Maybe an area object with a background, number of monster 
	// needed to kill and list of monster objects generated inside of it
	// First area must be loaded in before the game loop, every level after
	// that will be loaded upon completion of the current one. 
}


//This load function will load any and all files nessisary before the game can run.
function load(json){
        ready++;
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
	//This stuff is just needed to setup the canvas and such.
        var stage = new PIXI.Stage(0x50503E);
        var renderer = PIXI.autoDetectRenderer(1246, 680);
        document.body.appendChild(renderer.view);

	//This is the large background piese on the left.
         var graphics = new PIXI.Graphics();
        graphics.beginFill(0x757585);
        //graphics.lineStyle(10, 0xACACB6, 1);
        graphics.drawRect(20, 150, 930, 340);
        graphics.endFill();
        graphics.interactive = true;
        graphics.buttonMode = true;
	stage.addChild(graphics);


/*temp, So background will be the floor texture. while teh wall in teh backgorund is printed using a loop and plans from the area object.
	var BG = PIXI.Texture.fromImage("dungeon_bg1.png");
	var areaBackground = new PIXI.Sprite(BG);
	areaBackground.position.x = 20;
	areaBackground.position.y = 130;
        areaBackground.scale.x = areaBackground.scale.y = 6;
	stage.addChild(areaBackground);
*/

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
	
	//Create monsters.
	//var firstArea = new area();
	//firstArea.getNewMonster();
        //var totalHealth = firstArea.monsterHealth;
        //var currentHealth = totalHealth;

	//Setting up upgrades
	var firstUpgrade = new upgrade();	


	var currentArea = new area("Dungeon 1", "test", 2, 3, null, null);
	var kills = 0;
	var doors = [];//["door1", "door2", "door3"];
        for(var i=0; i<currentArea.doors; i++){ // The number of these should be saved into the area and loaded.

		var texture = PIXI.Texture.fromImage("dungeon_door_1.png");
		// create a new Sprite using the texture
		doors[i] = new PIXI.Sprite(texture);
                doors[i].position.x = (20 + 130 * i);
                doors[i].position.y = 20;
	        doors[i].scale.x = doors[i].scale.y = 8.1;
		//Tint starts on spawn to let you know you can't open this door yet.
		doors[i].tint = 0x999966;
                stage.addChild(doors[i]);
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

//temp doors, the idea behind these doors is that as you kill enemies(5,10,15,20.. 5n) it unlocks them from left ot right, clicking a door reveals either gold, loot or a bonus enemy. 


	var currentHealth = 6;
	var totalHealth = 6;
	var health = 6;
	var gold = 0;
	

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
               
			//Checking to see if doors need to be unlocked.
			if(kills > 4){
				doors[0].tint = 0xFFFFFF;
			}
			if(kills > 9){
				doors[1].tint = 0xFFFFFF;
			}
			if(kills > 14){
				doors[2].tint = 0xFFFFFF;
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


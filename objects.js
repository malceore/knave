function area(name, bgSprite, type, doors, prev, next){

	this.name = name;
	this.bgSprite = bgSprite;
	this.type = type;
	this.doors = doors;
	this.prev = prev;
	this.next = next;	
	//this.monster = new monster();
	this.door = new door(); 
}

area.prototype.nextArea = function(){
	return this.next;
}

area.prototype.prevArea = function(){
	return this.prev;
}


function chest(level_num, chest_num){

	this.seal = chest_num * ( 3 + level_num); // The number of kills needed to open.
	this.gold = 0;
	this.type = "";

        this.sprite = new PIXI.Sprite.fromImage("res/chest_closed.png");
        this.sprite.scale.x = this.sprite.scale.y = 5.2;
        this.sprite.position.x = 10;
        this.sprite.position.y = 10;

        this.sprite.interactive = false;
        this.sprite.buttonMode = false;
        this.sprite.tint = 0x999966;

	var texture;
        this.num = Math.floor((Math.random() * 10));    
	if((this.num % 2) == 0){

		this.sprite.click = this.sprite.touchstart = function(e){

			//this.fail;
			if(this.type != "gold"){

				//console.log("   GOLD! " + this.num);
	                        texture = new PIXI.Texture.fromImage("res/chest_full.png");
	                        this.sprite.setTexture(texture);
				this.type = "gold";
				//this.fail = "fail";
			}else{

				this.gold = 50;
                                texture = new PIXI.Texture.fromImage("res/chest_empty.png");
                                this.sprite.setTexture(texture);
				this.sprite.click = this.sprite.touchstart = null;
                                this.interactive = false;
                                this.buttonMode = false;
			}			
		}.bind(this);
	}else{
 
                this.sprite.click = this.sprite.touchstart = function(e){ 

			//console.log("   Empty");
                        texture = new PIXI.Texture.fromImage("res/chest_empty.png");
                        this.sprite.setTexture(texture);
                        this.type = "empty";
                        this.sprite.interactive = false;
                        this.sprite.buttonMode = false;
                }.bind(this);
	}
}

door.prototype.reset = function() {

	console.log("	RESET!");
}


// Object holding the information of the doors/chests/loot system.
function door(area, monsters2Kill, num){

	//console.log("DOOR!");
	this.number = 0;
	this.currentDoor = "Back";
	this.doorTypes = [

                "Trap",
		"Trap",
		"Trap",
		"Monster",
		"Monster",
		"Treasure",
		"Monster",
		"Treasure",
		"Treasure",
		"Treasure",
		"Monster"
        ];
}

//This will return a door object that is either a trap, monster and escapes.
door.prototype.openDoor = function() {

	var num = Math.floor(Math.random() * 10);
	this.currentDoor = this.doorTypes[num];				
}




// New monster object, it takes an index and returns the monster's sprite.
function Monsters(level_num){

	// Randomly init some values
	this.clickDamage = 0;
        this.gold = 1 + level_num;
        this.health = 5 + Math.floor(level_num * 1.15);
	this.current_health = parseInt(this.health);
        this.name = "Firerat";
	this.animated = false; // This is for damage animation.
	//var XY = this.randomXY();
	this.generateMonster(level_num);
	//console.log("	Created a new " + this.name);
	this.monsterContainer = new PIXI.DisplayObjectContainer();

	// Setting up sprite object
        this.sprite = new PIXI.Sprite.fromImage(this.name +'.png');	
        this.sprite.scale.x = this.sprite.scale.y = 6;
        this.sprite.position.x = 200;//XY[0];
        this.sprite.position.y = 350;//XY[1];
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
	this.monsterContainer.addChild(this.sprite);

	// Setting up name text
        this.name_text = new PIXI.Text(this.name, {font:"bold 21px sans-serif", fill:"pink", align:"center"});
        this.name_text.position.x = 190;
        this.name_text.position.y = 340;
        this.monsterContainer.addChild(this.name_text);

	// New monster ratio bar.
        this.health_text = new PIXI.Text(this.current_health +"/" + this.health, {font:"bold 17px sans-serif", fill:"#CC0000", align:"center"});
        this.health_text.position.x = 220;
        this.health_text.position.y = 451;
        this.monsterContainer.addChild(this.health_text);

// DEPRECIATED FOOLS Creating Monster's Health Bar
        //this.bar = new PIXI.Graphics();
        //this.bar.beginFill(0xCC0000);
        //this.bar.lineStyle(8, 0x999966, 1);
        //this.bar.drawRect(215,475,( this.current_health/100)*800,14);
	//console.log("	" + this.health + " " + this.current_health);
        //this.monsterContainer.addChild(this.bar);

        this.sprite.click = this.sprite.touchstart = function(e){

		if(!this.animated){

			//this.current_health = this.current_health - 3;
			//console.log("	"+ this.clickDamage);
			this.current_health = this.current_health - this.clickDamage;
			this.health_text.setText(this.current_health + "/" + this.health);

		        //this.bar.drawRect(215,475,(this.current_health/100)*800,14);

			this.sprite.tint = 0xff0000;
			//var tempFilter = new PIXI.ColorMatrixFilter();
			//this.sprite.filters = [tempFilter];
			this.animated = true;
			setTimeout(this.sprite.click, 100);
			//console.log("sleepoing");
		}else{

			//console.log("Doing it!");
			//this.sprite.filters = null;
			this.sprite.tint = 0xffffff;
			this.animated = false;
		}
      	}.bind(this);	

	// Don't know why this bind thing works, but fixes my scope issues.

	this.randomXY();
	//this.monsterContainer.position.x = XY[0];
	//this.monsterContainer.position.y = XY[1];
}

// Sloppily selects two random values for monster placement.
Monsters.prototype.randomXY = function(){

	var xy = [1, 1];
        xy[0] = Math.floor((Math.random() * 340));
        xy[1] = Math.floor((Math.random() * 80));
	//this.monsterContainer.position.x = xy[0];
        //this.monsterContainer.position.y = xy[1];

        this.monsterContainer.position.x = xy[0];
        this.monsterContainer.position.y = xy[1];

	//console.log(xy[0] + " " + xy[1]);
	//return xy;	
}

// Changes the current name and texture of the monster object.
Monsters.prototype.generateMonster = function(level_num){

        this.array = [

		//Cave
                "Redslime",
                "Redslime",
		"Redslime",
                "Redslime",
                "Flamemoth",
                "Flamemoth",
		"Direrat",
                "Direrat",
                "Direrat",

		//Starting to get to Forest
		"Piggy",
                "Piggy",
		"Greenslime",
                "Shallot",
                "Shallot",
		"Leafae",

		//Waterfall
		"Snake",
                "Snake",
		"Shroomy",
		"Greenslime",

		"Pebble",
		"Pebble",
		//Riverside
		"Groaf",
		"Groaf",
		
		//Bridge
		"Gaobo",
		"Grot",
		"Rindslug",

		//Beach
		"Fluffpuff",
		"Fluffpuff",
		"Dingo",
		"Piggy",
		
		//Woods
		"Stig",
		"Direrat",
		"Deku",
		"Deku",
		"Shada",
		"Shada",

		//Dungeon
		"Oneye",
		"Oneye",
		"Bones",
		"Fallen",
		"Fallen",
		"Bones",
		"Direrat",

		//Mountain
		"Flameskull",
		""

        ];
        var num = level_num + Math.floor((Math.random() * 10));
	this.name = this.array[num];
}






// The basic object that holds all the values of the player's character.
function char(n, r, ge, go, l, t, a){

	this.name = n;
	this.race = r;
	// This value is subject to change.
	this.gender = ge;
	this.gold = go;
	this.current_Level = l;
	this.tier = t;	
	this.attributes = a;
}

char.prototype.print = function() {

	console.log("	name:" + this.name + "  gold:" + this.gold);
}

//end of area.js

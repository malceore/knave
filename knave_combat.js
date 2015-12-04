function runCombat(){

	//Important, causes antialiasing to stop.
	PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
	
	var stage = new PIXI.Stage(0x50503E);

	var renderer = PIXI.autoDetectRenderer(924, 280);

	document.body.appendChild(renderer.view);

	var graphics = new PIXI.Graphics();

	//runPanel();
	//runInventory();
	//runChat();

	this.ready = 0;

	graphics.beginFill(0x757585);
	graphics.lineStyle(10, 0xACACB6, 1);

	graphics.drawRect(20, 20, 884, 240);
	graphics.endFill();

	graphics.interactive = true;
	graphics.buttonMode = true;

	// create a texture from an image path
	var texture = PIXI.Texture.fromImage("char.PNG");
	// create a new Sprite using the texture
	var char = new PIXI.Sprite(texture);

	// center the sprites anchor point
	char.anchor.x = 0.5;
	char.anchor.y = 0.5;
	char.scale.x = char.scale.y = 2;

	// move the sprite t the center of the screen
	char.position.x = 100;
	char.position.y = 150;

	var alien;
	var alienFrames;

	//var loader = new PIXI.JsonLoader("sprite.json");
	//loader.on('loaded', function(evt) {
	//	evt.content.json
	//	console.log("Monster Appears!");
	//	var alienFrames = ["squirm.png"];
	//	alien = PIXI.Sprite.fromFrame("squirm3.png");
	//	alien.scale.x = alien.scale.y = 5;
	//	alien.position.x = 150;
	//	alien.position.y = 80;
	//	stage.addChild(alien);
	//});
	//loader.load();


	//var a = new area(10, "wild_eyes.jpg");
	//var stringer = a.getMonster;
	//console.log(stringer); 

	//var fruits = ["Banana", "Orange","Apple", "Mango"];
	//console.log(fruits.toString());
	//console.log(a.getNewMonster());
	//a.generateMonsters();
	//console.log(a.getNewMonster());
	//console.log(a.getMonster());

	//var background = PIXI.Texture.fromImage(stringer);//a.getMonster());
	//background.position.x = 0;
	//background.position.y = 0;
	//stage.addChild(background);
	
	addJson("sprite.json");

	//wait();
	while(true){
		if(this.ready <= 0){
			console.log("WORK!");
			var alien = PIXI.Sprite.fromFrame("squirm3.png");
		        alien.scale.x = alien.scale.y = 5;
                	alien.position.x = 150;
                	alien.position.y = 80;
                	stage.addChild(alien);
		}
	}

	var gold = 0;
	var totalHealth = 5;
	var currentHealth = totalHealth;

	graphics.click = function (e) {
		//gold++;
		currentHealth--;
		document.getElementById("demo").innerHTML = gold + " GP";
		//document.getElementById("counter").innterHTML = gold + "GP";
		//alien.PIXI.Sprite.fromFrame("squirm1.png");
	}

	stage.addChild(graphics);
	stage.addChild(char);

	requestAnimFrame(update);

	//Main Game Loop
	function update() {

		if(currentHealth <= 0){
			gold =+ totalHealth;
			//load new monster
		}
		//It dies!
		//requestAnimFrame(update);
		renderer.render(stage);
		requestAnimFrame(update);

	}
}

function addJson(Json){
        this.ready++;
	//console.log(this.ready);
        var loader = new PIXI.JsonLoader(Json);
        loader.on('loaded', function(evt) {
                evt.content.json
                console.log("Load Successful!");
                this.ready--;
        });
        loader.load();
}

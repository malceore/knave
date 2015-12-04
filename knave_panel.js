function runPanel(){

        var stage = new PIXI.Stage(0x50503E);
        var renderer = PIXI.autoDetectRenderer(324, 280);
        document.body.appendChild(renderer.view);

	var button = new PIXI.Graphics();
	button.beginFill(0x757585);
        button.lineStyle(10, 0xACACB6, 1);
        button.drawRect(20, 20, 884, 240);
        button.endFill();
        button.interactive = true;
        button.buttonMode = true;
        stage.addChild(button);

	console.log(this.gold);

	update2();
	function update2(){

		renderer.render(stage);
                requestAnimFrame(update2);
	}

	button.click = function(e){
		if(this.gold > 10){
			this.gold -= 10;
			console.log("Bought!");
		}
	}
}


function preloader(){
	this.ready = 0;
	this.spriteHolder;
}

preloader.prototype.addJson = function(Json){
	this.ready--;
	var loader = new PIXI.JsonLoader(Json);
        loader.on('loaded', function(evt) {
              evt.content.json
              console.log("Load Successful!");
		this.spriteHolder = PIXI.Sprite.fromFrame("squirm3.png");
		this.ready--;		
        });
        loader.load();
	this.wait();
};

preloader.prototype.wait = function(){
	function busywait(){
		if(this.ready > 0){
			busywait();
		}
	}
}


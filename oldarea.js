function area(){
	this.monstersToKill = 10;
	this.bgSprite = "bgSprite";
	this.monsterHealth;
	this.monsterName;
	this.monsterSprite;
	this.monsterArray = [
		"Flamemoth",
		"Rindslug",
		"Direrat",
		"Redslime",
                "Flamemoth",
                "Rindslug",
                "Direrat",
                "Redslime",
		"Redslime",
		"Redslime"
	];
}

area.prototype.getNewMonster = function() {
	//returns a monster randomly from the array
	var num = Math.floor((Math.random() * 10));
	//return this.fruits[num];
	this.monsterHealth = 6;
	this.monsterName = this.monsterArray[num];
	this.monsterSprite = this.monsterArray[num] + ".png";
};

//	Possibly put all the monsters into a json file and just set up the 
//new monsters stats in this file that way the loop doesn't have to change 
//for new creatures.  

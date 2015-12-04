function upgrade(){

	//OLD
	this.index = 0;
	this.damage = 1;
	this.DPS = 0.0; //Knives and Daggers
	this.clickDamage = 1.0; // Swords and Axes
	this.critRate = 0.0; //Maces and Spears
	this.percision = 1.0; // This one shrinks the range of damage

	//NEW
	this.attributes = [
			{"name":"Brutality", "cost":5, "level":1},
                	{"name":"Ferocity", "cost":5, "level":1},
                	{"name":"Cruelty", "cost":5, "level":1},
			{"name":"Willpower", "cost":5, "level":1},
			{"name":"Guile", "cost":5, "level":1},
			{"name":"Attunement", "cost":5, "level":1}
	];
};


upgrade.prototype.next = function(){

	this.damage = this.weapons[this.index].damage;
	this.index++;
};


//When upgrade is clicked, you call this and send the upgrades third variable.
//upgrade.prototype.setDamage = function(){

//	clickDamage = i; 		
//}


upgrade.prototype.increaseClickDamage = function() {
	this.clickDamage += 0.1;
};


upgrade.prototype.increasePercision = function(){
	this.percision++;
};


upgrade.prototype.getDamage = function(){
        var num = Math.floor((Math.random() * this.clickDamage));

	//if(num == this.clickDamage - 1){
	//	console.log("Cr1t1cal!");
	//	return this.percision + (num * 2);
	//}else{
	      	//console.log(this.clickDamage+num);
		return this.percision + num;
	//}
};


//	Possibly put all the monsters into a json file and just set up the 
//new monsters stats in this file that way the loop doesn't have to change 
//for new creatures.  

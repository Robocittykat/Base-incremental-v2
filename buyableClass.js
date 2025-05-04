class buyable{
	constructor(initCost,scaling = (a,b)=>a.multiply(2),softcapScaling=undefined,softcapLevel=Infinity){
		if(softcapScaling == undefined){
			this.softcapScaling = scaling
		}else{
			this.softcapScaling = softcapScaling
		}
		if(typeof initCost == "object"){ //because I need to be able to turn a JSON-ified buyable into an actual buyable
			if(initCost.type == "buyable"){
				this.level = initCost.level
				this.initCost = new BIG(initCost.initCost)
				this.cost = new BIG(initCost.cost)
				this.scaling = initCost.scaling
				this.softcapLevel = initCost.softcapLevel
				this.softcapScaling = initCost.softcapScaling
				if(this.softcapScaling == null){
					this.softcapScaling = Infinity
				}
				this.type = "buyable"
			}else if(initCost.type == "BIG"){
				this.level = 0
				this.initCost = initCost
				this.cost = initCost
				this.scaling = scaling
				this.softcapLevel = softcapLevel
				this.type = "buyable"
			}
		}else if(typeof initCost == "number"){
			this.level = 0
			this.initCost = new BIG(initCost)
			this.cost = new BIG(initCost)
			this.scaling = scaling
			this.softcapLevel = softcapLevel
			this.type = "buyable"
		}
	}
	buy(){
		this.level ++
		if(this.level >= this.softcapLevel){
			this.cost = this.softcapScaling(this.cost,this.level)
		}else{
			this.cost = this.scaling(this.cost,this.level)
		}
	}
	compareLevel(other){
		if(this.level >= other.level){
			return true
		}else{
			return false
		}
	}
	changeScaling(newScaling){
		this.scaling = newScaling
		this.cost = this.initCost
		let currentLevel = this.level
		this.level = 0
		while(this.level < currentLevel){
			this.buy()
		}
	}
}
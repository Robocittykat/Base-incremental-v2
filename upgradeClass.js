class upgrade{
	constructor(cost,elem = null,){
		if(typeof cost == "object"){
			if(cost.type == "BIG"){
				this.cost = cost
				this.elem = elem
				this.bought = false
				this.type = "upgrade"
			}else if(cost.type == "upgrade"){
				this.cost = cost.cost
				this.elem = cost.elem
				this.bought = cost.bought
				this.type = "upgrade"
			}
		}
	}
	
	canBuy(amount){
		if(!this.bought){
			if(amount.gte(this.cost)){
				this.elem.disabled = false
				return true
			}
		}
		this.elem.disabled = true
		return false
	}
	buy(){
		this.bought = true
		this.elem.innerHTML = this.elem.innerHTML.replace("Cost: "+this.cost.string(),"Bought")
		return this.cost
	}
}
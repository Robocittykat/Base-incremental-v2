class BIG{
	simplify(){
		if(this.mantissa == 0){
			this.power = 0
			return
		}
		//this.mantissa = +this.mantissa.toFixed(Math.max(this.power-1,0))
		while(this.mantissa >= this.base){
			this.mantissa /= this.base
			this.power ++
		}
		while(this.mantissa < 1){
			this.mantissa *= this.base
			this.power --
		}
		
	}
	constructor(mantissa,power=0,base=10){
		if(typeof mantissa == 'object'){
			this.mantissa = mantissa.mantissa
			this.power = mantissa.power
			this.base = mantissa.base
		}else{
			this.mantissa = mantissa
			this.power = power
			this.base = base
		}
		if(this.mantissa == Infinity){
			this.mantissa = 0
		}
		this.simplify()
		this.value = mantissa + "e" + power
		this.type = "BIG"
	}
	scaleTo(pow){
		this.mantissa /= this.base**(pow-this.power)   //10^(9-8)
		this.power = pow
	}
	changeBase(newBase){ //https://www.desmos.com/calculator/aafgacq5iu for a simplified version
		if(this.mantissa == 0){
			return new BIG(0,0,newBase)
		}
		
		let newMant = newBase**(((Math.log(this.mantissa)/Math.log(newBase))+this.power*(Math.log(this.base)/Math.log(newBase)))%1)
		let newPow = Math.floor((Math.log(this.mantissa)/Math.log(newBase))+this.power*(Math.log(this.base)/Math.log(newBase)))
		let toReturn = new BIG(newMant,newPow,newBase)
		toReturn.simplify()
		return toReturn
	}
	
	
	add(other){
		if(typeof other == 'object'){
			if(other.type == "BIG"){
				other = other.changeBase(this.base)
				other.scaleTo(this.power)
				let toReturn = new BIG(this.mantissa,this.power,this.base)
				toReturn.mantissa += other.mantissa
				toReturn.simplify()
				return toReturn
			}
		}
		else if(typeof other == 'number'){
			other = new BIG(other,0,this.base)
			other.scaleTo(this.power)
			let toReturn = new BIG(this.mantissa,this.power,this.base)
			toReturn.mantissa += other.mantissa
			toReturn.simplify()
			return toReturn
		}
	}
	subtract(other){
		if(typeof other == 'object'){
			if(other.type == "BIG"){
				other = other.changeBase(this.base)
				other.scaleTo(this.power)
				let toReturn = new BIG(this.mantissa,this.power,this.base)
				toReturn.mantissa -= other.mantissa
				toReturn.simplify()
				return toReturn
			}
		}
		else if(typeof other == 'number'){
			other = new BIG(other,0,this.base)
			other.scaleTo(this.power)
			let toReturn = new BIG(this.mantissa,this.power,this.base)
			toReturn.mantissa -= other.mantissa
			toReturn.simplify()
			return toReturn
		}
	}
	
	multiply(other){
		if(typeof other == 'object'){
			if(other.type == "BIG"){
				other = other.changeBase(this.base)
				let toReturn = new BIG(this.mantissa,this.power,this.base)
				toReturn.mantissa *= other.changeBase(this.base).mantissa
				toReturn.power += other.changeBase(this.base).power
				toReturn.simplify()
				return toReturn
			}
		}
		else if(typeof other == "number"){
			let toReturn = new BIG(this.mantissa,this.power,this.base)
			toReturn.mantissa *= other
			toReturn.simplify()
			return toReturn
		}
	}
	divide(other){
		if(typeof other == 'object'){
			if(other.type == "BIG"){
				other = other.changeBase(this.base)
				let toReturn = new BIG(this.mantissa, this.power, this.base)
				toReturn.mantissa /= other.mantissa
				toReturn.power -= other.power
				toReturn.simplify()
				return toReturn
			}
		}
		else if(typeof other == "number"){
			let toReturn = new BIG(this.mantissa,this.power,this.base)
			toReturn.mantissa /= other
			toReturn.simplify
			return toReturn
		}
	}
	
	raiseTo(other){
		let otherBreaks = 0 //Each otherbreak halves other, then raises to 2 after the fact to prevent mantissa from becoming infinity. Will usually be uesless, but if mantissa is big and raising to a high power, it prevents inf recursion when simplifying
		let toReturn = 0
		do{
			toReturn = new BIG(this.mantissa,this.power)
			toReturn.mantissa **= (other/(2**otherBreaks))
			toReturn.power *= other
			otherBreaks ++
		} while(toReturn.mantissa == Infinity)
		otherBreaks -= 1 //there will always be an extra
		toReturn.simplify()
		if(otherBreaks > 0){
			toReturn = toReturn.raiseTo(2**otherBreaks)
			toReturn.simplify()
		}
		return toReturn
	}
	log(base=this.base){
		let toReturn = new BIG(this.mantissa,this.power)
		return (Math.log10(toReturn.mantissa)/Math.log10(base)) + toReturn.power
	}
	
	
	gte(other){
		if(typeof other == 'object'){
			if(other.type == "BIG"){
				let otherPower = other.power
				let thisPower = this.power
				this.simplify()
				other.simplify()
				if(this.power > other.power){
					return true
				}
				else if(other.power > this.power){
					return false
				}
				else{
					if(other.mantissa > this.mantissa){
						return false
					}
					else{
						return true
					}
				}
			}
		}
		else if(typeof other == "number"){
			return (this.gte(new BIG(other)))
		}
	}
	lt(other){
		if(this.gte(other) == true){
			return false
		}
		else{
			return true
		}
	}
	lte(other){
		if(typeof other == 'object'){
			if(other.type == "BIG"){
				if(other.mantissa == this.mantissa && other.power == this.power){return true}
			}
			else{return this.lt(other)}
		}
		else if(typeof other == "number"){
			return (this.lte(new BIG(other)))
		}
	}
	gt(other){
		if(this.lte(other) == true){
			return false
		}else{
			return true
		}
	}
	
	string(showDec = false){
		if(this.power >= 9 || this.power <= -9){
			let mantDisp = this.mantissa.toFixed(3*(this.power < this.base**6))
			return mantDisp + "e" + this.power
		}
		else{
			return (this.mantissa*this.base**this.power).toFixed(3*showDec)+""
		}
	}
	
}
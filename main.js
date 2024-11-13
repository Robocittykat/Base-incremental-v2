localStorage.clear()

//Lookie here, I don't want any of you retrobates screaming at me for my messy code, I don't care that I'm using var instead of let, I don't care that I only sometimes use semicolons, I don't care that the game is very easily hackable. Let me live my life. (I'm gonna turn this into a news ticker, aren't I?)
//(above is outdated)

function base(value,toBase,showDec = 'auto'){
	const digits = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	let result = [];
	
	if(toBase > 60){
		toBase = 60;
	}
	
	if(typeof(value) == 'number'){
		if(value == Infinity){
			return "∞"
		}
		
		truncVal = Math.floor(value)
		while(truncVal > 0){
			result.unshift(truncVal%toBase);
			truncVal /= toBase;
			truncVal = Math.floor(truncVal);
		}
		toReturn = "";
		for(let i of result){
			toReturn += digits[i];
		}
		if(toReturn == ""){
			toReturn = "0"
		}
		
		if((value%1 != 0 && showDec=='auto') || (showDec==true)){
			decVal = value%1
			result = []
			for(let i = 0; i < 3; i++){
				decVal *= toBase
				result += [Math.floor(decVal)]
				decVal %= 1
			}
			toReturn += "."
			for(let i of result){
				toReturn += digits[i]
			}
		}
		
		return toReturn
	}else if(typeof(value) == 'object'){
		if(value.type == 'BIG'){
			value = value.changeBase(toBase)
			if(value.power >= 9){
				return base(value.mantissa,toBase,true)+"e"+base(value.power,toBase)
			}else{
				return base(Math.round(value.mantissa*value.base**value.power),toBase)
			}
		}
	}
}

function multiplyThru(list){
	let toReturn = new BIG(1)
	for(key in list){
		toReturn = list[key](toReturn)
	}
	return toReturn
}


//points tab (and curBase because why not)
let points = new BIG(0,1,2)
let curBase = 2
let pointsBuyable1Cost = new BIG(1,1,2)
let pointsBuyable1Level = 0
let pointsBuyable2Cost = new BIG(1,2,2)
let pointsBuyable2Level = 0
let galaxies = 0
let galaxyCost = 6

//base tab
let baseUpgrades = "12345"
let bestBase2 = 1

//ipsiclicker stuff because it feels like it should be on its own
let ipsiAmount = new BIG(0,0)
let ipsiKey = -1
let ipsiCost = 2
let currentTime = new Date().getTime()


//achievements variables
let currentAch = "ABCDEF"
let completedAch = ""
let numHotkeys = 0


//new variables (haven't been added to localStorage. There should be none here at the time of release, please notify the developer if you happen to see any.)
let logPoints = new BIG(0,0)
let unspentBranches = 0
let totalBranches = 0
let logUnlocked = false


//this one doesn't count
let multipliers = {
	"points":{"pointsBuyable": (a)=> a.multiply(pointsBuyable1Level+1) , "pointsBuyable2": (a)=> a.multiply(new BIG(2+(curBase*0.2*galaxies)).raiseTo(pointsBuyable2Level))}
}

const version = "v2.0.0"

if(localStorage.getItem("version") == "v2.0.0"){
	
	//THE ENTIRE HTML PAGE OH MY GOSH HOW????!?!?!?!???!?!!!?!!?!!!?
	body.innerHTML = localStorage.getItem("html")
	
	//points variables
	points = new BIG(JSON.parse(localStorage.getItem("points")))
	curBase = +localStorage.getItem("curBase")
	pointsBuyable1Cost = new BIG(JSON.parse(localStorage.getItem("pointsBuyable1Cost")))
	pointsBuyable1Level = +localStorage.getItem("pointsBuyable1Level")
	pointsBuyable2Cost = new BIG(JSON.parse(localStorage.getItem("pointsBuyable2Cost")))
	pointsBuyable2Level = +localStorage.getItem("pointsBuyable2Level")
	galaxies = +localStorage.getItem("galaxies")
	galaxyCost = +localStorage.getItem("galaxyCost")
	
	//base variables
	baseUpgrades = localStorage.getItem("baseUpgrades")
	bestBase2 = +localStorage.getItem("bestBase2")
	
	//ipsiclicker variables
	ipsiAmount = new BIG(JSON.parse(localStorage.getItem("ipsiAmount")))
	reloadIpsi()
	ipsiCost = +localStorage.getItem("ipsiCost")
	currentTime = +localStorage.getItem("currentTime")
	
	
	//achievements variabels
	currentAch = localStorage.getItem("currentAch")
	completedAch = localStorage.getItem("completedAch")
	numHotkeys = +localStorage.getItem("numHotkeys")
	achProg.value = localStorage.getItem("achProg")
	
	
	//options
	freex60.checked = JSON.parse(localStorage.getItem("freex60"))
	
	//multipliers
	
	allMultis = {"pointsBuyable": (a)=> a.multiply(pointsBuyable1Level+1) , "pointsBuyable2": (a)=> a.multiply(new BIG(2+(curBase*0.2*galaxies)).raiseTo(pointsBuyable2Level)) , "BU4": (a)=> a.multiply(bestBase2) , "free60": (a)=> a.multiply(60**freex60.checked)} //all possible multipliers
	currentMultis = JSON.parse(localStorage.getItem("pointsMultipliers"))
	
	multipliers['points'] = {}
	for(i of currentMultis){
		multipliers['points'][i] = allMultis[i]
	}
	
	
	
	
	
}



function tick(){
	//display various variables
	pointsLabel.innerHTML = base(points,curBase,false)
	pointGainLabel.innerHTML = base(multiplyThru(multipliers['points']),curBase)
	
	pointsBuyableCostLabel.innerHTML = base(pointsBuyable1Cost,curBase)
	pointsBuyable2CostLabel.innerHTML = base(pointsBuyable2Cost,curBase)
	pointsBuyable2Effect.innerHTML = Math.round((2+(curBase*0.2*galaxies))*10)/10
	
	pointsTabBaseLabel.innerHTML = curBase
	baseLabel.innerHTML = curBase
	
	ipsiLabel.innerHTML = ipsiAmount.string()
	ipsiMultiLabel.innerHTML = Math.max(curBase-ipsiCost,2)
	ipsiCostLabel.innerHTML = ipsiCost+2
	
	//disable/enable buttons based on cost
	if(points.gte(pointsBuyable1Cost)){
		pointsBuyable1.disabled = false
	}else{
		pointsBuyable1.disabled = true
	}
	
	if(points.gte(pointsBuyable2Cost)){
		pointsBuyable2.disabled = false
	}else{
		pointsBuyable2.disabled = true
	}
	
	if(logUnlocked){
		if(points.power >= 9){
			baseResetButton.disabled = false
			baseResetButton.innerHTML = "Change base for "+calculateLogPoints()+" log points."
		}else{
			baseResetButton.disabled = true
			baseResetButton.innerHTML = "Reach 1e"+base(9,curBase)+" points to change base."
		}
	}else{
		if(points.power >= 9){
			baseResetButton.disabled = false
			baseResetButton.innerHTML = "Change base. (" + curBase + " ➔ " + (curBase + 1) + ")"
		}else{
			baseResetButton.disabled = true
			baseResetButton.innerHTML = "Reach 1e"+base(9,curBase)+" points to change base."
		}
	}
	
	for(i of baseUpgrades){
		upgrade = document.getElementById("baseUpgrade"+i)
		if(curBase >= upgrade.getAttribute("cost")){
			upgrade.disabled = false
		}else{
			upgrade.disabled = true
		}
	}
	
	if(curBase-2 >= ipsiCost && ipsiAmount.lt(60)){
		buyIpsi.disabled = false
	}else{
		buyIpsi.disabled = true
	}
	
	if(pointsBuyable1Level >= galaxyCost){
		galaxButton.disabled = false
		galaxButton.innerHTML = "Reset this base to boost the effect of the second points buyable."
	}else{
		galaxButton.disabled = true
		galaxButton.innerHTML = "Reach "+galaxyCost+" purchases of the first buyable to galaxy."
	}
	
	
	
	
	
	
	
}setInterval(tick,50/3)

function tab(tab){
	var tabs = [document.getElementById("baseTab"),document.getElementById("pointsTab"),document.getElementById("endTab"),document.getElementById("achTab"),document.getElementById("optionsTab"),document.getElementById("logTab")]
	
	for(let i of tabs){
		i.hidden = true
	}
	currentTab = tab
	document.getElementById(tab+"Tab").hidden = false
}

function completeAch(which,done=true){
	
	if(currentAch.includes(which)){
		console.log(which)
		currentAch = currentAch.replace(which,"")
		if(done){
			completedAch += which
			document.getElementById("cover"+which).style.backgroundColor = "#00ff0080"
			achProg.value ++
			if(achProg.value == achProg.max){
				achProg.value = 0
				numHotkeys ++
				document.getElementById("hotkey"+numHotkeys).hidden = false
				hotkeyAmt.innerHTML = numHotkeys
			}
		}
		else{
			document.getElementById("cover"+which).style.backgroundColor = "#ff000080"
		}
	}
}

function gainPoints(){
	points = points.add(multiplyThru(multipliers["points"]))
	
	if(curBase == 2){
		if(points.gte(2)){
			completeAch("A")
		}
		if(points.gte(new BIG(1,1024,2))){
			completeAch("E")
		}
	}
	
}
function pointsBuyable(number){
	switch(number){
		case 1:
			if(points.lt(pointsBuyable1Cost)){
				return
			}
			points = points.subtract(pointsBuyable1Cost)
			pointsBuyable1Cost = pointsBuyable1Cost.multiply(curBase)
			pointsBuyable1Level ++
			break
		case 2:
			if(points.lt(pointsBuyable2Cost)){
				return
			}
			points = points.subtract(pointsBuyable2Cost)
			pointsBuyable2Cost = pointsBuyable2Cost.multiply(curBase**3)
			pointsBuyable2Level ++
			break
	}
}

function galaxy(){
	points = new BIG(0,0,curBase)
	
	pointsBuyable1Cost = new BIG(1,1,curBase)
	pointsBuyable1Level = 0
	
	pointsBuyable2Cost = new BIG(1,2,curBase)
	pointsBuyable2Level = 0
	
	galaxies ++
	galaxyCost += 2*galaxies
	completeAch("C")
}

function baseReset(){
	
	if(curBase == 2){
		if(points.lte(1)){
			points = new BIG(2)
		}
		let doubleLog = Math.log2(points.log())
		bestBase2 = Math.max(doubleLog,bestBase2)
	}
	
	curBase ++
	if(curBase == 3){
		completeAch("B")
	}
	
	points = new BIG(0,0,curBase)
	pointsBuyable1Cost = new BIG(1,1,curBase)
	pointsBuyable1Level = 0
	
	pointsBuyable2Cost = new BIG(1,2,curBase)
	pointsBuyable2Level = 0
	
	galaxies = 0
	galaxyCost = 6
	
	baseTabButton.hidden = false
}
function baseUpgrade(number){
	switch(number){
		case 1:
			pointsBuyable1.style.float = "left"
			pointsBuyable2.hidden = false
			baseResetButton.style.width = "400px"
			galaxButton.style.width = "400px"
			action1.options[2].hidden = false
			break
		case 2:
			ipsiDiv.hidden = false
			ipsiAmount = new BIG(1,0)
			reloadIpsi()
			action1.options[5].hidden = false
			action1.options[6].hidden = false
			break
		case 3:
			galaxDiv.hidden = false
			action1.options[3].hidden = false
			break
		case 4:
			multipliers['points']['BU4'] = (a)=> a.multiply(bestBase2)
			fastEnterButton.hidden = false
			action1.options[7].hidden = false
			break
		case 5:
			logTabButton.hidden = false
			baseResetButton.classList.remove("baseButton")
			baseResetButton.classList.add("logButton")
			logUnlocked = true
			completeAch("A",false)
			completeAch("B",false)
			completeAch("C",false)
			completeAch("D",false)
			completeAch("E",false)
			completeAch("F",false)
			currentAch = "GHIJKL"
			multipliers['points']['logMulti'] = (a)=> a.multiply(2)
			
			/*endTabButton.hidden = false
			tab("end")
			winMulti.hidden = false
			multipliers['points']['free60'] = (a)=> a.multiply(60**freex60.checked)*/
			break
	}
	upgrade = document.getElementById("baseUpgrade"+number)
	baseUpgrades = baseUpgrades.replace(number,'')
	if(number != 5){ //BU5 does not decrease base
		curBase -= (upgrade.getAttribute("cost")-2)
		pointsBuyable1Level = 0
		pointsBuyable2Level = 0
		pointsBuyable1Cost = new BIG(1,1,curBase)
		pointsBuyable2Cost = new BIG(1,2,curBase)
		points = points.changeBase(curBase)
		upgrade.innerHTML = upgrade.innerHTML.replace("Cost: "+upgrade.getAttribute("cost")+" base","Bought")
		upgrade.disabled = true
	}else{
		upgrade.innerHTML = upgrade.innerHTML.replace("Req: "+upgrade.getAttribute("cost")+" base","Bought")
		upgrade.disabled = true
	}
}

function buyIpsiclicker(){
	curBase -= ipsiCost
	pointsBuyable1Level = 0
	pointsBuyable2Level = 0
	pointsBuyable1Cost = new BIG(1,1,curBase)
	pointsBuyable2Cost = new BIG(1,2,curBase)
	points = points.changeBase(curBase)
	
	ipsiAmount = ipsiAmount.multiply(curBase)
	
	if(ipsiAmount.mantissa*10**ipsiAmount.power == 60){
		completeAch("D")
	}
	if(ipsiAmount.gte(60)){
		ipsiAmount = new BIG(60)
	}
	
	ipsiCost ++
	reloadIpsi()
}
function reloadIpsi(){
	clearInterval(ipsiKey)
	currentTime = new Date().getTime()
	if(ipsiAmount.gte(0)){
		ipsiKey = setInterval(ipsiclick,1000/ipsiAmount.string())
	}
}
function ipsiclick(){
	let timeGap = new Date().getTime() - currentTime //timeGap is like delta, should be 1000/60 but could be off due to lag
	currentTime = new Date().getTime()
	let goalGap = 1000/ipsiAmount.string()
	prodMulti = Math.round(timeGap/goalGap)
	
	points = points.add(multiplyThru(multipliers["points"]).multiply(prodMulti))
	
	if(curBase == 2){
		if(points.gte(new BIG(1,1024,2))){
			completeAch("E")
		}
	}
}
function respecIpsi(){
	if(!confirm("Are you sure? Your ipsiclickers will be set back to 1 and your base will not be refunded. This is only useful if you want to try for better multipliers.")){
		return
	}
	ipsiAmount = new BIG(1,0)
	ipsiCost = 2
	reloadIpsi()
}

function fastEnter(){
	if(!confirm("Are you sure? Your base will be set back to 2, and you will lose all of your points and buyables. This is only useful if you want to grind points in base 2 for base upgrade 4.")){
		return
	}
	
	if(curBase >= 10){
		completeAch("F")
	}
	
	curBase = 2
	
	points = new BIG(0,0,curBase)
	pointsBuyable1Cost = new BIG(1,1,curBase)
	pointsBuyable1Level = 0
	
	pointsBuyable2Cost = new BIG(1,2,curBase)
	pointsBuyable2Level = 0
	
	galaxies = 0
	galaxyCost = 6
}

function calculateLogPoints(){
	return 0
}

function logUpgrade(number){
	upgrade = document.getElementById("log"+number) //gets the html element of the upgrade in question
	if(upgrade.classList.contains("logButton")){
		return //if it's already bought, cancels
	}
	if(number != 1){
		if(!document.getElementById("log"+Math.floor(number / 10)).classList.contains("logButton")){
			return //if the previous upgrade hasn't been bought, cancels. Doesn't count for upgrade 1
		}
	}
	
	switch(number){ //apply the effects of the upgrade
		case 1:
			break
		case 10:
			break
		case 11:
			break
		case 100:
			break
		case 101:
			break
		case 110:
			break
		case 111:
			break
		case 1000:
			break
		case 1001:
			break
		case 1010:
			break
		case 1011:
			break
		case 1100:
			break
		case 1101:
			break
		case 1110:
			break
		case 1111:
			break
	}
	
	upgrade.classList.add("logButton") //mark that the upgrade is active
	if(number != 1){
		document.getElementById("to"+number).style.stroke = "#840" //set the color of the line, no line for upgrade 1
	}
}


function devSkip(){
	curBase = 11
	baseReset()
	baseUpgrade(1)
	baseUpgrade(2)
	baseUpgrade(3)
	baseUpgrade(4)
	curBase = 7
	buyIpsiclicker()
	curBase = 6
	buyIpsiclicker()
	curBase = 6
	buyIpsiclicker()
	curBase = 7
	buyIpsiclicker()
	curBase = 9
	baseReset()
	
}

function exportSave(){
	autosave()
	navigator.clipboard.writeText(JSON.stringify(localStorage))
}

function importSave(saveText){
	saveText = JSON.parse(saveText)
	localStorage.clear()
	for(key in saveText){
		localStorage.setItem(key, saveText[key])
	}
	location.reload()
}









devSkip()
localStorage.clear()
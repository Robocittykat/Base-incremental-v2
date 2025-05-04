//localStorage.clear()

//Lookie here, I don't want any of you retrobates screaming at me for my messy code, I don't care that I'm using var instead of let, I don't care that I only sometimes use semicolons, I don't care that the game is very easily hackable. Let me live my life. (I'm gonna turn this into a news ticker, aren't I?)
//(above is outdated)

function duplicateJSON(oldJSON){ //because JSON.parse(JSON.stringify(<JSON>)) sucks, I made another way to duplicate.
	let newJSON = {}
	for(let key in oldJSON){
		if(typeof oldJSON[key] == "object"){
			newJSON[key] = duplicateJSON(oldJSON[key])
			if(oldJSON[key].type == "BIG"){
				newJSON[key] = new BIG(newJSON[key])
			}else if(oldJSON[key].type == "buyable"){
				newJSON[key] = new buyable(newJSON[key])
			}else if(oldJSON[key].type == "upgrade"){
				newJSON[key] = new buyable(newJSON[key])
			}
		}else{
			newJSON[key] = oldJSON[key]
		}
	}
	return newJSON
}JSON.duplicate = duplicateJSON //To fit the style of other JSON static methods, both call methods work

function stringJSON(oldJSON){
	let newJSON = {}
	for(let key in oldJSON){
		if(typeof oldJSON[key] == "object"){
			newJSON[key] = stringJSON(oldJSON[key])
		}else if(oldJSON[key] == Infinity){
			newJSON[key] = "Infinity"
		}else if(typeof oldJSON[key] == "function"){
			newJSON[key] = oldJSON[key].toString()
		}else{
			newJSON[key] = oldJSON[key]
		}
	}
	newJSON = JSON.stringify(newJSON)
	return newJSON
}
function destringJSON(oldJSON){
	oldJSON = JSON.parse(oldJSON)
	for(i in oldJSON){
		if(typeof oldJSON[i] == 'string'){
			if(oldJSON[i][0] == '{'){//hopefully that means its a json :) (probably not because JSONs hate me >:(  )
				oldJSON[i] = destringJSON(oldJSON[i])
			}else if(oldJSON[i] == "Infinity"){
				oldJSON[i] = Infinity
			}else if(oldJSON[i][0] == "f" && oldJSON[i][oldJSON[i].length-1] == "}" || oldJSON[i][0] == "("){
				oldJSON[i] = eval(oldJSON[i])
			}
		}
	}
	if(oldJSON.type == "BIG"){
		oldJSON = new BIG(oldJSON)
	}else if(oldJSON.type == "upgrade"){
		oldJSON = new upgrade(oldJSON)
	}else if(oldJSON.type == "buyable"){
		oldJSON = new buyable(oldJSON)
	}
	return oldJSON
}

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
				return base(value.mantissa,toBase,showDec)+"e"+base(value.power,toBase)
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

function pluralize(amount,unit,end="s",removeLast=false){ //amount is how many, unit is the type, end is what to add onto the end if it is plural, removeLast if for words like "baby" which becomes "babies"
	if(amount != 1){
		if(removeLast){
			return amount+" "+unit.slice(0,-1)+end
		}else{
			return amount+" "+unit+end
		}
	}else{
		return amount+" "+unit
	}
}

function hide(elem){
	elem.hidden = true
	visibleThings[elem.id] = elem.hidden
}
function show(elem){
	elem.hidden = false
	visibleThings[elem.id] = elem.hidden
	
}

function unlockAction(number){
	for(let i = 1; i <= 1; i++){
		document.getElementById("action" + i).options[number].hidden = false
		visibleThings["hotkeyOptions"][number] = false
	}
}

let player = {
	//points vars
	points: new BIG(0,1,2),
	curBase: 2,
	pointsBuyable1: new buyable(new BIG(1,1,2),(a,b)=>a.multiply(player.curBase)),
	pointsBuyable2: new buyable(new BIG(1,1,2),(a,b)=>a.multiply(player.curBase**(3+Math.floor(b/50)))),
	galaxies: 0,
	galaxyCost: 5,
	//base vars
	baseUpgrades: "123456",
	boughtBaseUpgrades: "",
	bestBase2: 1,
	ipsiAmount: new BIG(0,0),
	ipsiCost: 2,
	
	currentAch: "ABCDEF",
	completedAch: "",
	numHotkeys: 0,
}

let visibleThings = {
	//when things hide/unhide throughout the game, this is for the sole purpose of saving across versions
	"baseTabButton": true,
	"pointsBuyable2Button": true,
	"ipsiDiv": true,
	"galaxDiv": true,
	"fastEnterButton": true,
	"endTabButton": true,
	"winMulti": true,
	"pointsTabExtraInfo": true,
	
	"hotkeyOptions": {
			0: false, //+ points
			1: false, //1st points buyable
			2: true, //2nd points buyable
			3: true, //galaxy
			4: false, //base reset
			5: true, //ipsiclicker
			6: true, //respec ipsi
			7: true, //enter base 2
		},
}


let ipsiKey = -1
let currentTime = new Date().getTime()



//this one doesn't count
let multipliers = {
	"points":{"pointsBuyable": (a)=> a.multiply(player.pointsBuyable1.level+1) , "pointsBuyable2": (a)=> a.multiply(new BIG(2+(player.curBase*0.2*player.galaxies)).raiseTo(player.pointsBuyable2.level))}
}

const version = "v2.0.2" //the update that added buy max or smth idk (and a new BU and organized the code a bit)


if(localStorage.getItem("version") == "v2.0.2"){
	
	player = destringJSON(localStorage.getItem("player"))
	
	
	
	currentTime = localStorage.getItem("currentTime")
	visibleThings = destringJSON(localStorage.getItem("visibleThings"))
	
	freex60.checked = localStorage.getItem("freex60")
	
	achProg.value = localStorage.getItem("achProg")
	
	for(i in visibleThings){
		if(! (["hotkeyOptions"].includes(i))){
			console.log(i)
			document.getElementById(i).hidden = visibleThings[i]
		}else{
			switch(i){
				case "hotkeyOptions":
					for(j in visibleThings[i]){
						unlockAction(j)
					}
			}
		}
	}
	
	for(i=0; i<player.boughtBaseUpgrades.length; i++){
		baseUpgradeSemibuy(player.boughtBaseUpgrades[i])
	}
	
	
	if(pointsBuyable2Button.hidden == false){
		pointsBuyable1Button.style.float = "left"
		pointsBuyable1Button.style.left = "-200px"
		baseResetButton.style.width = "400px"
		galaxButton.style.width = "400px"
		buyMaxPoints.style.width = "200px"
	}
	if(galaxButton.hidden == false){
		baseResetButton.style.top = "413.5px"
	}
	
	//multipliers
	
	allMultis = {"pointsBuyable": (a)=> a.multiply(player.pointsBuyable1.level+1) , "pointsBuyable2": (a)=> a.multiply(new BIG(2+(player.curBase*0.2*player.galaxies)).raiseTo(player.pointsBuyable2.level)) , "BU4": (a)=> a.multiply(player.bestBase2) , "free60": (a)=> a.multiply(60**freex60.checked) , "distance": (a)=> a.multiply((10-player.curBase)+2) , } //all possible multipliers
	currentMultis = JSON.parse(localStorage.getItem("pointsMultipliers"))
	
	multipliers['points'] = {}
	for(i of currentMultis){
		multipliers['points'][i] = allMultis[i]
	}
	
	for(i of player.completedAch){
		completeAch(i,true,true)
	}
	
}else if(localStorage.getItem('version') == "v2.0.0"){
	notify("Sorry, your existing save from version 2.0.0 is incompatable with the current saving system. I have taken measures to prevent this from happening in the future.")
}



function tick(){

	//display various variables
	pointsLabel.innerHTML = pluralize(base(player.points,player.curBase),"point")
	pointGainLabel.innerHTML = pluralize(base(multiplyThru(multipliers['points']),player.curBase),"point")
	
	pointsBuyableCostLabel.innerHTML = base(player.pointsBuyable1.cost,player.curBase)
	pointsBuyable2CostLabel.innerHTML = base(player.pointsBuyable2.cost,player.curBase)
	pointsBuyable2Effect.innerHTML = Math.round((2+(player.curBase*0.2*player.galaxies))*10)/10
	pb1LevelLabel.innerHTML = player.pointsBuyable1.level
	pb2LevelLabel.innerHTML = player.pointsBuyable2.level
	
	pointsTabBaseLabel.innerHTML = player.curBase
	baseLabel.innerHTML = player.curBase
	
	ipsiLabel.innerHTML = pluralize(player.ipsiAmount.string(),"ipsiclicker")
	ipsiMultiLabel.innerHTML = Math.max(player.curBase-player.ipsiCost,2)
	ipsiCostLabel.innerHTML = player.ipsiCost+2
	
	brrBase.innerHTML = player.curBase
	brrPow.innerHTML = Math.floor(player.curBase/5)+7
	
	if(player.curBase == 2 && !player.baseUpgrades.includes("4")){
		pointsTabExtraInfo.innerHTML = "Resetting now would give a multiplier of "+(2+(player.curBase*0.2*player.galaxies)).toFixed(1)
	}else{
		pointsTabExtraInfo.innerHTML = "The BRR power increases by 1 every 5 bases"
	}
	
	//disable/enable buttons based on cost
	if(player.points.gte(player.pointsBuyable1.cost)){
		pointsBuyable1Button.disabled = false
	}else{
		pointsBuyable1Button.disabled = true
	}
	
	if(player.points.gte(player.pointsBuyable2.cost)){
		pointsBuyable2Button.disabled = false
	}else{
		pointsBuyable2Button.disabled = true
	}
	
	if(player.points.power >= (7+Math.floor(player.curBase/5))){
		baseResetButton.disabled = false
		baseResetButton.innerHTML = "Reset points and buyables, but change base. (" + player.curBase + " ➔ " + (player.curBase + 1) + ")"
	}else{
		baseResetButton.disabled = true
		baseResetButton.innerHTML = "Reach "+base(new BIG(1,7+Math.floor(player.curBase/5),player.curBase),player.curBase,false)+" points to change base."
	}
	
	for(i of player.baseUpgrades){
		upgrade = document.getElementById("baseUpgrade"+i)
		if(player.curBase >= upgrade.getAttribute("cost")){
			upgrade.disabled = false
		}else{
			upgrade.disabled = true
		}
	}
	
	if(player.curBase-2 >= player.ipsiCost && player.ipsiAmount.lt(60)){
		buyIpsi.disabled = false
	}else{
		buyIpsi.disabled = true
	}
	
	if(player.pointsBuyable1.level >= player.galaxyCost){
		galaxButton.disabled = false
		galaxButton.innerHTML = "Reset this base to boost the effect of the second points buyable."
	}else{
		galaxButton.disabled = true
		galaxButton.innerHTML = "Reach "+player.galaxyCost+" purchases of the first buyable to galaxy."
	}
	
	
	
	
	
	
	
}setInterval(tick,50/3)

function tab(tab){
	var tabs = [document.getElementById("baseTab"),document.getElementById("pointsTab"),document.getElementById("endTab"),document.getElementById("achTab"),document.getElementById("optionsTab")]
	
	for(let i of tabs){
		i.hidden = true
	}
	currentTab = tab
	document.getElementById(tab+"Tab").hidden = false
}

function completeAch(which,done=true,override=false){
	
	if(player.currentAch.includes(which) || override){
		console.log(which)
		player.currentAch = player.currentAch.replace(which,"")
		if(done){
			if(!override){
				player.completedAch += which
			}
			document.getElementById("cover"+which).style.backgroundColor = "#00ff0080"
			achProg.value ++
			if(achProg.value == achProg.max && !override){
				achProg.value = 0
				player.numHotkeys ++
				document.getElementById("hotkey"+player.numHotkeys).hidden = false
				hotkeyAmt.innerHTML = player.numHotkeys
			}
		}
		else{
			document.getElementById("cover"+which).style.backgroundColor = "#ff000080"
		}
	}
}

function gainPoints(){
	player.points = player.points.add(multiplyThru(multipliers["points"]))
	
	if(player.curBase == 2){
		if(player.points.gte(2)){
			completeAch("A")
		}
		if(player.points.gte(new BIG(1,1024,2))){
			completeAch("E")
		}
	}
	
}
function pointsBuyable(number){
	switch(number){
		case 0:
			while(player.points.gte(player.pointsBuyable2.cost) && pointsBuyable2Button.hidden == false){
				pointsBuyable(2)
			}
			while(player.points.gte(player.pointsBuyable1.cost)){
				pointsBuyable(1)
			}
		case 1:
			if(player.points.lt(player.pointsBuyable1.cost)){
				return
			}
			player.points = player.points.subtract(player.pointsBuyable1.cost)
			player.pointsBuyable1.buy()
			break
		case 2:
			if(player.points.lt(player.pointsBuyable2.cost)){
				return
			}
			player.points = player.points.subtract(player.pointsBuyable2.cost)
			player.pointsBuyable2.buy()
			break
	}
}

function galaxy(){
	if(player.pointsBuyable1.level < player.galaxyCost){
		return
	}
	
	player.points = new BIG(0,0,player.curBase)
	
	player.pointsBuyable1 = new buyable(new BIG(1,1,player.curBase),(a,b)=> a.multiply(player.curBase))
	
	player.pointsBuyable2 = new buyable(new BIG(1,1,player.curBase),(a,b)=> a.multiply(player.curBase**(3+Math.floor(b/50))))
	
	player.galaxies ++
	player.galaxyCost += 2*player.galaxies
	completeAch("C")
	
	if(player.curBase == 2 && player.galaxies == 15){
		completeAch("E")
	}
}

function baseReset(){
	if(player.points.power < (7+Math.floor(player.curBase/5))){
		return
	}
	
	if(player.curBase == 2){
		let pendMult = (2+(player.curBase*0.2*player.galaxies))
		player.bestBase2 = Math.max(pendMult,player.bestBase2)
	}
	if(player.curBase == 4){
		show(pointsTabExtraInfo)
	}
	
	player.curBase ++
	if(player.curBase == 3){
		completeAch("B")
	}
	if(player.curBase == 10){
		completeAch("F")
	}
	
	player.points = new BIG(0,0,player.curBase)
	player.pointsBuyable1 = new buyable(new BIG(1,1,player.curBase),(a,b)=> a.multiply(player.curBase))
	
	player.pointsBuyable2 = new buyable(new BIG(1,1,player.curBase),(a,b)=> a.multiply(player.curBase**(3+Math.floor(b/50))))
	
	player.galaxies = 0
	player.galaxyCost = 5
	
	show(baseTabButton)
}
function baseUpgrade(number){
	switch(number){
		case 1:
			pointsBuyable1Button.style.float = "left"
			pointsBuyable1Button.style.left = "-200px"
			show(pointsBuyable2Button)
			baseResetButton.style.width = "400px"
			galaxButton.style.width = "400px"
			buyMaxPoints.style.width = "200px"
			unlockAction(2)
			break
		case 2:
			player.ipsiAmount = new BIG(1,0)
			reloadIpsi()
			show(ipsiDiv)
			unlockAction(5)
			unlockAction(6)
			break
		case 3:
			show(galaxDiv)
			unlockAction(3)
			baseResetButton.style.top = "413.5px"
			break
		case 4:
			multipliers['points']['BU4'] = (a)=> a.multiply(player.bestBase2)
			show(fastEnterButton)
			unlockAction(7)
			break
		case 5:
			show(endTabButton)
			tab("end")
			show(winMulti)
			multipliers['points']['free60'] = (a)=> a.multiply(60**freex60.checked)
			break
		case 6:
			multipliers['points']['distance'] = (a)=> a.multiply((10-player.curBase)+2)
			break
	}
	if(number != 5){ //BU5 does not decrease base
		upgrade = document.getElementById("baseUpgrade"+number)
		player.baseUpgrades = player.baseUpgrades.replace(number,'')
		player.boughtBaseUpgrades += number
		player.curBase -= (upgrade.getAttribute("cost")-2)
		player.pointsBuyable1 = new buyable(new BIG(1,1,player.curBase),(a,b)=> a.multiply(player.curBase))
		player.pointsBuyable2 = new buyable(new BIG(1,1,player.curBase),(a,b)=> a.multiply(player.curBase**(3+Math.floor(b/50))))
		player.points = player.points.changeBase(player.curBase)
		upgrade.innerHTML = upgrade.innerHTML.replace("Cost: "+upgrade.getAttribute("cost")+" base","Bought")
		upgrade.disabled = true
	}else{
		upgrade.innerHTML = upgrade.innerHTML.replace("Req: "+upgrade.getAttribute("cost")+" base","Bought")
		upgrade.disabled = true
	}
}

function baseUpgradeSemibuy(number){
	if(number != 5){ //BU5 does not decrease base
		upgrade = document.getElementById("baseUpgrade"+number)
		player.baseUpgrades = player.baseUpgrades.replace(number,'')
		upgrade.innerHTML = upgrade.innerHTML.replace("Cost: "+upgrade.getAttribute("cost")+" base","Bought")
		upgrade.disabled = true
	}else{
		upgrade = document.getElementById("baseUpgrade"+number)
		upgrade.innerHTML = upgrade.innerHTML.replace("Req: "+upgrade.getAttribute("cost")+" base","Bought")
		upgrade.disabled = true
	}
}

function buyIpsiclicker(){
	player.curBase -= player.ipsiCost
	player.pointsBuyable1 = new buyable(new BIG(1,1,player.curBase),(a,b)=> a.multiply(player.curBase))
	player.pointsBuyable2 = new buyable(new BIG(1,1,player.curBase),(a,b)=> a.multiply(player.curBase**(3+Math.floor(b/50))))
	player.points = player.points.changeBase(player.curBase)
	
	player.ipsiAmount = player.ipsiAmount.multiply(player.curBase)
	
	if(player.ipsiAmount.mantissa*10**player.ipsiAmount.power == 60){
		completeAch("D")
	}
	if(player.ipsiAmount.gte(60)){
		player.ipsiAmount = new BIG(60)
	}
	
	player.ipsiCost ++
	reloadIpsi()
}
function reloadIpsi(){
	clearInterval(ipsiKey)
	currentTime = new Date().getTime()
	if(player.ipsiAmount.gte(0)){
		ipsiKey = setInterval(ipsiclick,1000/player.ipsiAmount.string())
	}
}
function ipsiclick(){
	let timeGap = new Date().getTime() - currentTime //timeGap is like delta, should be 1000/60 but could be off due to lag
	currentTime = new Date().getTime()
	let goalGap = 1000/player.ipsiAmount.string()
	prodMulti = Math.round(timeGap/goalGap)
	
	player.points = player.points.add(multiplyThru(multipliers["points"]).multiply(prodMulti))
	
}
function respecIpsi(){
	if(!confirm("Are you sure? Your ipsiclickers will be set back to 1 and your base will not be refunded. This is only useful if you want to try for better multipliers.")){
		return
	}
	player.ipsiAmount = new BIG(1,0)
	player.ipsiCost = 2
	reloadIpsi()
}

function fastEnter(){
	if(!confirm("Are you sure? Your base will be set back to 2, and you will lose all of your points and buyables. This is only useful if you want to grind points in base 2 for base upgrade 4.")){
		return
	}
	
	player.curBase = 2
	
	player.points = new BIG(0,0,player.curBase)
	player.pointsBuyable1 = new buyable(new BIG(1,1,player.curBase),(a,b)=> a.multiply(player.curBase))
	player.pointsBuyable2 = new buyable(new BIG(1,1,player.curBase),(a,b)=> a.multiply(player.curBase**(3+Math.floor(b/50))))
	
	player.galaxies = 0
	player.galaxyCost = 5
}


function devSkip(){
	player.curBase = 13
	baseReset()
	baseUpgrade(1)
	baseUpgrade(2)
	baseUpgrade(3)
	baseUpgrade(4)
	baseUpgrade(6)
	player.curBase = 6
	buyIpsiclicker()
	player.curBase = 6
	buyIpsiclicker()
	player.curBase = 6
	buyIpsiclicker()
	
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



reloadIpsi()





//setTimeout(devSkip(),0)
//localStorage.clear()


function autosave(){
	localStorage.clear()
	//points variables
	localStorage.setItem("points",JSON.stringify(points))
	localStorage.setItem("curBase",curBase)
	localStorage.setItem("pointsBuyable1Cost",JSON.stringify(pointsBuyable1Cost))
	localStorage.setItem("pointsBuyable1Level",pointsBuyable1Level)
	localStorage.setItem("pointsBuyable2Cost",JSON.stringify(pointsBuyable2Cost))
	localStorage.setItem("pointsBuyable2Level",pointsBuyable2Level)
	localStorage.setItem("galaxies",galaxies)
	localStorage.setItem("galaxyCost",galaxyCost)
	
	//base variables
	localStorage.setItem("baseUpgrades",baseUpgrades)
	localStorage.setItem("bestBase2",bestBase2)
	
	//ipsiclicker variables
	localStorage.setItem("ipsiAmount",JSON.stringify(ipsiAmount))
	localStorage.setItem("ipsiCost",ipsiCost)
	localStorage.setItem("currentTime",currentTime)
	
	
	//achievements variables
	localStorage.setItem("currentAch",currentAch)
	localStorage.setItem("completedAch",completedAch)
	localStorage.setItem("numHotkeys",numHotkeys)
	localStorage.setItem("achProg",achProg.value)
	
	
	//options
	localStorage.setItem("freex60",freex60.checked)
	
	localStorage.setItem("version",version)
	
	
	//multipliers
	localStorage.setItem("pointsMultipliers",JSON.stringify(Object.keys(multipliers['points'])))
	
	
	//THE ENTIRE HTML PAGE OH MY GOSH HOW????!?!?!?!???!?!!!?!!?!!!?
	localStorage.setItem("html",body.innerHTML)
	
	console.log("saving")
}setInterval(autosave,30000)
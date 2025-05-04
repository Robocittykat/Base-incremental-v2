function autosave(){
	localStorage.clear()
	
	localStorage.setItem("player",stringJSON(player))
	
	
	localStorage.setItem("currentTime",currentTime)

	localStorage.setItem("achProg",achProg.value)
	
	
	//options
	localStorage.setItem("freex60",freex60.checked)
	
	localStorage.setItem("version",version)
	
	
	//multipliers
	localStorage.setItem("pointsMultipliers",JSON.stringify(Object.keys(multipliers['points'])))
	
	
	localStorage.setItem("visibleThings",stringJSON(visibleThings))
	//THE ENTIRE HTML PAGE OH MY GOSH HOW????!?!?!?!???!?!!!?!!?!!!?   (This is actually incredibly problematic, yay!)
	//localStorage.setItem("html",body.innerHTML)
	
	console.log("saving")
}setInterval(autosave,30000)
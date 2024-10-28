function getAction(number){
	console.log(number)
	return document.getElementById("action"+number).value
}
function getMode(number){
	return document.getElementById("mode"+number).value
}




let holdingKeys = []
let actions = {0:pointsClickable,1:pointsBuyable1,2:pointsBuyable2,3:galaxButton,4:baseResetButton,5:buyIpsi,6:respecIpsi,7:fastEnterButton}

holdingKeys.contains = function(item){
	if(holdingKeys.indexOf(item) >= 0){
		return true
	}else{
		return false
	}
}


document.onkeydown = function(key){
	if(key.which >= 49 && key.which < (49 + numHotkeys)){
		if(getMode(key.which - 48) == "0"){
			if(!holdingKeys.contains(key.which - 48)){
				if(actions[getAction(key.which - 48)].disabled == false && actions[getAction(key.which-48)].hidden == false){
					actions[getAction(key.which - 48)].onclick()
				}
				holdingKeys.unshift(key.which - 48)
			}
		}else if(getMode(key.which - 48) == "1"){
			if(actions[getAction(key.which - 48)].disabled == false && actions[getAction(key.which-48)].hidden == false){
				actions[getAction(key.which - 48)].onclick()
			}
		}else{
			if(!holdingKeys.contains(key.which - 48)){
				holdingKeys.unshift(key.which - 48)
			}
		}
	}
}
document.onkeyup = function(key){
	if(holdingKeys.contains(key.which - 48)){
		holdingKeys.splice(holdingKeys.indexOf(key.which-48,1))
	}
}

function resolveHolding(){
	for(let i of holdingKeys){
		if(getMode(i) == "2"){
			if(actions[getAction(i)].disabled == false && actions[getAction(i)].hidden == false){
				actions[getAction(i)].onclick()
			}
		}
	}
}setInterval(resolveHolding,3/50)




/*
ch|cd
0 |48/96
1 |49/97
2 |50/98
3 |51/99
4 |52/100
5 |53/101
6 |54/102
7 |55/103
8 |56/104
9 |57/105
a |65
b |66
c |67
d |68
e |69
f |70
g |71
h |72
i |73
j |74
k |75
l |76
m |77
n |78
o |79
p |80
q |81
r |82
s |83
t |84
u |85
v |86
w |87
x |88
y |89
z |90
*/

/*
if key <= numHotkeys
	if key.mode == single
		if not in holdingKeys
			activate
			add to holdingKeys
	elif key.mode == repeat
		activate
	elif key.mode == rapid fire
		if not in holdingKeys
			add to holdingKeys

setInterval() => {
	for i of holdingKeys
		i.activate
}
*/
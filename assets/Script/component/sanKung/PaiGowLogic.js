var COMB_TYPE_NONE   =    0          // 0点
var COMB_TYPE_OX1    =    1          // 一筒
var COMB_TYPE_OX2    =    2          // 二筒
var COMB_TYPE_OX3    =    3          // 三筒
var COMB_TYPE_OX4    =    4          // 四筒
var COMB_TYPE_OX5    =    5          // 五筒
var COMB_TYPE_OX6    =    6          // 六筒
var COMB_TYPE_OX7    =    7          // 七筒  
var COMB_TYPE_OX8    =    8          // 八筒
var COMB_TYPE_OX9    =    9          // 九筒
var COMB_TYPE_DUI1   =    11         // 一筒对子
var COMB_TYPE_DUI2   =    12         // 二筒对子
var COMB_TYPE_DUI3   =    13         // 三筒对子
var COMB_TYPE_DUI4   =    14         // 四筒对子
var COMB_TYPE_DUI5   =    15         // 五筒对子
var COMB_TYPE_DUI6   =    16         // 六筒对子
var COMB_TYPE_DUI7   =    17         // 七筒对子
var COMB_TYPE_DUI8   =    18         // 八筒对子
var COMB_TYPE_DUI9   =    19         // 九筒对子
var COMB_TYPE_DUI10  =    20         // 白板对子


module.exports.getCards = function() {
	var cards = {}                       //牌组
	var cardCount = 0                    //卡牌剩余数量
	for(var i = 1;i <= 10;i++){
		for(var j = 0;j < 2;j++){
			cards[cardCount++] = {num : i,type : 0}
		}
	}
	//洗牌
	for(var i = 0;i < cardCount;i++){
	  var tmpIndex = Math.floor(Math.random() * (cardCount - 0.000001))
	  var tmpCard = cards[i]
	  cards[i] = cards[tmpIndex]
	  cards[tmpIndex] = tmpCard
	}  
  return cards
}


module.exports.getType = function(handCard) {
	var result = {
		"type" : 0
	}
	//找出最大的牌
	if(handCard[0].num >= handCard[1].num){
		result.card = handCard[0]
	}else{
		result.card = handCard[1]
	}

	if(handCard[0].num === handCard[1].num){
		result.type = handCard[0].num + 10
	}else{
		result.type = (handCard[0].num + handCard[1].num) % 10
	}
	return result
}

//对比手牌   返回true为第一个玩家赢，false为第二个玩家赢
module.exports.compare = function(result1,result2) {
	//同点同牌为平
	if(result1.type == result2.type && result1.card.num == result2.card.num){
		return "tie"
	}
	if(result1.type > result2.type){
		return "win"
	}
	if(result1.type == result2.type && result1.card.num > result2.card.num){
		return "win"
	}
	return "lose"
}

//幸运值控制
module.exports.luckyControl = function(player) {
    var flag = false
    var winList = []
    var lostList = []	
    for(var i = 0;i < GAME_PLAYER;i++){
		if(player[i].isActive && player[i].isReady){
			var contorlValue = parseFloat(player[i].playerInfo["contorl"])
			if(contorlValue != 0){
				flag = true
			}
			if(contorlValue > 0){
				if(Math.random() < contorlValue){
					winList.push(i)
				}
			}else if(contorlValue < 0){
				if(Math.random() < -contorlValue){
					lostList.push(i)
				}
			}
		}
    }

    if(winList.length > 0 || lostList.length > 0){
    	//打乱顺序
    	winList = shuffle(winList)
    	lostList = shuffle(lostList)
	    console.log("controlList")
	    console.log(winList)
	    console.log(lostList)

		var handCards = []
		var result = []
		var list = []
		//记初始信息
	    for(var i = 0;i < GAME_PLAYER;i++){
			if(player[i].isActive && player[i].isReady){
				handCards.push(deepCopy(player[i].handCard))
				result.push(module.exports.getType(handCards[i]))
				list.push(list.length)
			}
	    }
		//排序大小,从大到小排序
		for(var i = 0;i < list.length - 1;i++){
			for(var j = i + 1;j < list.length;j++){
				if(module.exports.compare(result[list[i]],result[list[j]]) !== "win"){
					//交换位置
					var tmpResult = result[list[i]]
					result[list[i]] = result[list[j]]
					result[list[j]] = tmpResult
					var tmpIndex = list[i]
					list[i] = list[j]
					list[j] = tmpIndex
				}
			}
		}
		console.log("list")
		console.log(list)
		//开始控制
		for(var i = 0 ;i < winList.length;i++){
			for(var j = 0;j < list.length;j++){
				if(list[j] == list.length - 1){
					//交换位置
					var tmpIndex = winList[i]
					var tmpListIndex = list[tmpIndex]
					list[tmpIndex] =  list[j]
					list[j] = tmpListIndex
				}
			}
		}
		for(var i = 0 ;i < lostList.length;i++){
			for(var j = 0;j < list.length;j++){
				if(list[j] == 0){
					//交换位置
					var tmpIndex = lostList[i]
					var tmpListIndex = list[tmpIndex]
					list[tmpIndex] =  list[j]
					list[j] = tmpListIndex
				}
			}
		}
	    for(var i = 0;i < GAME_PLAYER;i++){
			if(player[i].isActive && player[i].isReady){
				player[i].handCard = handCards[list.shift()]
			}
		}
		console.log("list")
		console.log(list)
	}
}


var deepCopy = function(source) { 
	var result={}
	for (var key in source) {
	  result[key] = typeof source[key]==="object"? deepCopy(source[key]): source[key]
	} 
	return result;
}

//数组乱序
var shuffle = function(a) {
    var b = [];
    while (a.length > 0) {
        var index = parseInt(Math.random() * (a.length - 1));
        b.push(a[index]);
        a.splice(index, 1);
    }
    return b;
}
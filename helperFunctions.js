function randomNumber(min, max){
	if (Array.isArray(min)){
		var a = min;
		min = a[0];
		max = a[1];
	}
	
	min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function reduce(number){
	if (number > 0){
		return(number - 1);
	} else if (number < 0){
		return(number + 1);
	} else{
		return(number);
	}
}

function clamp(x, min, max){
	if (x < min){
		return min;
	} else if (x > max){
		return max;
	} else{
		return x;
	}
}
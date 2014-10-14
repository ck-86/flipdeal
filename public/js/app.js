function getData() {
	$.getJSON('http://flipdeal.co/api/v1/products/mobiles/1', function(data){
		console.log(data);
	})
};

getData();
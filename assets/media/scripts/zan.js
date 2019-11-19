var flag = 0;
var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
var url = window.location.href.replace(parse_url, '$3/$5');

function goodplus(url, flag) {
	flag = 1; //访客点击标记
	senddata(url, flag);
	flag = 0;
}

function senddata(url, flag) {
	var Zan = AV.Object.extend('Zan');
	var query = new AV.Query('Zan');
	query.contains("url", url);
	query.find().then(function (results) {
		var vLeng = results.length;
		if (flag == 0) { //页面加载标记
			if (vLeng == 0) {
				var Zan = AV.Object.extend('Zan');
				var zan = new Zan();
				zan.set('url', url);
				zan.set('views', 0);
				zan.save().then(function (zan) {
					document.getElementById("zan_text").innerHTML = "0";
				});
			} else if (vLeng == 1) {
				var vViews = results[0].attributes.views;
				document.getElementById("zan_text").innerHTML = vViews;
			}
		} else if (flag == 1) { //访客点击标记
			var vViews = results[0].attributes.views;
			var vId = results[0].id;
			var Zan = AV.Object.createWithoutData('Zan', vId);
			Zan.set('views', vViews + 1);
			Zan.save();
			document.getElementById("zan_text").innerHTML = vViews + 1;
		}
	});
}

jQuery(document).ready(function () {
	jQuery(".post-zan").append("<div id='zan' class='zan-content'><a class='btn-zan' onclick=\"goodplus('" + url + "')\"><i class='fa fa-heart-o' aria-hidden='true'></i></a><div class='zan-title'><span>点赞 </span><span id='zan_text'></span></div></div>");
	senddata(url, flag);
	jQuery('body').on("click", '.btn-zan', function () {
		jQuery('.btn-zan').find('.fa').removeClass('fa-heart-o').addClass('fa-heart');
	});
});
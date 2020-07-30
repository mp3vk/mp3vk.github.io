async function get_vk_data(access_token, count = 0, offset = 0, need_user = 0) {
	const url = 'https://api.vk.com/method/audio.get?need_user=' + need_user + '&count=' + count + '&offset=' + offset + '&v=5.90&access_token=' + access_token;
	var data = await $.ajax({
		url: url,
		dataType: "jsonp"});
	var ret = {};
	if (need_user) {
		ret.name = data.response.items[0].name;
		data.response.items.shift();
	}
	ret.items = [];
	data.response.items.forEach(function(item) {
		item.thumb = (item.album && item.album.thumb) ? item.album.thumb.photo_68 : '';
		delete item.album;
		delete item.ads;
		delete item.main_artists;
		ret.items.push(item);
	})
	ret.count = data.response.count;
	

	return ret;
}

function time_like_vk(seconds) {
	var times = [];
	while (seconds) {
		var numeral = 0;
		if (times.length < 4) {
			numeral = seconds % 60;
			seconds = Math.floor(seconds / 60);
			if ((numeral < 10) & (seconds != 0)) {
				numeral = '0' + numeral;
			}
		} else {
			numeral = seconds;
			seconds = 0;
		}
		times.push(numeral);
	}
	if (times.length == 1) {
		times.push(0);
	}
	return times.reverse().join(':')
}
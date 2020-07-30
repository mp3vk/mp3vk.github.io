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
	ret.items = []
	data.response.items.forEach(function(item) {
		item.thumb = (item.album && item.album.thumb) ? item.album.thumb.photo_68 : '';
		delete item.album;
		delete item.ads;
		delete item.main_artists;
		ret.items.append(item);
	})
	ret.count = data.response.count;
	

	return ret;
}
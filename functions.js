async function get_vk_data(access_token, count = 0, offset = 0, need_user = 0) {
	const url = 'https://api.vk.com/method/audio.get?need_user=' + need_user + '&count=' + count + '&offset=' + offset + '&v=5.90&access_token=' + access_token;
	var data = await $.ajax({
		url: url,
		dataType: "jsonp"});
	var ret = {};
	ret.items = data.response.items;
	ret.count = data.response.count;
	if (need_user) {
		ret.name = ret.items[0].name;
		ret.items.shift();
	}
	return ret;
}
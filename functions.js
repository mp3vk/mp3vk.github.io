async function get_vk_data(count = 0, offset = 0, need_user = 0) {
	const access_token = document.cookie;
	const url = 'https://api.vk.com/method/audio.get?need_user=' + need_user + '&count=' + count + '&offset=' + offset + '&v=5.90&access_token=' + access_token;
	var data = await $.ajax({
		url: url,
		dataType: "jsonp"});
	data = data.response;
	if (need_user) {
		data.name = data.items[0].name;
		data.items.shift();
	}
	return data;
}
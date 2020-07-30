const vk_access_token = document.cookie;
describe("get data from vk", function() {
	it("Получить все аудиозаписи с именем пользователя", async function() {
		var data = await get_vk_data(vk_access_token, count = 0, offset = 0, need_user = 1);
		assert.typeOf(data.name, 'string');
		assert.typeOf(data.count, 'number');
		assert.typeOf(data.items, 'array');
		assert.typeOf(data.asdf, 'undefined');
		assert.isNotEmpty(data.items);
		data.items.forEach(function (item) {
			assert.typeOf(item.title, 'string');
			assert.typeOf(item.artist, 'string');
			assert.typeOf(item.thumb, 'string');
			assert.typeOf(item.url, 'string');
			assert.typeOf(item.asdf, 'undefined');
			assert.typeOf(item.duration, 'number');
			assert.typeOf(item.date, 'number');
		});
		assert.equal(item.length, data.count);

	});
	it("Получить несколько аудиозаписей", async function() {
		var all_audios = await get_vk_data(vk_access_token);
		var slice_audios = await get_vk_data(vk_access_token, count = 10, offset = 2);
		for (var i = slice_audios.length - 1; i >= 0; i--) {
			assert.equal(slice_audios[i], all_audios.items.slice(2, 12)[i]);
		}
	})

});
describe("convert seconds to time like vk", async function() {
	assert.equal(time_like_vk(1), '0:01');
	assert.equal(time_like_vk(242), '4:02');
	assert.equal(time_like_vk(151201), '42:00:01');
	assert.equal(time_like_vk(9431), '2:37:11');
})
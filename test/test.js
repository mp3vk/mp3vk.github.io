const vk_access_token = document.cookie;
describe("get data from vk", function() {
	it("Получить все аудиозаписи с именем пользователя", async function() {
		var data = await get_vk_data(vk_access_token, count = 0, offset = 0, need_user = 1);
		assert.typeOf(data.name, 'string');
		assert.typeOf(data.count, 'number');
		assert.typeOf(data.items, 'array');
		assert.typeOf(data.asdf, 'undefined');
		assert.isNotEmpty(data.items);
		for (item in data.items) {
			console.log(item)
			assert.typeOf(item.title, 'string');
			assert.typeOf(item.artist, 'string');
			assert.typeOf(item.thumb, 'string');
			assert.typeOf(item.url, 'string');
			assert.typeOf(item.asdf, 'undefined');
			assert.typeOf(item.duration, 'number');
			assert.typeOf(item.date, 'number');
		}

	});
	it("Получить несколько аудиозаписей", async function() {
		var all_audios = await get_vk_data(vk_access_token);
		var slice_audios = await get_vk_data(vk_access_token, count = 10, offset = 2);
		for (var i = slice_audios.length - 1; i >= 0; i--) {
			assert.equal(slice_audios[i], all_audios.items.slice(2, 12)[i]);
		}
	})

});
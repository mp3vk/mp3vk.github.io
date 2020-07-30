const vk_acess_token = document.cookie;
describe("get data from vk", function() {
	it("Получить все аудиозаписи с именем пользователя", async function() {
		var data = await get_vk_data(vk_acess_token, need_user = 1);
		assert.typeOf(data.name, 'string');
		assert.typeOf(data.count, 'int');
		assert.typeOf(data.items, 'array');
		assert.typeOf(data.asdf, 'undefined');
		assert.isNotEmpty(data.items);
		for (item in data.items) {
			assert.typeOf(item.title, 'string');
			assert.typeOf(item.artist, 'string');
			assert.typeOf(item.thumb, 'string');
			assert.typeOf(item.url, 'string');
			assert.typeOf(item.asdf, 'undefined');
			assert.typeOf(item.duration, 'int');
			assert.typeOf(item.date, 'int');
		}

	});
	it("Получить несколько аудиозаписей", async function() {
		var all_audios = await get_vk_data(vk_acess_token);
		var slice_audios = await get_vk_data(vk_acess_token, count = 10, offset = 2);
		assert.equal(slice_audios.items, all_audios.items.slice(2, 12));
	})

});
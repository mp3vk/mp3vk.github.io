describe("get data from vk", function() {

  it("Получить все аудиозаписи", async function() {
  	var data = await get_vk_data();
  	console.log(data);

  });

});
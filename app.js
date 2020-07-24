$(document).ready(function() {
	
	try {
		url = 'https://api.vk.com/method/users.get?v=5.52&access_token='+document.cookie;
		$.ajax({
			url: url,
			dataType: "jsonp",
			success: function (data) {
				console.log(data.response[0])
			}
		});
	} catch(error) {
		console.log(error)
	}

	$('#save-token').click(function() {
		var access_token = $('#access-token').val();
		if (access_token.includes('access_token=')) {
			access_token = access_token.split('access_token=')[1];
			access_token = access_token.split('&')[0];
		}
		console.log(access_token);
		document.cookie = access_token;
	})

});
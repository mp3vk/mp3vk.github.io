$(document).ready(function() {
	
	url = 'https://api.vk.com/method/users.get?v=5.52&access_token='+document.cookie;
	$.ajax({
		url: url,
		dataType: "jsonp",
		success: function (data) {
			try {
				console.log(data.response[0])
			} catch(error) {
				console.log(error)
			}
		}
	});


	$('#save-token').click(function() {
		var access_token = $('#access-token').val();
		if (access_token.includes('access_token=')) {
			access_token = access_token.split('access_token=')[1];
			access_token = access_token.split('&')[0];
		}
		console.log(access_token);
		document.cookie = access_token;
		alert('access_token установлен');
		$('#access-token').val('')
	});

	$('#make-request').click(function() {
	url = 'https://api.vk.com/method/audio.get?v=5.52&access_token='+document.cookie;
	// fetch(url, {
	// 	credentials: 'include',
	// 	method: 'GET',
	// 	mode: 'no-cors',
	// 	headers: new Headers(
	// 		{"Content-Type": "text/plain"}
	// 	),
	// }).then((response) => {
	// 	console.log(response)
	// 	return response.json();
	// }).then((data) => {
	// 	console.log(data);
	// });
	$.ajax({
		url: url,
		dataType: "jsonp",
		headers: {
			"user-agent":"vk"
		},
		success: function (data) {
			try {
				console.log(data.response)
			} catch(error) {
				console.log(error)
			}
		}
	});
	});

});
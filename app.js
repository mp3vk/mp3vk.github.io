$(document).ready(function() {
	function check_if_logged() {
	const access_token = document.cookie;
	const url = 'https://api.vk.com/method/users.get?v=5.52&access_token=' + access_token;
	$.ajax({
		url: url,
		dataType: "jsonp",
		success: function (data) {
			try {
				response = data.response[0];
			} catch(error) {
				console.log(error);
				return;
			}
			$('.topline').hide();
			$('#save-token').hide();
			$('.name').html(response.first_name + ' ' + response.last_name).show();

			console.log(response.first_name, response.last_name);
		}
	});
	}
	check_if_logged();


	$('#save-token').submit(function(e) {
		e.preventDefault();
		var access_token = $('#access-token').val();
		if (access_token.includes('access_token=')) {
			access_token = access_token.split('access_token=')[1];
			access_token = access_token.split('&')[0];
		}
		console.log(access_token);
		document.cookie = access_token;
		// TODO: remove alert
		alert('access_token установлен');
		$('#save-token').trigger("reset");;
		check_if_logged();
	});

	$('#make-request').click(function() {
	const access_token = document.cookie;
	const url = 'https://api.vk.com/method/audio.get?v=5.52&access_token=' + access_token;
	$.ajax({
		url: url,
		dataType: "jsonp",
		success: function (data) {
			try {
				const count = data.response.count;
				var items = data.response.items;
			} catch(error) {
				console.log(error)
				return;
			}
			$('.audios').show();
			var counter = 0;
			items.forEach(function(audio) {
				counter += 1;
				console.log(audio);
				$('.audios').append('<p>' + counter + audio.artist + ' ' + audio.title + '</p>');
			})
		}
	});

	});

});
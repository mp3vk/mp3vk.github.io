$(document).ready(function() {
	
	function time_like_vk(seconds) {
		var times = [];
		while (seconds) {
			var numeral = 0;
			if (times.length < 4) {
				numeral = seconds % 60;
				seconds = Math.floor(seconds / 60);
				if ((numeral < 10) & (seconds != 0)) {
					numeral = '0' + numeral
				}
			} else {
				numeral = seconds;
				seconds = 0;
			}
			times.push(numeral);
		}
		if (times.length == 1) {
			times.push(0);
		}
		return times.reverse().join(':')
	}

	function render_audio(number, audio){
	var thumb = '';
	if (audio.album && audio.album.thumb) {
		thumb = audio.album.thumb.photo_68;
	}
	var right_button = ''
	if (audio.url) {
		right_button = '\
		<button class="download circle-button" data-url="' + audio.url + '"> \
			<i class="fas fa-download"></i> \
		</button>'
	} else {
		right_button = '\
		<button class="download blocked circle-button"> \
			<i class="fas fa-times"></i> \
		</button>'
	}
	return '<div class="audio"> \
		'//  <span class="number align-middle">' + number + '</span> \
		+ '<button class="play circle-button" style="background-image: url(' + thumb + ')"> \
			<i class="fas fa-play"></i> \
		</button> \
		<div class="title-and-artist"> \
			<div class="title">' + audio.title + '</div> \
			<div class="artist">' + audio.artist + '</div> \
		</div> \
		<div class="duration">' + time_like_vk(audio.duration) + '</div> \
		' + right_button
	+ '</div> \
	<hr/>'
	}

	function check_if_logged() {
	const access_token = document.cookie;
	const url = 'https://api.vk.com/method/users.get?v=5.90&access_token=' + access_token;
	$.ajax({
		url: url,
		dataType: "jsonp",
		success: function (data) {
			try {
				response = data.response[0];
			} catch(error) {
				console.log(error);
				$('.not-logged-in').show();
				return;
			}
			$('.not-logged-in').hide();
			$('.name').html(response.first_name + ' ' + response.last_name);
			$('.logged-in').show();

			load_audios();
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

	function load_audios() {
	var savelink = $('<a></a>');
	savelink.hide();
	$('body').append(savelink)
	const access_token = document.cookie;
	const url = 'https://api.vk.com/method/audio.get?v=5.90&access_token=' + access_token;
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
				var audio = $(render_audio(counter, audio))
				$('.audios .container').append(audio);
				audio.find('.download').click(function() {
					const filename = audio.find('.title').text();
					const url = $(this).attr('data-url');
					saveAs(url, filename + '.mp3');
					console.log(url, filename);
				})
			})
		}
	});

	}


});
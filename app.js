var sound = null;
var playing = null;
var list_audio = [];
$(document).ready(function() {
	check_if_logged();

	$('#save-token').submit(function(e) {
		e.preventDefault();
		var access_token = $('#access-token').val();
		if (access_token.includes('access_token=')) {
			access_token = access_token.split('access_token=')[1];
			access_token = access_token.split('&')[0];
		}
		document.cookie = access_token;
		// TODO: remove alert
		alert('access_token установлен');
		$('#save-token').trigger("reset");;
		check_if_logged();
	});
	$('#order-checkbox').change(sort)
	$('#sort-by').change(sort)
});


function sort() {
	const reverse = $('#order-checkbox').is(':checked')
	const sort_type = $('#sort-by').val();
	var items = list_audio.slice(0);
	if (sort_type == "default") {
		write_audios(items, reverse);
	} else {
		var sort_attribute = sort_type;
		items.sort(function(a, b) {
				return (a[sort_attribute] < b[sort_attribute]) ? -1 : (a[sort_attribute] > b[sort_attribute]) ? 1 : 0;
			});
		write_audios(items, reverse);
	}
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


function load_audios() {
const access_token = document.cookie;
const url = 'https://api.vk.com/method/audio.get?v=5.90&access_token=' + access_token;
$.ajax({
	url: url,
	dataType: "jsonp",
	success: function (data) {
		try {
			var count = data.response.count;
			var items = data.response.items;
			list_audio = items;
		} catch(error) {
			console.log(error)
			return;
		}
		$('.count').text(count);
		write_audios(items, false);
	}
});
}

function write_audios(items, reverse) {
	$('.audios').show().find('.container').empty();
	var counter = 0;
	if (reverse) {items.reverse();}
	items.forEach(function(audio) {
		counter += 1;
		var audio = $(render_audio(counter, audio))
		$('.audios .container').append(audio);
		audio.find('.download').click(function() {
			const filename = audio.find('.title').text();
			const url = $(audio).attr('data-url');
			if (!url) {
				alert('Аудиозапись недоступна. Установите расширение, меняющее user-agent, и измените его на "vk".');
				return;
			}
			saveAs(url, filename + '.mp3');
		})
		audio.find('.play').click(function() {
			click_play($(audio).attr('data-url'), this);
		})
	})
}

function time_like_vk(seconds) {
	var times = [];
	while (seconds) {
		var numeral = 0;
		if (times.length < 4) {
			numeral = seconds % 60;
			seconds = Math.floor(seconds / 60);
			if ((numeral < 10) & (seconds != 0)) {
				numeral = '0' + numeral;
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
var right_button = '';
if (audio.url) {
	right_button = '\
	<button class="download circle-button"> \
		<i class="fas fa-download"></i> \
	</button>'
} else {
	right_button = '\
	<button class="download blocked circle-button"> \
		<i class="fas fa-times"></i> \
	</button>'
}
return '<div class="audio" data-url="' + audio.url + '"> \
	'//  <span class="number align-middle">' + number + '</span> \
	+ '<button class="play circle-button" style="background-image: url(' + thumb + ')"> \
		<i class="fas fa-spinner loading"></i> \
		<i class="fas fa-play play"></i> \
		<i class="fas fa-pause pause"></i> \
	</button> \
	<div class="title-and-artist"> \
		<div class="title">' + audio.title + '</div> \
		<div class="artist">' + audio.artist + '</div> \
	</div> \
	<div class="duration">' + time_like_vk(audio.duration) + '</div> \
	' + right_button
	+ '</div> \
	<hr class="audio-bottom" />'
}


function click_play(url, button) {
	if ( !url ) {return;}
	if ( !$(button).is("button") ) {return;}
	if (playing == url) {
		if (button.classList.contains('playing')) {
			sound.pause();
			disable_loading(button)();
		} else {
			sound.play();
		}
	} else {
		if (sound!=null) {
			sound.unload();
		}
		if (playing!=null) {
			$('.playing').each(function(index) {
				this.classList.remove('playing');
				disable_loading(this)();
			});
		}
		button.classList.add('loading-button')
		playing = url;
		sound = new Howl({
			src: [url],
			onload: disable_loading(button),

		});
		sound.play();
	}
	button.classList.toggle('playing');
}

function disable_loading(button) {
	return function() {
		if (button.classList.contains('loading-button')) {
			button.classList.remove('loading-button')
		}
	}
}
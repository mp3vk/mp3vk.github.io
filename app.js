const start_count = 20;
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
	$('#search').submit(function(e) {
		e.preventDefault();
		var quest = $('.search-line').val().toLowerCase();
		console.log(quest);
		var items = list_audio.slice(0).
		filter(function(audio) {
			
			return audio.title.toLowerCase().includes(quest) || audio.artist.toLowerCase().includes(quest);
		})
		write_audios(items, false);
	})
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


async function check_if_logged() {
	const access_token = document.cookie;
	var data = await get_vk_data(vk_acess_token, count = start_count, offset = 0, need_user = 1);
	console.log(data);
	if (data.count == 0) {
		$('.logged-in').hide();
		$('.not-logged-in').show();
	} else {
		$('.not-logged-in').hide();
		$('.count').text(data.count);
		$('.logged-in').show();
		load_audios();
	}
}

function push_list_audio(items) {
	console.log(items);
	for (var i = items.length - 1; i >= 0; i--) {
		items[i].thumb = (items[i].album && items[i].album.thumb) ? items[i].album.thumb.photo_68 : '';
		delete items[i].album;
		delete items[i].ads;
		delete items[i].main_artists;
	}
	list_audio.push.apply(list_audio, items);
}


function load_more_and_write(access_token, count, offset, callback = function(argument) {}, need_user = 0) {
var url = 'https://api.vk.com/method/audio.get?need_user=' + need_user + '&count=' + count + '&offset=' + offset + '&v=5.90&access_token=' + access_token;
$.ajax({
	url: url,
	dataType: "jsonp",
	success: function (data) {
		try {
			var audio_count = data.response.count;
			var items = data.response.items;
			if (need_user == 1) {
				$('.name').text(items[0].name);
				items.shift();
			}
			push_list_audio(items);
		} catch(error) {
			console.log(error)
			callback(0);
		}
		write_audios(list_audio.slice(0), false);
		callback(audio_count);
	}
});
}


function load_audios() {
const access_token = document.cookie;
var next_count = start_count;
var offset = start_count;

function recursive_load(count) {
	if (offset < count) {
		next_count *= start_count;
		load_more_and_write(access_token, next_count, offset, recursive_load);
		offset += next_count;	
	}
}
recursive_load($('.count').text())

}


function write_audios(items, reverse) {
	$('.audios').show().find('.container').empty();
	if (reverse) {items.reverse();}
	var elements = '';

	items.forEach(function(audio) {
		var audio = render_audio(audio)
		elements += audio;
		
	})
	document.querySelector('.audios .container').insertAdjacentHTML("afterBegin", elements);
	document.querySelectorAll('.audios .audio').forEach(function(audio) {
		var play_button = audio.querySelector('button.play');
		play_button.addEventListener('click', function() {
			const id = $(audio).attr('data-id');
			const url = list_audio.find(x => x.id == id).url;
			click_play(url, play_button);
		})
		var download_button = audio.querySelector('button.download');
		download_button.addEventListener('click', function() {
			audio = $(audio);
			const filename = audio.find('.title').text();
			const id = audio.attr('data-id');
			const url = list_audio.find(x => x.id == id).url;
			if (!url) {
				alert('Аудиозапись недоступна. Установите расширение, меняющее user-agent, и измените его на "vk".');
				return;
			}
			saveAs(url, filename + '.mp3');
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

function render_audio(audio){
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
return '<div class="audio" data-id="' + audio.id + '"> \
	<button class="play circle-button" style="background-image: url(' + audio.thumb + ')"> \
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
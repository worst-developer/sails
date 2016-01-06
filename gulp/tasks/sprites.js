var sprite = require('css-sprite').stream;
var es = require('event-stream');

gulper.task('sprite', [], 'styles', config.tasks.sprites, function(input) {
	var output = es.through();
	var timer = 0;
	var end = false;

	input.on('end', function() {
		end = true;
		time();
	});

	input.on('data', time);

	function time() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			gulp.src(config.tasks.sprites).pipe(sprite({
				base64: true,
				style: 'sprite.css',
				prefix: 'sprite'
			})).pipe(output);
		}, 200);
	}

	return output;
});
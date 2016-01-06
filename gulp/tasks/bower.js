var bower = require('gulp-bower-files');
var filter = require('gulp-filter');
var es = require('event-stream');
var rename = require('gulp-rename');
var fs = require('fs');
var path = require('path');

gulper.task('bower', [], 'scripts', bowerlocation()+'.js', function(input) {
	var output = es.through();
	var timer = 0;
	var end = false;

	input.on('end', function() {
		end = true;
		time();
	})

	input.on('data', time);

	function time() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			bower().pipe(filter('**/*.js'))
				.pipe(output, {end: end});
		}, 200);
	}

	return output.pipe(rename(function(path) {
		path.dirname = 'bower/'+ path.dirname;
	}));
});

gulper.task('bower', [], 'styles', bowerlocation()+'.css', function(input) {
	var output = es.through();
	var timer = 0;
	var end = false;

	input.on('end', function() {
		end = true;
		time();
	})

	input.on('data', time);

	function time() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			bower().pipe(filter('**/*.css'))
				.pipe(output, {end: end});
		}, 200);		
	}

	return output.pipe(rename(function(path) {
		path.dirname = 'bower/'+ path.dirname;
	}));
});

function bowerlocation() {
	var contents;
	try {
		contents = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.bowerrc'), {encoding: 'utf8'}));
	} catch(e) {
		return 'bower_components/**/*';
	}

	return contents.directory + '/**/*';
}
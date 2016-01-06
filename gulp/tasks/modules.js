var browserify = require('gulp-browserify');
var path = require('path');

gulper.task('modules', ['templates'], 'scripts', '', function() {
	var index = 'window.'+config.tasks.modules.dest+' = {';
	
	config.tasks.modules.src.forEach(function(el, i) {
		if(i !== 0) index += ',';
		index += 'el: require("'+el+'")';
	});
	
	index += '};';

	var file = new gutil.File({
		path: path.join(process.cwd(), 'browserify.js'),
		contents: new Buffer(index)
	});

	var stream = browserify();
	stream.write(file);
	stream.end();
	
	return stream;
});
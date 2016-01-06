var hbs = require('gulp-handlebars');
var define = require('gulp-define-module');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulper.task('templates', ['bower'], 'scripts', config.tasks.templates.src, function(input) {
	return input.pipe(hbs())
		.pipe(define('plain'))
		.pipe(declare({namespace: config.tasks.templates.dest}))
		.pipe(rename(function(path) {
			path.dirname = 'templates/'+ path.dirname;
		}));
});
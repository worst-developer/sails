var lint = require('./gulp/linting');
var inject = require('./gulp/inject');
var es = require('event-stream');
var concat = require('gulp-concat');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var tsort = require('tsort');

//Setup gulper object
global.gulper = {
	graphs: {},
	task: function(name, deps, output, glob, streamer, base) {
		this[output] = this[output] || [];
		this[output].push({
			streamer: streamer,
			glob: glob,
			name: name,
			base: base
		});
		deps.unshift(name),
		this.graphs[output] = this.graphs[output] || tsort();
		this.graphs[output].add.apply(this.graphs[output], deps);
	},
	get: function(name) {
		this[name] = this[name] || [];
		var stream = es.merge.apply(es, this[name].map(function(el) {
			gutil.log('Started ', gutil.colors.cyan(el.name + ' - ' + name));
			return el.streamer(gulp.src(el.glob, {base: el.base})).pipe(gulper.level(name, el.name));
		}));

		return stream;
	},
	watch: function(name) {
		this[name] = this[name] || [];	
		var stream = es.merge.apply(es, this[name].map(function(el) {
			gutil.log('Started watching', gutil.colors.cyan(el.name + ' - ' + name));
			return el.streamer(watch({glob: el.glob, base: el.base})).pipe(gulper.level(name, el.name));
		}));

		return stream;
	},
	level: function(output, name) {
		return es.through(function(data) {
			var sorted = gulper.graphs[output].sort()
			data.level = sorted.length - sorted.indexOf(name);
			this.emit('data', data);
		});
	}
};

//Require gulp and gulp-util and assign them globally
global.gulp = require('gulp');
global.gutil = require('gulp-util');

//Import configuration
gutil.log('Using configuration from', gutil.colors.magenta('./gulp/config.json'));
global.config = require('./gulp/config');

//Import tasks
gutil.log('Importing tasks from', gutil.colors.magenta('./gulp/tasks'));
require('require-all')(__dirname + '/gulp/tasks');

//Actually register tasks
//Clean all created files
gulp.task('clean', function() {
	var dest = gulp.src(config.destination)
		.pipe(clean({force: true}));

	var views = gulp.src(config.views.dest)
		.pipe(clean({force: true}));

	return es.merge(dest, views);
});

//Watch all and execute as needed. Also run live-reload
gulp.task('watch', ['clean'], function() {
	var scripts = gulper.watch('scripts');
	var styles = gulper.watch('styles');
	var assets = gulper.watch('assets');
	
	//Merge all streams and pipe them to our destination
	var all = es.merge(scripts, styles, assets).pipe(gulp.dest(config.destination));

	//Run our injection code
	inject(all, watch({glob: config.views.src}))
		.pipe(gulp.dest(config.views.dest));
});

//Compile into as few files as possible
gulp.task('build', ['clean'], function() {
	var scripts = gulper.get('scripts')
		.pipe(sort())
		.pipe(concat('bundle.js'))
		.pipe(uglify());

	var styles = gulper.get('styles')
		.pipe(sort())
		.pipe(concat('bundle.css'))
		.pipe(minify());

	var assets = gulper.get('assets');

	//Merge all streams and pipe them to our destination
	var all = es.merge(scripts, styles, assets)
		.pipe(gulp.dest(config.destination));

	//Run our injection code
	inject(all, gulp.src(config.views.src))
		.pipe(gulp.dest(config.views.dest));
});

//Lint all files, and spit out results
gulp.task('lint', function(cb) {
	var js = lint.js();
	js.on('end', function() {
		var css = lint.css();
		css.on('end', cb.bind(null, null));
	});
});

function sort() {
	var buffer = [];
	return es.through(function(data) {
		buffer[data.level] = buffer[data.level] || [];
		buffer[data.level].push(data);
	}, function() {
		var self = this;

		buffer.forEach(function(level) {
			level.forEach(function(data) {
				self.emit('data', data);
			});
		});

		this.emit('end');
	});
}

//Set default to watch
gulp.task('default', ['watch']);
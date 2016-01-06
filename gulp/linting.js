var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var stylish = require('jshint-stylish');
var filter = require('gulp-filter');
var fs = require('fs');
var path = require('path');

//Prepare our globbing expression
function prepareGlobber() {
	var gitignore;

	//Read in our gitignore
	try {
		gitignore = fs.readFileSync('.gitignore', {encoding: 'utf8'});
	} catch(e) {
		gitignore = '';
	}

	//Split gitignore file linewise
	//Filter empty lines
	//Prepend with '!' for our globbing
	var all = ['**/*'];

	gitignore.split('\n')
		.filter(function(el) {return el.length>0})
		.forEach(function(el) {
			all.push('!'+el);
			all.push('!'+el+'/**/*');
		});

	return all;
}

//Unify look of js and css linters
function csslintreporter(file) {
	//Log the path
	console.log(file.path);

	//Keep our errors without line numbers
	var lineless = [];

	//Iterate over errors
	file.csslint.results.forEach(function(result) {
		//Filter those without line numbers
		if(result.error.line === undefined) {
			lineless.push(result);
		} else {
			console.log(gutil.colors.gray('  line ' + result.error.line + '\t' + 'col ' + result.error.col + '\t') + gutil.colors.blue(result.error.message));
		}
	});

	//Log the ones without lines
	if(lineless.length > 0) {
		console.log('\n  Without line:');
	}
	lineless.forEach(function(result) {
		console.log(gutil.colors.blue('    ' + result.error.message));
	});

	//Log the result
	if(file.csslint.errorCount > 0) {
		console.log('\n' + gutil.colors.red.bold((process.platform !== 'win32' ? '✖ ' : '') + file.csslint.errorCount + ' problem' + (file.csslint.errorCount > 1 ? 's' : '')));
	} else {
		console.log('\n' + gutil.colors.green.bold((process.platform !== 'win32' ? '✔ ' : '') + 'No problems'));
	}

	console.log('\n');
}

//Prepare our globbing
var all = prepareGlobber();

//Export required functions
module.exports = {
	js: function () {
		var src = gulp.src(all);
		
		//JS Files
		return src.pipe(filter('**/*.js'))
			.pipe(jshint())
			.pipe(jshint.reporter(stylish));
	},
	css: function () {
		var src = gulp.src(all);

		//CSS Files
		return src.pipe(filter('**/*.css'))
			.pipe(csslint())
			.pipe(csslint.reporter(csslintreporter));
	}
};
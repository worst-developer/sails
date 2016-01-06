gulper.task('static', ['modules'], 'scripts', config.tasks.scripts.src, function(input) {
	return input;
}, config.tasks.assets.base);

gulper.task('static', ['bower'], 'styles', config.tasks.styles.src, function(input) {
	return input;
}, config.tasks.styles.base);

gulper.task('static', [], 'assets', config.tasks.assets.src, function(input) {
	return input;
}, config.tasks.styles.base);
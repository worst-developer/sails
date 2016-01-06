Gulp Configuration
==================
This file goes into a little more detail about the input and output of the gulp `build` and `watch` tasks.
Any configuration talked about in this document should be done in the `config.json` file.

Basic Configuration
-------------------
### destination
The folder all files are put (except for views)

### views.src
Glob to match all views. These will be copied to `views.dest` after having any JavaScript and CSS files injected into them.

### views.dest
See above

Asset Tasks
-----------
The way our `gulpfile.js` works, tasks that provide assets (scripts, styles, images etc.) can be defined in the `tasks` folder. These are run within the main `build` and `watch` tasks automatically.

If you need specific other assets, take a look how these are defined. The pre-defined ones are detailed below.

### Bower Files
This job pulls the main files from any installed bower packages. For this to work, the packages' `bower.json` files have to contain one or multiple `main` entries.
If this is not the case, you can define overrides in your `bower.json` as described [here](https://github.com/ck86/gulp-bower-files#overrides-options).

### Modules
This job compiles any provided node modules into a [browserify](http://browserify.org/) bundle.
Modules can be defined via the `tasks.modules.src` config option and will be attached to the namespace given in `tasks.modules.dest`.

### Templates
This job precompiles handlebars templates for you.
It takes any templates matched by `tasks.templates.src` and attaches the precompiled versions to the namespace given via `tasks.templates.dest`.

### Basic Assets
All your normal assets (scripts, styles, images etc.) should be matched by the corresponding `tasks.scripts.src`, `tasks.styles.src` and `tasks.assets.src` globs.

### Sprites
All your images matched by the `tasks.sprites` will be compiled into a single sprite and injected as a css file (In base64 encoding). In addition, classes will be generated, which you can use to assign fitting background dimensions.
You have to assign the class `sprite` as well as a `sprite-filename` class. The filename must not contain the file extension.
'use strict';

const
    fs = require('fs'),
    gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    argv = require('argv'),
    clc = require('cli-color'),
    config = require('./config.json');

class Tasks {
    constructor() {
        config.params = {};
        process.argv.forEach(val => config.params[val.replace(/-/gi, '')] = true);
    }

    compileJs() {
        return browserify({
            entries: config.path.sources + config.fileType.js + config.names.scriptsOrigin,
            ignore: config.fileType.exclude,
            debug: true
        })
            .transform('babelify', {
                presets: ['es2015'],
                ignore: config.fileType.exclude
            })
            .bundle()
            .pipe(source(config.names.scriptsOrigin))
            .pipe(buffer())
            .pipe(plugins.sourcemaps.init({loadMaps: true}))
            .pipe(plugins.concat(config.names.scripts))
            .pipe(plugins.if(config.params.minify, plugins.uglify()))
            .pipe(plugins.sourcemaps.write('./'))
            .pipe(gulp.dest(config.path.results + config.fileType.js));
    }

    compileSass() {
        return gulp.src([config.path.sources + config.fileType.sass + '*'])
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass())
            .pipe(plugins.concat(config.names.styles))
            .pipe(plugins.autoprefixer())
            .pipe(plugins.if(config.params.minify, plugins.cleanCss()))
            .pipe(plugins.sourcemaps.write('./'))
            .pipe(gulp.dest(config.path.results + config.fileType.css));
    }

    compileImg() {
        return gulp.src([config.path.sources + config.fileType.img])
            .pipe(gulp.dest(config.path.results + config.fileType.img));
    }

    compileTwig(options) {
        options = options || {};

        function isFileAccessible(file) {
            try {
                fs.accessSync(file, fs.F_OK);
                return true;
            } catch(e) {
                return false;
            }
        }
        function runTwig(content, source) {
            return gulp.src(source)
                .pipe(plugins.twig({data: JSON.parse(content)}))
                .pipe(plugins.inject(gulp.src([config.path.results + config.fileType.js + config.names.scripts], {read : false}), {
                    ignorePath: [config.path.results],
                    addRootSlash: false,
                    // addPrefix: '..'
                }))
                .pipe(plugins.inject(gulp.src([config.path.results + config.fileType.css + config.names.styles], {read : false}), {
                    ignorePath: [config.path.results],
                    addRootSlash: false,
                    // addPrefix: '..'
                }))
                .pipe(gulp.dest(config.path.results));
        }

        let source = options.path ? options.path : config.path.sources + config.fileType.twig + 'pages/*.twig';

        fs.readFile(config.path.sources + config.fileType.twig + config.names.twigGlobals, (err, content) => {

            if (!options.sync) return runTwig(content, source);
            else {
                let i = setInterval(() => {
                    if (
                        isFileAccessible(config.path.results + config.fileType.js + config.names.scripts) &&
                        isFileAccessible(config.path.results + config.fileType.css + config.names.styles)
                    ) {
                        clearInterval(i);
                        return runTwig(content, source);
                    }
                }, 500);
            }
        });
    }

    watch() {
        gulp.watch(config.path.sources + config.fileType.js + '**/*', () => {
            this.compileJs();
        });
        gulp.watch(config.path.sources + config.fileType.sass + '**/*', () => {
            this.compileSass();
        });
        gulp.watch(config.path.sources + config.fileType.img + '**/*', () => {
            this.compileImg();
        });
        gulp.watch([
            config.path.sources + config.fileType.twig + '*/**',
            config.path.sources + config.fileType.twig + config.names.twigGlobals
        ], () => {
            this.compileTwig();
        });
        gulp.watch(config.path.sources + config.fileType.twig + '/pages/*.twig', e => {
            this.compileTwig({path: e.path});
        });
    }

    defaultTask() {
        function taskData(group, name, description) {
            console.log(clc.bgMagenta(group + clc.whiteBright(':' + name)) + clc.blackBright(' - ' + description));
        }
        function paramData(param, description) {
            console.log(clc.bgMagenta('-' + param) + clc.blackBright(' - ' + description));
        }

        console.log(clc.cyan('\nPlease specify task:\n'));
        taskData('compile', 'js', 'concat all javascript files and transpile es6 to es5');
        taskData('compile', 'sass', 'concat all scss files and compile to css');
        taskData('compile', 'twig', 'compile all twig files to html');
        taskData('compile', 'static', 'run all compile tasks');
        console.log('');
        taskData('build', 'watch', 'run watcher on static files');
        taskData('build', 'dev', 'compile all static files and run watcher');
        taskData('build', 'production', 'clean final build');
        console.log(clc.cyan('\nAvailable params:\n'));
        paramData('minify', 'compress static files');
    }
}

const tasks = new Tasks();

gulp.task('compile:js', () => {
    tasks.compileJs();
});
gulp.task('compile:sass', () => {
    tasks.compileSass();
});
gulp.task('compile:twig', () => {
    tasks.compileTwig();
});
gulp.task('compile:img', () => {
    tasks.compileImg();
});
gulp.task('compile:static', () => {
    tasks.compileJs();
    tasks.compileSass();
    tasks.compileImg();
    tasks.compileTwig({sync: true});
});

gulp.task('build:watch', () => {
    tasks.watch();
});
gulp.task('build:dev', ['compile:static'], () => {
    tasks.watch();
});
gulp.task('build:production', ['compile:static'], () => {

});

gulp.task('default', function() {
    tasks.defaultTask();
});
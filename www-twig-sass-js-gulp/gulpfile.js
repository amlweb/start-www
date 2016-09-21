//*********** IMPORTS *****************
var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var gulpIgnore = require('gulp-ignore');
var argv = require('yargs').argv;
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
//*********** SASS *****************
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
//*********** JS *****************
var uglify = require('gulp-uglify');
//*********** TWIG *****************
var twig = require('gulp-twig');

// //Configuration - Change me
var sassFiles = [
    {
        watch: 'src/scss/**/*.scss',
        output: './web/css'
    }
];

var jsFiles = [
    {
        watch: 'src/js/**/main.js',
        output: './web/js/'
    }
];

var twigFiles = [
    {
        watch: 'src/twig/**/*.twig',
        output: './web'
    }
];
//END configuration


gulp.task('watch', function () {
    if(argv.build) {
        gulp.start(['build']);
    }

    gulp.watch(sassFiles[0].watch, ['sass']);
    gulp.watch(jsFiles[0].watch, ['js']);
    gulp.watch(twigFiles[0].watch, ['twig']);
});

gulp.task('twig', function() {
    return gulp.src(twigFiles[0].watch)
        .pipe(gulpIgnore.include(/\.html/))
        .pipe(gulpIgnore.include('_common'))
        .pipe(twig({}))
        .pipe(rename(function(path) {
            path.extname = ''; // strip the .twig extension
        }))
        .pipe(gulp.dest(twigFiles[0].output));
});

gulp.task('sass', function() {
    return gulp.src(sassFiles[0].watch)
        .pipe(plumber())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(sassFiles[0].output));
});

gulp.task('js', function() {
    return gulp.src(jsFiles[0].watch)
        .pipe(plumber())
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(rename(function (path) {
            path.basename += '.min'
        }))
        .pipe(gulp.dest(jsFiles[0].output));
});

gulp.task('vendor', function() {
    return gulp.src('src/js/vendor/**/*')
        .pipe(gulp.dest(jsFiles[0].output + '/vendor'));
});

gulp.task('img', function() {
    return gulp.src('src/img/**/*')
        .pipe(gulp.dest('./web/img'));
});

gulp.task('default', ['watch']);
gulp.task('build', ['twig', 'sass', 'js', 'vendor', 'img']);
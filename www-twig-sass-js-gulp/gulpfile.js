//*********** IMPORTS *****************
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var argv = require('yargs').argv;
var twig = require('gulp-twig');


// PATHS
var paths = {};

paths.src = './dist';
paths.scss = './src/scss/**/*.scss';
paths.twig = './src/twig/*.twig';

// ENIVROMENT
var dev = argv.dev;
var pJson = require('./package.json');

gulp.task('sass', function() {
    return gulp.src( paths.scss )
        .pipe( sourcemaps.init() )
        .pipe( sass({
            outputStyle: dev ? 'expanded' : 'compressed',
            errLogToConsole: true
        }))
        .pipe( autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe( gulp.dest( paths.src + '/css' ))
});

gulp.task('twig', function() {
    return gulp.src( paths.twig )
    		.pipe(twig({
            data: {
            }
        }))
        .pipe( gulp.dest( paths.src ))
});


gulp.task('default', ['sass', 'twig'], function() {
    gulp.watch( paths.scss, ['sass']);
    gulp.watch( './src/twig/**/*.twig', ['twig']);
});
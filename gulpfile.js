var gulp = require('gulp');
var webserver = require('gulp-webserver');
var changed       = require('gulp-changed');
var less      = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var gulpif = require('gulp-if');
var sprity = require('sprity');
var fontSpider = require( 'gulp-font-spider' );


gulp.task('css',function () {
    gulp.src(['./src/**/*.less', '!./src/**/refs/*.less'])
        .pipe(less())
        .pipe(gulp.dest('./build/'));
});

gulp.task('css:debug', /*['sprites'],*/ function () {
    gulp.src(['./src/**/*.less', '!./src/**/refs/*.less'])
        //.pipe(changed('./src', {extension: '.css'}))
        .pipe(less())
        .pipe(autoprefixer())
        .on('error', function (err) {
            console.log(err.message);
        })
        .pipe(gulp.dest('./src'));
});

gulp.task('sprites', function () {
    return sprity.src({
            src: './src/images/tree/*.png',
            style: './src/css/refs/tree.less',
            name: 'tree',
            margin: 0,
            prefix: 'tree',
            // ... other optional options
            // for example if you want to generate scss instead of css
            processor: 'less'
        })
        .pipe(gulpif('*.png', gulp.dest('./src/images/'), gulp.dest('./src/css/refs/')))
});

gulp.task( 'fontspider', function(){
    return gulp.src( './index.html' )
        .pipe( fontSpider() );
});

gulp.task('webserver', function() {
    gulp.src('./src/')
        .pipe(webserver({
            livereload: true,
            directoryListing: {
                enable:true,
                path: 'src'
            },
            open: true
        }));
});

gulp.task('watch', function() {
    var watcher = gulp.watch(['./src/**/*.less'], ['css:debug']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['css:debug', 'webserver', 'watch', 'fontspider']);
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var connect = require('connect');
var serveStatic = require('serve-static');
var http = require('http');
var devApp = connect();
var fs = require('fs');
var bootlint = require('bootlint');
var glob = require('glob');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var Promise = require('es6-promise').Promise;

var config = {
    sassPath: 'web/css',
    bower: 'web/assets/components/bootstrap',
    javascriptPath: 'web/js/es6/*.js',
    javascriptCompilePath: 'web/js/es5'

};

gulp.task('css', function() {

    var options = {
        outputStyle: 'nested', // 'compressed'
        sourceComments: false,
        includePaths: [config.bower + '/scss']
    };

    return gulp.src(config.sassPath + '/import.scss', {

    })
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass(options)
        .on('error', sass.logError)
    )
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.sassPath));

});

gulp.task('babel', function() {
    return gulp.src([config.javascriptPath])
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['es2015']}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.javascriptCompilePath))
});


gulp.task('server', function(callback){
    devApp.use(serveStatic('web'));

    var server = http.createServer(devApp).listen(8000, '0.0.0.0');
    server.on('listening', function(){
        var devAddress = server.address(),
            devHost = devAddress === '0.0.0.0' ? 'localhost' : devAddress.address,
            url = 'http://' + devHost + ':' + devAddress.port;

        console.log('Started webserver at ' + url);
        callback();
    });
});


gulp.task('watch', function(){
    gulp.watch('web/css/**/*.scss', ['css']);
    gulp.watch('web/*.html', ['lint']);
    gulp.watch([config.javascriptPath], ['babel'])
});

/**
 * Lints all html files in the web/ folder
 */
gulp.task('lint', function(){

    glob('web/*.html', function(err, files){
        files.forEach(function(file) {
            fs.readFile(file, 'utf8', function (err, data) {
                var reporter = function (lint) {

                    console.log(file + ": ", lint.id, lint.message);
                };
                if (err) {
                    console.error(err);
                }

                bootlint.lintHtml(data, reporter, []);
            });
        });
    });

});

gulp.task('default', ['babel','css', 'server', 'watch']);
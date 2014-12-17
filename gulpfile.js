var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

//检查代码
gulp.task('lint', function() {
  gulp.src('./app/**/*.js')
    .pipe(jshint({asi:true}))
    .pipe(jshint.reporter('default'))
    .pipe(connect.reload())
})

//sass
gulp.task('sass', function() {
  gulp.src('./app/**/*.scss')
    .pipe(sass({
      // includePaths: require('node-bourbon').with('other/path', 'another/path')
      // - or -
      includePaths: require('node-bourbon').with(require('node-neat').includePaths,
        './bower_components/bootstrap-sass-official/assets/stylesheets',
        './bower_components/font-awesome/scss'),
      // includePaths: ['./bower_components/bootstrap-sass-official/assets/stylesheets']
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./app'))
    .pipe(connect.reload())
})

gulp.task('html', function() {
  gulp.src('./*.html')
    .pipe(connect.reload());
})

gulp.task('watch', function() {
  gulp.watch('./app/**/*.html', function() {
    gulp.run('html')
  })
  gulp.watch('./app/**/*.js', function() {
    gulp.run('lint')
  })
  gulp.watch('./app/**/*.scss', function() {
    gulp.run('sass')
  })
})

gulp.task('serve', function() {
  connect.server({
    port: 2223,
    livereload: true
  })
  gulp.run('watch');
})

//default
gulp.task('default', ['serve']);
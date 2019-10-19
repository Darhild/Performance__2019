const gulp = require('gulp');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const preset = require('postcss-preset-env');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const svgmin = require('gulp-svgmin');
const sprite = require('gulp-svg-sprite')
const server = require('browser-sync').create();

gulp.task('css', () =>  {
  return gulp.src('./css/*.css')
    .pipe(plumber())
    .pipe(postcss([preset()]))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./css/build'))
    .pipe(csso({
      sourceMap: true,
    }))
    .pipe(rename({  suffix: '.min' }))
    .pipe(gulp.dest('./css/build'))
    .pipe(server.stream())
});

gulp.task('js', function(){
  return gulp.src('./src/js/**/*.js')

    .pipe(gulp.dest('./js'))    
    .pipe(server.reload({stream: true}))
});

gulp.task('svg', () => {
  return gulp.src('./img/svg/*.svg')
  .pipe(plumber())
  .pipe(svgmin({
    js2svg: {
      pretty: true
    }
  }))
  .pipe(sprite({
    mode: {
      symbol: {
        sprite: '../sprite.svg'
      }
    }
  }))
  .pipe(gulp.dest('./img'))
})

gulp.task("serve", function () {
  server.init({
    server: {
      baseDir: "."
    },
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("./**/*.css", gulp.series("css"));
  gulp.watch("./**/*.js", gulp.series("js"));
});

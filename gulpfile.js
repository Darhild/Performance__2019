const gulp = require('gulp');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const preset = require('postcss-preset-env');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const minify = require('gulp-minify');
const svgmin = require('gulp-svgmin');
const sprite = require('gulp-svg-sprite')
const server = require('browser-sync').create();

gulp.task('css', () =>  {
  return gulp.src('./src/css/*.css')
    .pipe(plumber())
    .pipe(postcss([preset()]))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(csso({
      sourceMap: true,
    }))
    .pipe(rename({  suffix: '.min' }))
    .pipe(gulp.dest('./build/css'))
    .pipe(server.stream())
});

gulp.task('js', function(){
  return gulp.src('./src/js/**/*.js')
    .pipe(minify())
    .pipe(rename({  suffix: '.min' }))
    .pipe(gulp.dest('./build/js'))    
    .pipe(server.reload({stream: true}))
});

gulp.task('svg', () => {
  return gulp.src('./src/img/svg/*.svg')
  .pipe(plumber())
  /*
  .pipe(svgmin({
    js2svg: {
      pretty: true
    }
  }))*/
  .pipe(rename({ prefix: 'icon-' }))
  .pipe(sprite({
    mode: {
      inline: true,      
      symbol: {        
        sprite: 'sprite.svg'
      }
    }
  }))
  .pipe(gulp.dest('./build/img'))
})

gulp.task("serve", function () {
  server.init({
    server: {
      baseDir: "./build"
    },
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("./src/**/*.css", gulp.series("css"));
  gulp.watch("./src/**/*.js", gulp.series("js"));
});
import gulp   from 'gulp';
import eslint from 'gulp-eslint';
import config from '../config';

gulp.task('lint', function () {
  
  return gulp.src(config.paths.scripts.watch)

    .pipe(eslint({ extends: 'airbnb/base' }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

});
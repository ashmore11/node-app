import gulp   from 'gulp';
import eslint from 'gulp-eslint';
import config from '../config';

gulp.task('lint', function () {

  gulp.src(config.paths.scripts.watch)

    .pipe(eslint(config.eslint))
    .pipe(eslint.format())

});

import gulp        from 'gulp';
import webpack     from 'gulp-webpack';
import gulpif      from 'gulp-if';
import uglify      from 'gulp-uglify';
import rename      from 'gulp-rename';
import livereload  from 'gulp-livereload';
import handleError from '../util/handleError';
import config      from '../config';

gulp.task('scripts', function() {

  gulp.src(config.paths.scripts.source)

    .pipe(webpack(config.webpack))

    .on('error', handleError)

    .pipe(gulpif(config.env.production, uglify()))
    .pipe(rename(config.paths.scripts.filename))
    .pipe(gulp.dest(config.paths.scripts.destination))
    .pipe(gulpif(config.env.development, livereload()));

});

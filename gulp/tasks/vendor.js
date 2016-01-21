import gulp           from 'gulp';
import mainBowerFiles from 'main-bower-files';
import concat         from 'gulp-concat';
import gulpif         from 'gulp-if';
import uglify         from 'gulp-uglify';
import rename         from 'gulp-rename';
import handleError    from '../util/handleError';
import config         from '../config';

gulp.task('vendor', function() {

  gulp.src(mainBowerFiles())

    .on('error', handleError)

    .pipe(concat(config.paths.vendor.filename))
    .pipe(gulpif(config.env.production, uglify()))
    .pipe(gulp.dest(config.paths.vendor.destination));

});

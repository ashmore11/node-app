import gulp    from 'gulp';
import nodemon from 'gulp-nodemon';
import config  from '../config';

gulp.task('server', function() {

  nodemon(config.nodemon);

});

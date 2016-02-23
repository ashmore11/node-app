import gulp       from 'gulp';
import livereload from 'gulp-livereload';
import watch      from 'gulp-watch';
import chalk      from 'chalk';
import config     from '../config';

gulp.task('watch', function() {

  livereload.listen();

	gulp.watch(config.paths.styles.watch, ['styles']);
	gulp.watch(config.paths.scripts.watch, ['lint', 'scripts']);

  watch(config.paths.templates.watch, function() {

    console.log(chalk.cyan('------------------------------'));
    console.log(chalk.cyan('Template updated, reloading...'));
    console.log(chalk.cyan('------------------------------'));

    livereload.reload();

  });

  watch(config.paths.server.watch, function() {

    console.log(chalk.cyan('------------------------------'));
    console.log(chalk.cyan('Server updated, reloading...'));
    console.log(chalk.cyan('------------------------------'));

    livereload.reload();

  });

	gulp.emit('update');

});

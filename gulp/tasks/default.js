import gulp from 'gulp';

gulp.task('build', ['vendor', 'lint', 'scripts', 'styles']);
gulp.task('default', ['build', 'watch', 'server']);

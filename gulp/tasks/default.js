import gulp from 'gulp';

gulp.task('build', ['vendor', 'scripts', 'styles']);
gulp.task('default', ['lint', 'build', 'watch', 'server']);

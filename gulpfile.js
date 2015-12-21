var gulp = require('gulp');

//--------------------------------------------------
// Tasks
//--------------------------------------------------
gulp.task('tsd', tsdTask);
gulp.task('clean', cleanTask);
gulp.task('test', ['typescript'], testTask);
gulp.task('tsconfigGlob', tsconfigGlobTask);
gulp.task('typescript', ['tsconfigGlob'], typescriptTask);
gulp.task('watch:tests', watchTestsTask);
gulp.task('watch:typescript', watchTypescriptTask);
gulp.task('watch', ['watch:typescript', 'watch:tests']);
gulp.task('build:typescript', buildTypescriptTask);
gulp.task('build:typescriptDeclaration', buildTypescriptDeclarationTask);
gulp.task('build:changelog', buildChangelogTask);
gulp.task('build', buildTask);

//--------------------------------------------------
// Tasks dependencies
//--------------------------------------------------
var tsd = require('gulp-tsd');
var mocha = require('gulp-mocha');
var changed = require('gulp-changed');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var conventionalChangelog = require('gulp-conventional-changelog');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var del = require('del');
var tsconfig = require('gulp-tsconfig-files');

//--------------------------------------------------
// Common stuff
//--------------------------------------------------
var tsProject = ts.createProject('tsconfig.json');

//--------------------------------------------------
// Tasks implementations
// npm install gulp-cli -g and gulp --tasks
//--------------------------------------------------
tsdTask.description = "Install Typescript description files";
function tsdTask(done) {
  tsd({
    command: 'reinstall',
    config: './tsd.json'
  }, done);
}

cleanTask.description = "Clean project from generated files";
function cleanTask() {
  return del(['./dist', './test/**/*.spec.js', './test/mock/**/*.js', './src/**/*.js']);
}

testTask.description = "Run unit tests";
function testTask(done) {
  return gulp.src('test/**/*.spec.js')
    .pipe(mocha({
      reporter: 'dot',
      ui: 'tdd',
      require: ['./test/common.js', 'source-map-support/register']
    }))
    .on('error', function() {
      done();
    });
}

tsconfigGlobTask.description = "Generate files entry in tsconfig";
function tsconfigGlobTask(done) {
  gulp.src(tsProject.config.filesGlob)
    .pipe(tsconfig())
    .on('end', function() {
      tsProject = ts.createProject('tsconfig.json');
      done();
    });
}

typescriptTask.description = "Transpile Typescript files";
function typescriptTask() {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(changed('.', {extension: '.js'}))
    .pipe(ts(tsProject)).js
    .pipe(sourcemaps.write({sourceRoot: ''}))
    .pipe(gulp.dest('./'));
}

watchTestsTask.description = "Run tests everytime a JS file change";
function watchTestsTask() {
  gulp.watch(['src/**/*.js', 'test/**/*.js'], ['test']);
}

watchTypescriptTask.description = "Transpile Typescript files everytime a change occurs";
function watchTypescriptTask() {
  gulp.watch(tsProject.config.filesGlob, ['typescript']);
}

/*
 * Build tasks
 */
buildTypescriptTask.description = "Build Typescript files";
function buildTypescriptTask() {
  return gulp.src(['./src/**/*.ts'], {base: './src'})
    .pipe(ts(tsProject)).js
    .pipe(gulp.dest('./dist/'));
}

buildTypescriptDeclarationTask.description = "Build Typescript declaration file";
function buildTypescriptDeclarationTask() {
  return gulp.src('./src/stuff-validation.d.ts', {base: './src'})
    .pipe(gulp.dest('./dist/'));
}

buildChangelogTask.description = "Build the changelog";
function buildChangelogTask() {
  return gulp.src('CHANGELOG.md', { buffer: false })
    .pipe(conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
}

buildTask.description = "Build the package";
function buildTask(done) {
  runSequence(
    'clean', 'test', 'build:typescript', 'build:typescriptDeclaration', 'build:changelog',
    function (error) {
      done(error ? new gutil.PluginError('build', error.message, {showStack: false}) : undefined);
    }
  );
}

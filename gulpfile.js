var gulp = require('gulp');

//--------------------------------------------------
// Tasks
//--------------------------------------------------
gulp.task('tsd', tsdTask);
gulp.task('test', testTask);
gulp.task('typescript', typescriptTask);
gulp.task('watch:tests', watchTestsTask);
gulp.task('watch:typescript', watchTypescriptTask);
gulp.task('watch', ['watch:typescript', 'watch:test']);
gulp.task('build:typescript', buildTypescriptTask);
gulp.task('build:test', buildTestTask);
gulp.task('build:changelog', buildChangelogTask);
gulp.task('build', buildTask);
gulp.task('prepublish:checkEverythingCommitted', prepublishCheckEverythingCommittedTask);
gulp.task('prepublish:checkEverythingPushed', prepublishCheckEverythingPushedTask);
gulp.task('prepublish', prepublishTask);
require('gulp-release-tasks')(gulp);

//--------------------------------------------------
// Tasks implementations
// npm install gulp-cli -g and gulp --tasks
//--------------------------------------------------
tsdTask.description = "Install Typescript description files";
var tsd = require('gulp-tsd');
function tsdTask(done) {
    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, done);
};


testTask.description = "Run unit tests";
var mocha = require('gulp-mocha');
function testTask(done) {
  require('source-map-support').install();
  return gulp.src('tests/**/*.spec.js')
    .pipe(mocha({
        reporter: 'dot'
    }))
    .on('error', function() {
        done();
    });
};


typescriptTask.description = "Transpile Typescript files";
var changed = require('gulp-changed');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = ts.createProject('tsconfig.json');
function typescriptTask() {
  return tsProject.src()
      .pipe(changed('.', {extension: '.js'}))
      .pipe(sourcemaps.init())
      .pipe(ts(tsProject)).js
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./'));
};


watchTestsTask.description = "Run tests everytime a JS file change";
function watchTestsTask() {
    gulp.watch(['src/**/*.js', 'tests/**/*.js'], ['test']);
};


watchTypescriptTask.description = "Transpile Typescript files everytime a change occurs";
function watchTypescriptTask() {
    gulp.watch(tsProject.config.filesGlob, ['typescript']);
};


buildTypescriptTask.description = "Build Typescript files";
function buildTypescriptTask() {
  return tsProject.src()
      .pipe(changed('.', {extension: '.js'}))
      .pipe(ts(tsProject)).js
      .pipe(gulp.dest('./'));
};

buildTestTask.description = "Run the tests and stop when fail";
function buildTestTask() {
  return gulp.src('tests/**/*.spec.js')
    .pipe(mocha({
        reporter: 'dot'
    }));
};


buildChangelogTask.description = "Build the changelog";
var conventionalChangelog = require('gulp-conventional-changelog');
function buildChangelogTask() {
  return gulp.src('CHANGELOG.md', { buffer: false })
    .pipe(conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
};


buildTask.description = "Build the package";
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
function buildTask(done) {
  runSequence(
    'build:typescript', 'build:test', 'build:changelog',
    function (error) {
        done(error ? new gutil.PluginError('build', error.message, {showStack: false}) : undefined);
    })
};


prepublishCheckEverythingCommittedTask.description = "Check if everything is committed";
var git = require('gulp-git');
function prepublishCheckEverythingCommittedTask(done) {
  git.status({args: '--porcelain', quiet: true}, function (err, stdout) {
    var message = err || (stdout.length !== 0 && "Some files are not committed");
    done(message ? new gutil.PluginError('prepublish:checkEverythingCommitted', message, {showStack: false}) : undefined);
  });
};

prepublishCheckEverythingPushedTask.description = "Check if every commits are pushed on origin";
function prepublishCheckEverythingPushedTask(){
  git.exec({args : 'log origin/master..master'}, function (err, stdout) {
    var message = err || (stdout.length !== 0 && "Comits are not pushed");
    done(message ? new gutil.PluginError('prepublish:checkEverythingPushed', message, {showStack: false}) : undefined);
  });
}


prepublishTask.description = "Run before publish to check if everyhting is fine before the publication";
var runSequence = require('run-sequence');
function prepublishTask(done) {
  runSequence(
    'build', 'prepublish:checkEverythingCommitted', 'prepublish:checkEverythingPushed',
    function (error) {
      done(error ? new gutil.PluginError('prepublish', error.message, {showStack: false}) : undefined);
    })
};
// Build et virer sourcemaps
// package.json prepublish faire les taches

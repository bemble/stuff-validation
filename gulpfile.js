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
gulp.task('build:standalone', buildStandaloneTask);
gulp.task('build:changelog', buildChangelogTask);
gulp.task('build', buildTask);
gulp.task('prepublish:checkEverythingCommitted', prepublishCheckEverythingCommittedTask);
gulp.task('prepublish:checkMasterPushed', prepublishCheckMasterPushedTask);
gulp.task('prepublish', prepublishTask);
require('gulp-release-tasks')(gulp);


//--------------------------------------------------
// Tasks dependencies
//--------------------------------------------------
var tsd = require('gulp-tsd');
var mocha = require('gulp-mocha');
var changed = require('gulp-changed');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var conventionalChangelog = require('gulp-conventional-changelog');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var git = require('gulp-git');


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
};

testTask.description = "Run unit tests";
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

/*
* Build tasks
*/
buildTypescriptTask.description = "Build Typescript files";
function buildTypescriptTask() {
  return gulp.src(['./src/**/*.ts'], {base: './src'})
  .pipe(ts(tsProject))
  .pipe(gulp.dest('./dist'));
};

buildTestTask.description = "Run the tests and stop when fail";
function buildTestTask() {
  return gulp.src('tests/**/*.spec.js')
  .pipe(mocha({
    reporter: 'dot'
  }));
};

buildStandaloneTask.description = "Build the standalone version of the module";
function buildStandaloneTask() {

  var b = browserify({
    entries: './src/data-validation.standalone.js'
  });

  return b.bundle()
  .pipe(source('./src/data-validation.standalone.js'))
  .pipe(buffer())
  .on('error', gutil.log)
  .pipe(rename({
    dirname: "./"
  }))
  .pipe(gulp.dest('./dist'))
  .pipe(uglify())
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(gulp.dest('./dist'));
}

buildChangelogTask.description = "Build the changelog";
function buildChangelogTask() {
  return gulp.src('CHANGELOG.md', { buffer: false })
  .pipe(conventionalChangelog({
    preset: 'angular'
  }))
  .pipe(gulp.dest('./'));
};

buildTask.description = "Build the package";
function buildTask(done) {
  runSequence(
    'build:typescript', 'build:test', 'build:standalone', 'build:changelog',
    function (error) {
      done(error ? new gutil.PluginError('build', error.message, {showStack: false}) : undefined);
    })
  };

  /*
  * Prepublish tasks
  */
  prepublishCheckEverythingCommittedTask.description = "Check if everything is committed";
  function prepublishCheckEverythingCommittedTask(done) {
    git.status({args: '--porcelain', quiet: true}, function (err, stdout) {
      var message = err || (stdout.length !== 0 && "Some files are not committed");
      done(message ? new gutil.PluginError('prepublish:checkEverythingCommitted', message, {showStack: false}) : undefined);
    });
  };

  prepublishCheckMasterPushedTask.description = "Check if every commits are pushed on origin";
  function prepublishCheckMasterPushedTask(done){
    git.exec({args : 'log origin/master..master', quiet: true}, function (err, stdout) {
      var message = err || (stdout.length !== 0 && "Commits are not pushed");
      done(message ? new gutil.PluginError('prepublish:checkMasterPushed', message, {showStack: false}) : undefined);
    });
  }

  prepublishTask.description = "Run before publish to check if everyhting is fine before the publication";
  function prepublishTask(done) {
    runSequence(
      'build', 'prepublish:checkEverythingCommitted', 'prepublish:checkMasterPushed',
      function (error) {
        done(error ? new gutil.PluginError('prepublish', error.message, {showStack: false}) : undefined);
      })
    };
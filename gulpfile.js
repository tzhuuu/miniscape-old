var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    minifyImg = require('gulp-imagemin'),
    minifyJS = require('gulp-uglify'),
    rimraf = require('rimraf'),
    sass = require('gulp-sass'),
    util = require('gulp-util'),
    when = require('when'),
    cachebust = require('gulp-cache-bust'),
    fs = require('fs-extra'),
    watch = require('gulp-watch'),
    decache = require('decache'),
    ReactDOMServer = require('react-dom/server'),
    React = require('react'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    reactify = require('reactify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream')
    runSequence = require('run-sequence')
    nodemon = require('gulp-nodemon')

var config = {
  scss: {
    src: './client/scss/*.scss',
    out: './server/public/stylesheets'
  },
  images: {
    src: './game/img/**/*',
    out: './server/public/imgs'
  },
  static: {
    src: './static',
    out: './server/public/static'
  },
  html: {
    src: './client/html/index.html',
    out: './server/public/html/'
  },
  js: {
    src: './client/js/main.jsx',
    out: './server/public/javascripts/'
  }
};

/**** Compiler tasks ****/
var compiler = {}

// Clean /out directory
gulp.task('clean', function(done) {
  rimraf('./server/public/**/*', done);
});

// Compile SCSS -> CSS
gulp.task('watch-scss', function() {
  return watch(config.scss.src, function() {
    return gulp.start('compile-scss');
  });
});

gulp.task('compile-scss', function(done) {
  console.log("Compiling SCSS -> CSS...")
  var deferred = when.defer();
  gulp.src(config.scss.src)
    .pipe(sass())
    .pipe(gulp.dest(config.scss.out))
    .on('end', function() {
      deferred.resolve();
    });
  return deferred.promise;
});

// Compile images
gulp.task('watch-img', function() {
  return watch(config.images.src, function() {
    return gulp.start('compile-img');
  });
});

gulp.task('compile-img', function(done) {
  console.log("Compiling images...")
  var deferred = when.defer();
  gulp.src(config.images.src)
    // .pipe(minifyImg())
    .pipe(gulp.dest(config.images.out))
    .on('end', function() {
      deferred.resolve();
    });
  return deferred.promise;
});

// Compile static resources
gulp.task('watch-static', function() {
  return watch(config.static.src, function() {
    return gulp.start('compile-static');
  });
});

gulp.task('compile-static', function() {
  console.log("Compiling static assets...")
  var deferred = when.defer();
  gulp.src(config.static.src)
    .pipe(gulp.dest(config.static.out))
    .on('end', function() {
      deferred.resolve();
    });
  return deferred.promise;
});

gulp.task('watch-html', function() {
  return watch(config.html.src, function() {
    return gulp.start('compile-html');
  });
});

gulp.task('compile-html', function() {
  // Make sure the html folder exists
  var dir = './server/public/html';
  if (!fs.existsSync('./server/public')) {
    fs.mkdirSync('./server/public');
  }
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  require('babel-register')({
    presets: ['es2015', 'react'],
    plugins: ['transform-react-inline-elements', 'transform-react-constant-elements'],
  });

  fs.readFile(config.html.src, 'utf8', function(e, data) {
    if (e) {
      util.log(util.colors.red(e.toString()));
    } else {

      // Replace into the html
      var newFile = data;

      var MainFrame = require('./client/js/components/MainComponent.jsx');
      decache('./client/js/components/MainComponent.jsx');
      var mainFrameProps = {};
      var mainFrameString = ReactDOMServer.renderToString(React.createElement(MainFrame, mainFrameProps));

      newFile = newFile.replace('<%REPLACE_REACT_MAIN%>', mainFrameString);

      fs.writeFile(config.html.out + '/index.html', newFile, function(e) {
        if (e) {
          util.log(util.colors.red(e.toString()));
        }
      });
    }
  });
});

gulp.task('watch-js', function() {
  var task = '[watch-js]';
  var count = 0;
  var cyan = util.colors.cyan;
  var magenta = util.colors.magenta;

  var bundle = function(bundler) {
    util.log(cyan(task), 'Starting bundling', magenta('#' + count));
    var startTime = new Date().getTime();

    return bundler
      .bundle()
      .on('error', function(e) {
        util.log(util.colors.red(e.toString()));
        this.emit('end');
      })
      .pipe(source('app.js'))
      .pipe(gulp.dest(config.js.out))
      .on('end', function() {
        var time = new Date().getTime() - startTime;
        util.log(cyan(task), 'Finished bundling', magenta('#' + count++), 'after', magenta(time + 'ms'));
      });
  };

  var bundler = browserify(config.js.src, {
      cache: {},
      packageCache: {},
      sourceMap: false,
    })
    .plugin(watchify)
    .transform(reactify, {es6: true})
    .transform(babelify.configure({
      compact: false,
    }));

  bundler.on('update', function() {
    bundle(bundler);
    runSequence('compile-html');
  });

  return bundle(bundler);
});

gulp.task('compile-js', function() {
  return browserify(config.js.src)
    .transform(reactify, {es6: true})
    .transform(babelify.configure({
      compact: false
    }))
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(config.js.out));
});

gulp.task('nodemon', function() {
  nodemon({
    script: 'server/bin/www',
    tasks: [],
    ext: 'html js jsx jade scss',
    env: { 'NODE_ENV': 'development' },
    ignore: [
      'public/**',
      'node_modules',
      'client/**'
    ],
  });
});

gulp.task('compile', function() {
  runSequence('clean', ['compile-html', 'compile-js', 'compile-scss', 'compile-img', 'compile-static']);
});

gulp.task('watch', function() {
  runSequence('clean', 'compile', ['watch-html', 'watch-js', 'watch-scss', 'watch-img', 'watch-static', 'nodemon']);
});

// Default gulp tasks
gulp.task('default', function() {
  gulp.start('watch');
});

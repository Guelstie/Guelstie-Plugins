'use strict'
const gulp = require('gulp')
const clean = require('gulp-clean')
const cache = require('gulp-cached')
const watch = require('gulp-watch')
const sourcemaps = require('gulp-sourcemaps')
const buffer = require('vinyl-buffer')
const babel = require('gulp-babel')
const glebab = require('gulp-lebab')
const browserSync = require('browser-sync').create()

const production = false

const CONFIG = {
  file: production ? '*.js' : 'GU_' + 'AdCore.js',
  src: './src/',
  build: production ? './dist/' : './game/js/plugins/'
}

const browserSyncConfig = {
  server: {
    baseDir: './game'
  }
}

gulp.task('serve', ['browser-sync', 'watch-folder'], () => {
})

gulp.task('watch-folder', () => gulp.src(CONFIG.src + '*.js', { base: CONFIG.src })
    .pipe(sourcemaps.init())
    .pipe(cache('watching'))
    .pipe(watch(CONFIG.src, { base: CONFIG.src }, browserSync.reload()))
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(CONFIG.build))
    .pipe(browserSync.stream())
)

gulp.task('browser-sync', () => {
  browserSync.init(browserSyncConfig)
})

gulp.task('to-es5', () => gulp.src(`${CONFIG.src}${CONFIG.file}`)
    .pipe(babel())
    .pipe(gulp.dest(CONFIG.build)))

gulp.task('to-es6', () => gulp.src(`${CONFIG.src}${CONFIG.file}`)
    .pipe(glebab())
    .pipe(gulp.dest(CONFIG.build)))

gulp.task('plain-copy', () => gulp.src(`${CONFIG.src}${CONFIG.file}`)
    .pipe(gulp.dest(CONFIG.build)))

gulp.task('clean', () => gulp.src('game/js/plugins/**')
    .pipe(buffer())
    .pipe(clean({ force: true })))

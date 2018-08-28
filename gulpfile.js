var gulp = require('gulp');
// 插件的主要文件

var smushit = require('gulp-smushit');
// var imagemin = require('gulp-imagemin');
// var jpegtran = require('imagemin-jpegtran');
// var pngquant = require('imagemin-pngquant');
//这三个压缩比例太小了换乘了smushit

// var postcss = require('gulp-postcss');
// 目前使用的插件名字
// 
var stylus = require('gulp-stylus');
var poststylus = require('poststylus');

var sourcemaps = require('gulp-sourcemaps');


var autoprefixer = require('autoprefixer');

// 选项
// 自动添加前缀

// var cssnext = require('cssnext');
// 颜色自动转换

// var precss = require('precss');
// sass

var pxtorem = require('postcss-pxtorem');
// pxtorem

// var atImport = require('postcss-import');
// 使用import链接css
// @import "b.css";

// var mqpacker = require('css-mqpacker');
// 综合媒体查询

// var cssnano = require('cssnano');
// var cssnano = require('cssnano')({
//     discardComments: true
// });
// 以上是引用。。压缩代码
// var rename = require('gulp-rename')

var base64 = require('gulp-base64');
// base64

var images_rename = require('./module/images_rename');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

function swallowError(error) {
    console.error(error.toString())

    this.emit('end')
}
gulp.task('serve', ['css'], function () {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./input/*", ['css']);
    gulp.watch("./js/*.js").on('change', reload);
    gulp.watch("./*.html").on('change', reload);
});


gulp.task('css', function () {
    var processors = [
        // autoprefixer({
        //   browserslist: [
        //   "iOS 7",
        //   ],
        // }),
        autoprefixer({
            browsers: [
                'last 5 version'
            ]
        }),
        // cssnext,
        // precss,
        // pxtorem({
        //  rootValue: 2,
        //  replace: true,
        //  unitPrecision:5,
        //   propWhiteList: [],
        //   minPixelValue: 0
        // }),
        // pxtorem({
        //     rootValue: 100,
        //     replace: true,
        //     unitPrecision: 5,
        //     propList: ['*'],
        //     minPixelValue: 2
        // }),
        // wap
        // pxtorem({
        //     rootValue: 20,
        //     replace: false,
        //     unitPrecision: 5,
        //     propList: ['*', '!border'],
        //     minPixelValue: 2
        //     // propList需要进行pxtorem进行转换的元素“*”代表所有的
        // }),
        // bootstrap
        // atImport,
        // mqpacker,
        // cssnano({
        //     "browserslist": [
        //         "> 1%",
        //         "last 2 versions",
        //         " ie 9"
        //     ]
        // }),
    ];
    // return gulp.src('input/public.pcss')
    return gulp.src('./input/*.styl')
        // return gulp.src('./input/*.css')
        .pipe(sourcemaps.init())
        // .pipe(postcss(processors))
        .pipe(stylus({
            // compress: true,
            use: [
                poststylus(processors)
            ]
        }))
        .on('error', swallowError)
        // .pipe(rename("public.css"))
        .pipe(base64({
            baseDir: '',
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            maxImageSize: 20 * 1024, // bytes 
            debug: true
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./css/"))
        .pipe(reload({
            stream: true
        }))
        .on('change', function (event) {
            console.log('File' + event.path + ' was  ' + event.type + ', running tasks...' + new Date());
        });
});

gulp.task('t_images_rename', function () {
    images_rename(__dirname);
    return;
})

gulp.task('default', ['serve', 't_images_rename']);

// gulp.task('watch', function() {
//   gulp.watch(['input/*.css'], ['css']);
// });



// gulp.task('jpg', function() {
//     return gulp.src('./img/*.jpg').pipe(imagemin())
//         .pipe(gulp.dest('./img/minjpg/'));
// })


// gulp.task('png', function() {
//     return gulp.src('./img/*.png').pipe(imagemin())
//         .pipe(gulp.dest('./img/minpng/'));
// })


gulp.task('jpgpng', function () {
    return gulp.src('./img/*.{jpg,png}')
        .pipe(smushit({
            "verbose": true
        }))
        .pipe(gulp.dest('./img/compress/'));
});
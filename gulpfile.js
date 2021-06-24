const gulp = require("gulp");
const uglify = require("gulp-uglify");
const del = require("del");

gulp.task("rmrf/dist", () => del("dist"));

gulp.task("rmrf/lib", () => del("lib"));

gulp.task("compile", () =>
  gulp.src("dist/**/*.js").pipe(uglify()).pipe(gulp.dest("lib"))
);

gulp.task("default", gulp.series(["rmrf/lib", "compile", "rmrf/dist"]));

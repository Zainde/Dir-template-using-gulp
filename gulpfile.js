// making require for all the things needed to run this code
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const file = require('gulp-file');
sass.copmpiler = require('node-sass');
const fs = require('fs');
// another sass compiler
// sass.copmpiler = require('dart-sass');

// the location for your css file
const css_location = `assets/css/main.css`;
// the location for your js file
const js_location = "assets/js/main.js";
// basic html startup code, what is shown in your hmtl file when made
const basic_html = `<!-- basic html template -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href=${css_location} type="text/css" rel="stylesheet">
  <title>basic html template</title>
</head>

<body>
    <header class="top">
      <figure>
        <img src="./resources/img/Logo_Web.png" alt="logo" />
      </figure>
      <nav>
        <ul>
          <li><a href="#">forside</a>
          </li>
          <li><a href="#">site</a>
          </li>
          <li><a href="#">kontakt</a>
          </li>
        </ul>
      </nav>
    </header>

    <main>

    </main>

    <form class="right" action="#" id="js_1" method="post">
      <legend>
        <h2>Send en besked</h2>
      </legend>
      <section>
        <label for="name">Fulde navn: </label>
        <input required type="text" autocomplete="off" id="name" name="name" placeholder="Fulde navn:" value="" />

        <label for="adress">Adresse: </label>
        <input required autocomplete="off" type="text" id="adress" name="adress" placeholder="Adresse:" value="" />

        <label for="email">email: </label>
        <input required autocomplete="off" type="text" id="email" name="email" placeholder="Email:" value="" />

<div>
<div>
        <label for="tlfcheck">Jeg vil gerne ringes op: </label>
        <input class="" type="checkbox" name="tlfcheck" id="tlfcheck">
</div>
        <label for="tlf">Telefon: </label>
        <input autocomplete="off" type="text" id="tlf" name="tlf" placeholder="Telefon:" value="" />
</div>
        <label for="message">besked: </label>
        <textarea required autocomplete="off" type="text" id="message" name="message" placeholder="Besked:" value=""></textarea>

        <button type="button" onclick="validForm(this.form)">send besked</button>
      </section>
    </form>

    <footer class="bot">

    </footer>

<script src=${js_location}></script>
</body>

</html>
`;
// basic scss code, what is shown in your scss file when made
const basic_scss = `/* scss test */
body{
  display: flex;
  flex-direction: column;
  header{
    display: flex;
    nav{
      width: 100%;
      ul{
      display: flex;
      justify-content: space-around;
      }
    }
  }
  main{
    display: flex;
  }
  form{
    display: flex;
    flex-direction: column;
    section{
      width: 50%;
      display: grid;
      grid-template-columns: 0.5fr 1fr;
      gap: 10px;
      label{
        justify-self: flex-end;
      }
    }
  }
  button{
    justify-self: center;
  }
  footer{
    display: flex;
  }
}
`
// compiler for scss to css and making directory for the file
gulp.task('sass', ()=>{
  return gulp.src('./core/sass/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(sass({outputStyle: 'extended'}))
  .pipe(concat('main.css'))
  .pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest('./public_html/assets/css'));
});
// compiler for js making directory for the file
gulp.task('js', ()=>{
  return gulp.src('./core/js/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(concat('main.js'))
  .pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest('./public_html/assets/js'));
});
// gulp task to make directories and files for js, scss, css and html. also runs a watch on the compiler tasks defined above
gulp.task('directories', ()=>{
  if (fs.existsSync('./public_html/index.html')===false ) {
    console.log('making files');
  return Promise.all([
      new Promise((resolve, reject)=>{
       gulp.src('./core/js/', {allowEmpty: true})
          .pipe(file('main.js', '/* js file */'))
          .on('error', reject)
          .pipe(gulp.dest('./core/js'))
          .on('end', resolve)
      }),
      new Promise((resolve, reject)=>{
        gulp.src('./core/sass/', {allowEmpty: true})
          .pipe(file('main.scss', basic_scss))
          .on('error', reject)
          .pipe(gulp.dest('./core/sass'))
          .on('end', resolve)
      }),
      new Promise((resolve, reject)=>{
        gulp.src('./public_html/', {allowEmpty: true})
          .pipe(file('index.html', basic_html))
          .on('error', reject)
          .pipe(gulp.dest('./public_html'))
          .on('end', resolve)
      })
    ]).then(()=>{
      gulp.src('./core/sass/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(sass({outputStyle: 'extended'}))
      .pipe(sourcemaps.write('maps'))
      .pipe(gulp.dest('./public_html/assets/css'));
      console.log('files are made\n' + 'starting watch');
        gulp.watch('./core/sass/*.scss', gulp.series('sass'));
        gulp.watch('./core/js/*.js', gulp.series('js'));
      });
} else {
  console.log('files already made\n' + 'starting watch');
  gulp.watch('./core/sass/**/*.scss', gulp.series('sass'));
  gulp.watch('./core/js/**/*.js', gulp.series('js'));
}
});
// code to run directories task just by typing gulp in terminal
gulp.task('default', gulp.parallel('directories'));

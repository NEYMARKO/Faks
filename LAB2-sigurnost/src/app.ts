import express from 'express';
import path from 'path';
import bodyParser from 'body-parser'; // Import body-parser

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.render('index');
});

app.route('/submit')
  .get((req, res) => {
    const name = req.query.name || '';
    res.type('text/html').send(`<h1>Hello, ${name}!</h1>`);
  })
  .post((req, res) => {
    const name = req.body.name || '';
    res.send(`<h1>Hello, ${name}!</h1>`);
  });

const hostname = '127.0.0.1';
const port = 4072;
app.listen(port, hostname, () => {
  console.log(`SPA hosted at http://${hostname}:${port}/`);
});

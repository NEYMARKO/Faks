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

function filterInput(name: string): string {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return name.replace(reg, (match) => (map[match as keyof typeof map]));
}

app.route('/submit')
  .get((req, res) => {
    //console.log("BEFORE STRING FORMATING: " + req.query.name);
    var name: string = String(req.query.name || '');
    const shouldFilter: string = String(req.query.defenceBool);
    if (shouldFilter === "true") {
      name = filterInput(name);
      console.log("Filtered name: " + name);
    }
    res.type('text/html').send(`<h1>Hello ${name}!</h1>`);
  })
  .post((req, res) => {
    var name: string = String(req.body.name || '');
    const shouldFilter: string = String(req.body.defenceBool);
    //console.log("DEFENCE BOOL: " + shouldFilter);
    if (shouldFilter === "true") {
      name = filterInput(name);
      console.log("Filtered name: " + name);
    }
    res.send(`<h1>Hello ${name}!</h1>`);
  });

const hostname = '127.0.0.1';
const port = 4072;
app.listen(port, hostname, () => {
  console.log(`SPA hosted at http://${hostname}:${port}/`);
});

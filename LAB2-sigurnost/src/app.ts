import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//https://stackoverflow.com/questions/2794137/sanitizing-user-input-before-adding-it-to-the-dom-in-javascript
function filterInput(name: string): string {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
    "`": '&grave;'
  };
  const reg = /[&<>"'/`]/ig;
  return name.replace(reg, (match) => (map[match as keyof typeof map]));
}

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/xss', function (req, res) {
  res.render('xss'); 
});

app.get('/sensitive-data', function (req, res) {
  res.render('sensitiveData');
});

app.post('/sensitive-data/submit', async function(req, res) {
  const { userName, password, shouldEncrypt } = req.body;

  if (shouldEncrypt) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      res.json({ userName, password: hashedPassword });
    } catch (error : any) {
      console.error('Error hashing password:', error.message);
    }
  }
  else{
    res.json({ userName, password: password });
  }
});

app.route('/submit')
  .get((req, res) => {

    var name: string = String(req.query.name || '');
    const shouldFilter: string = String(req.query.defenceBool);

    if (shouldFilter === "true") {
      name = filterInput(name);
      console.log("Filtered name: " + name);
    }
    res.type('text/html').send(`<h1>Bok ${name}!</h1>`);
  })
  .post((req, res) => {

    var name: string = String(req.body.name || '');
    const shouldFilter: string = String(req.body.defenceBool);

    if (shouldFilter === "true") {
      name = filterInput(name);
      console.log("Filtered name: " + name);
    }

    res.send(`<h1>Bok ${name}!</h1>`);
  });

const hostname = '127.0.0.1';
const port = 4072;
app.listen(port, hostname, () => {
  console.log(`SPA hosted at http://${hostname}:${port}/`);
});

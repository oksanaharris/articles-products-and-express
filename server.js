const express = require('express');
const router = express.Router();
const expHbs = require('express-handlebars');
var bodyParser = require('body-parser');
const articlesRouter = require('./routes/articles');
const productsRouter = require('./routes/products');


const app = express();

const hbs = expHbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');



const books = [
  {title: 'Ready Player One', author: 'Ed Kim'},
  {title: 'Nasea', author: 'Some Porstcard'},
  {title: '1984', author: 'George Orwell'}
];

const homeData = {
  books: books,
  name: 'Bob',
  age: 12
}
// with handlebars everything must be an object that is handed to it
// books can't be an array, so we put it in an object literal
app.get('/', (req, res) => {
  res.send('hello');
});

const server = app.listen(8080, () => {
  console.log(`Server running on port 8080`);
});


app.use(express.static('views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/articles', articlesRouter);

app.use('/products', productsRouter);




// app.get('/buzzwords', function (req, res) {
//   res.send(JSON.stringify({buzzWords}));
// });


// app.post('/buzzword', function (req, res) {
//   console.log('REQUEST BODY');
//   console.log(req.body);
// });
const express = require('express');
const router = express.Router();
const expHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const articlesRouter = require('./routes/articles');
const productsRouter = require('./routes/products');
const methodOverride = require('method-override');

const ProductDb = require('./db/productDB.js');

const app = express();

// with handlebars everything must be an object that is handed to it
// books can't be an array, so we put it in an object literal

const hbs = expHbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// with handlebars everything must be an object that is handed to it
// books can't be an array, so we put it in an object literal


const server = app.listen(8080, () => {
  console.log(`Server running on port 8080`);
});


app.use(express.static('views'));

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('products', ProductDb);
});

app.use('/articles', articlesRouter);

app.use('/products', productsRouter);




// app.get('/buzzwords', function (req, res) {
//   res.send(JSON.stringify({buzzWords}));
// });


// app.post('/buzzword', function (req, res) {
//   console.log('REQUEST BODY');
//   console.log(req.body);
// });
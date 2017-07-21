
const express = require('express');
const router = express.Router();
const expHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const articlesRouter = require('./routes/articles');
const productsRouter = require('./routes/products');
const methodOverride = require('method-override');

const ProductDb = require('./db/productDB.js');

const app = express();

const hbs = expHbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

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


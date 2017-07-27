
const express = require('express');
const router = express.Router();
const ProductDb = require('../db/productDB.js');
const Product = require('../db/products.js');

const pgp = require('pg-promise')();
const db = pgp('postgres://localhost:5432/products_and_articles');

// let error = '';

router.get('/', function (req, res){

  db.any('SELECT * FROM products')
  .then((products) => {
    console.log('this is what get on products returns ', products);
    if(req.headers.hasOwnProperty('accept') && req.headers.accept.match(/json/)) {
      return res.json(products);
    }
    res.render('products', {products});
  });
});


router.get('/new', function (req, res){
  res.render('productNew');
});


router.get('/:id', function (req, res){

  let productId = parseInt(req.params.id);

  db.any('SELECT * FROM products WHERE id = $1', [productId])
  .then((productsResult) => {
    console.log('this is our product from GET/:ID', productsResult);
    if(req.headers.hasOwnProperty('accept') && req.headers.accept.match(/json/)) {
      return res.json(productsResult);
    }
    if(productsResult.length < 1) return res.status(400).send({'error': 'a product with this id does not exist'});
    res.render('product', productsResult[0]);
  });
  // // response with HTML generated from your teamplate
});


router.get('/:id/edit', function (req, res){

  let productId = parseInt(req.params.id);

  db.any('SELECT * FROM products WHERE id = $1', [productId])
  .then((productsResult) => {
    console.log('this is our product from GET/:ID/EDIT', productsResult);
    if(req.headers.hasOwnProperty('accept') && req.headers.accept.match(/json/)) {
      return res.json(productsResult);
    }
    if(productsResult.length < 1) return res.status(400).send({'error': 'a product with this id does not exist'});
    res.render('productEdit', productsResult[0]);
  });

});


router.post('/', function (req, res){

  if(!checkIfAllParametersProvided(req.body)) return res.status(400).send({'error': 'must provide name, price, and inventory'});
  if(isNaN(parseFloat(req.body.price))) return res.status(400).send({'error': 'price should be a number'});
  if(isNaN(parseInt(req.body.inventory))) return res.status(400).send({'error': 'inventory should be a number'});

  let name = req.body.name.toLowerCase();
  let price = parseFloat(req.body.price);
  let inventory = parseInt(req.body.inventory);

  // these should redirect back to new page, and display an error message

  db.any('INSERT INTO products (name, price, inventory) VALUES ($1, $2, $3) RETURNING id', [name, price, inventory])
  .then((result) => {
    if (req.headers.hasOwnProperty('accept') && req.headers.accept.match(/json/)) {
      return res.json({success: true, id: result[0].id});
    }
    res.redirect('/products');
  }).catch((error) => {
    console.log ('this is the error we get back', error);
    return res.status(400).send({'error': 'cannot post to an existing product'});
  });
  // does this redirect to root, not /products?!?!?!?1
  // since we do not specify the method here (in res redirect), does this mean we always have to keep
  // our urls separate for our get and post and put methods?
});


router.put('/:id', function (req, res){

  if(isNaN(parseFloat(req.body.price))) return res.status(400).send({'error': 'price should be a number'});
  if(isNaN(parseInt(req.body.inventory))) return res.status(400).send({'error': 'inventory should be a number'});

  let name = req.body.name.toLowerCase();
  let price = parseFloat(req.body.price);
  let inventory = parseInt(req.body.inventory);
  let productId = parseInt(req.params.id);

  db.any('UPDATE products SET name = $1, price = $2, inventory = $3 WHERE id = $4 RETURNING *', [name, price, inventory, productId])
  .then ((updatedProducts) => {
    console.log('returned from the update query', updatedProducts);
    if (updatedProducts.length < 1) return res.status(400).send({'error': 'cannot edit a non-existing product'});
    res.redirect('/products/'+productId);
  }).catch((error) => {
    console.log ('this is the error we get back', error);
  });
  // if not successful, redirect to new route /products/:id/edit with error in flash
});


router.delete('/:id', function (req, res){

  if(isNaN(parseInt(req.params.id))) return res.status(400).send({'error': 'id should be a number'});

  let productId = parseInt(req.params.id);

  db.any('DELETE FROM products WHERE id = $1 RETURNING * ', [productId])
  .then ((deletedProducts) => {
    console.log('returned from the delete query', deletedProducts);
    if (deletedProducts.length < 1) return res.status(400).send({'error': 'cannot delete a non-existing product'});
    res.redirect('/products');
  }).catch((error) => {
    console.log ('this is the error we\'re getting', error);
  });
  // if successful redirect to /products with some way to communicate that action was successful
  // if not successful, redirect to new route /products/:id with message that action was unsuccessful
});


function checkIfAllParametersProvided(input){
  let requiredFields = ['name', 'price', 'inventory'];
  return requiredFields.every(field => field in input && input[field] !== '');
}


module.exports = router;
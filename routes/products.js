
const express = require('express');
const router = express.Router();
const ProductDb = require('../db/productDB.js');
const Product = require('../db/products.js');

const pgp = require('pg-promise')();
const db = pgp('postgres://localhost:5432/products_and_articles');

// let error = '';
 db.any('SELECT * FROM products')
  .then((data) => {
    console.log (data);
    // res.render('products', ProductDb);
  });

router.get('/', function (req, res){

  db.any('SELECT * FROM products')
  .then((products) => {
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

  let productId = req.params.id;

  db.any('SELECT * FROM products WHERE id = $1', [productId])
  .then((productsResult) => {
    console.log('this is our product from GET/:ID', productsResult);
    if(req.headers.hasOwnProperty('accept') && req.headers.accept.match(/json/)) {
      return res.json(productsResult);
    }
    if(productsResult.length < 1) return res.status(400).send({'error': 'a product with this id does not exist'});
    res.render('product', productsResult[0]);
  });

  // if(!findExistingProduct('id', parseInt(req.params.id))) return res.status(400).send({'error': 'a product with this id does not exist'});

  // res.render('product', findExistingProduct('id', parseInt(req.params.id)));
  // // response with HTML generated from your teamplate
});


router.get('/:id/edit', function (req, res){
  if(!findExistingProduct('id', parseInt(req.params.id))) return res.status(400).send({'error': 'a product with this id does not exist'});
  res.render('productEdit', findExistingProduct('id', parseInt(req.params.id)));
});


router.post('/', function (req, res){

  console.log('request method', req.method);

  if(!checkIfAllParametersProvided(req.body)) return res.status(400).send({'error': 'must provide name, price, and inventory'});
  if(findExistingProduct('name', req.body.name)) return res.status(400).send({'error': 'cannot post to an existing product'});
  if(isNaN(parseFloat(req.body.price))) return res.status(400).send({'error': 'price should be a number'});
  if(isNaN(parseInt(req.body.inventory))) return res.status(400).send({'error': 'inventory should be a number'});

  // these should redirect back to new page, and display an error message

  createNewProduct(req.body);
  // error = 'test';
  if (req.headers.hasOwnProperty('accept') && req.headers.accept.match(/json/)) {
    return res.json(ProductDb);
  }
  res.redirect('/products');
  //does this redirect to root, not /products?!?!?!?1
  //since we do not specify the method here (in res redirect), does this mean we always have to keep
  // our urls separate for our get and post and put methods?

});


router.put('/:id', function (req, res){
  console.log('put is being hit!!!');
  console.log(req.params.id);
  console.log('returned product', findExistingProduct('id', parseInt(req.params.id)));
  if(!findExistingProduct('id', parseInt(req.params.id))) return res.status(400).send({'error': 'cannot edit a non-existing product'});
  if(parseInt(req.params.id) !== parseInt(req.body.id)) return res.status(400).send({'error': 'id in url and in body do not match'});
  updateProduct(req.body, findExistingProduct('id', parseInt(req.params.id)));
  res.redirect('/products/'+req.body.id);
  // if not successful, redirect to new route /products/:id/edit with error in flash
  console.log(ProductDb.products);
});


router.delete('/:id', function (req, res){
  if(!findExistingProduct('id', parseInt(req.params.id))) return res.status(400).send({'error': 'cannot delete a non-existing product'});
  ProductDb.remove(parseInt(req.params.id));
  console.log(ProductDb.products);
  res.redirect('/products');
  // if successful redirect to /products with some way to communicate that action was successful
  // if not successful, redirect to new route /products/:id with message that action was unsuccessful
});


function checkIfAllParametersProvided(input){
  let requiredFields = ['name', 'price', 'inventory'];
  return requiredFields.every(field => field in input && input[field] !== '');
}


function findExistingProduct (param, value){
  let found = false;
  if(ProductDb.products.length > 0){
    ProductDb.products.forEach((product) => {
      if (product[param] === value){
        found = product;
        // could also return the product itself;
        console.log('product found');
      }
    });
    return found;
  } else {
    console.log('empty product DB - product not found');
    return found;  }
}


function createNewProduct(input){
  let name = input.name;
  let price = parseFloat(input.price);
  let inventory = parseInt(input.inventory);
  let id;

  if(ProductDb.products.length > 0){
    let largest = 1;
    ProductDb.products.forEach((product) => {
      if (product.id > largest){
        largest = product.id
      }
    });
    id = largest + 1;
  } else {
    id = 1;
  }

  let newProduct = new Product(id, name, price, inventory);
  ProductDb.products.push(newProduct);
}


function updateProduct(input, obj){
  console.log('input', input);
  console.log('object', obj);

  let id = parseInt(input.id);
  let name = input.name;
  let price = parseFloat(input.price);
  let inventory = parseInt(input.inventory);

  obj.name = name;
  obj.price = price;
  obj.inventory = inventory;

  console.log('object updated', obj);

}


module.exports = router;
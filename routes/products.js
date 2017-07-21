const express = require('express');
const router = express.Router();

const ProductDb = require('../db/productDB.js');
// const db = ProductDbObj;

const Product = require('../db/products.js');
//just a function


router.get('/', function (req, res){
  res.send('all products');
  //response with HTML generated from your template which displays all Products added thus far
});

router.get('/:id', function (req, res){
  res.send('some product');
  // response with HTML generated from your teamplate
});

router.post('/', function (req, res){

  console.log(req.body);

  if(findExistingProduct('name', req.body.name)) return res.status(400).send({'error': 'cannot post to an existing product'});
  if(!checkIfAllParametersProvided(req.body)) return res.status(400).send({'error': 'must provide name, price, and inventory'});
  createNewProduct(req.body);
  console.log(ProductDb.products);
  res.send('creating an product');

  // res.status(400).send({'error': 'must provide name, price and inventory'});
  // res.redirect('/');
  // if you send to slash new/get - form that allows you;
  // redirect to new form page, display error message with flash and using res.render
});


router.put('/:id', function (req, res){
  console.log(req.params.id);
  console.log('returned product', findExistingProduct('id', parseInt(req.params.id)));
  if(!findExistingProduct('id', parseInt(req.params.id))) return res.status(400).send({'error': 'cannot edit a non-existing product'});
  if(parseInt(req.params.id) !== parseInt(req.body.id)) return res.status(400).send({'error': 'id in url and in body do not match'});
  updateProduct(req.body, findExistingProduct('id', parseInt(req.params.id)));
  res.send('update a product');
  console.log(ProductDb.products);
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
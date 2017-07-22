const mocha = require('mocha');
const chai = require('chai');

const supertest = require('supertest');

const server = require('../server.js');

const ProductDB = require('../db/productDB.js');

const expect = chai.expect;
const should = chai.should();

let request = supertest(server);

beforeEach(function () {
  // something something
});



describe('adding a product', function (){

  it('should return a status of 400 - Bad Request and an error message of "cannot post to an existing product" if name is the same as an existing product\'s name', function (done){

    let testProduct = {name: 'stickandstones', price: 2.00, inventory: 1};
    ProductDB.products.push(testProduct);

    let reqBody = 'name=stickandstones&price=2.50&inventory=4';

    request
      .post('/products')
      .set('Accept', 'application/json')
      .send(reqBody)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal('cannot post to an existing product');
        done();
      });//.end
  });//it


  it ('should return a status of 400 - Bad Request and an error message of "price should be a number"', function (done) {

    let reqBody = 'name=munchkins&price=twodollars&inventory=4';

    request
      .post('/products')
      .set('Accept', 'application/json')
      .send(reqBody)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal('price should be a number');
        done();
      });//.end
  });//it


  it ('should return a status of 400 - Bad Request and an error message of "price should be a number"', function (done) {

    let reqBody = 'name=munchkins&price=2&inventory=fourdollars';

    request
      .post('/products')
      .set('Accept', 'application/json')
      .send(reqBody)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal('inventory should be a number');
        done();
      });//.end
  });//it


  it ('should return a status of 400 - Bad Request and an error message of "must provide name, price, and inventory" if missing the inventory parameter', function (done) {

    let reqBody = 'name=munchkins&price=2';

    request
      .post('/products')
      .set('Accept', 'application/json')
      .send(reqBody)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal('must provide name, price, and inventory');
        done();
      });//.end
  });//it


  it ('should return a status of 400 - Bad Request and an error message of "must provide name, price, and inventory" if missing the price parameter', function (done) {

    let reqBody = 'name=munchkins&inventory=fourdollars';

    request
      .post('/products')
      .set('Accept', 'application/json')
      .send(reqBody)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal('must provide name, price, and inventory');
        done();
      });//.end
  });//it


  it ('should return a status of 400 - Bad Request and an error message of "must provide name, price, and inventory" if missing the name parameter', function (done) {

    let reqBody = 'price=2&inventory=fourdollars';

    request
      .post('/products')
      .set('Accept', 'application/json')
      .send(reqBody)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal('must provide name, price, and inventory');
        done();
      });//.end
  });//it


  it('should add an object to the array with properties that match the passed-in name (string), price(number) and inventory(number) parameters and a unique id(number) assigned', function (done){

    let reqBody = 'name=dogbiskets&price=2.50&inventory=4';

    request
      .post('/products')
      .set('Accept', 'application/json')
      .send(reqBody)
      .end((err, res) => {
        if (err) return done(err);
        let productsArr = res.body.products;
        let matchingProducts = [];
        productsArr.forEach((product, index, array) => {
          if(product.name === 'dogbiskets'){
            matchingProducts.push(product);
            array.splice(index, 1);
            ProductDB.products.pop();
          }//if
        });//for each

        // should find one and only one product with the given name in the array now
        expect(matchingProducts.length).to.equal(1);

        // all added product parameters should be what we provided
        // price and inventory should be numbers (price should have 2 decimal points if provided)
        expect(matchingProducts[0].name).to.equal('dogbiskets');
        expect(matchingProducts[0].inventory).to.equal(4);
        expect(matchingProducts[0].price).to.equal(2.50);

        // product should have an assigned id that is a number
        expect(matchingProducts[0].id).to.be.a('number');

        //no other products' ids should match the new product's id (we already spliced it out of the array)
        expect(productsArr.every(product => {return product.id !== matchingProducts[0].id})).to.equal(true);

        done();
      });//end
  });//it


  it('should redirect to the products page if successful', function (done){

    let reqBody = 'name=cats&price=3&inventory=2';

    request
      .post('/products')
      .send(reqBody)
      .expect(302)
      .end ((err, res) => {
        if (err) return done(err);
        res.header['location'].should.be.equal('/products');
        done();
      });
  });//it

});//describe


describe('editing a product', function (){

  // when attempting to put with an id that doesn't exist, should error out, get error header and deliver message 'cannot edit a non-existing product'
  // X - add - res.body.id, name, etc. should equal the new product object's properties, new product should be found in DB
  // X - add - new id should not equal any of the old id's
  // add - should not be able to add a product if name exists
  // X - all parameters should be provided
  // X - name should be string
  // X - id, price and inventory should be number type;
  // X -  req.body.id, price, inventory should be able to be converted to numbers - when providing the wrong type of parameters, errors out and delivers message abc
  // X - post to products/ creates a new product
  // X - should get the right header status
  // X - should get the right error message
  // X - when any of the 3 parameters are missing, should error out, get error header and deliver message abc
  // X - products/new submit returns the /products page - redirects


})

//FUNCTIONALITY
// X - add - res.body.id, name, etc. should equal the new product object's properties, new product should be found in DB
// X - add - new id should not equal any of the old id's
// edit - res.body.id, etc. should equal the product's revised properties, product should be found in DB
// delete - product should no longer be found in DB
// delete - only deletes one product

//VALIDATION
// X - add - should not be able to add a product if name exists
// edit - should not be able to edit a product if id does not exist
// delete - should not be able to delete a product if id does not exist
// X - add - all parameters should be provided
// all parameters should be provided
// X - add - id, price and inventory should be number type;
// id, price and inventory should be number type;
//*** req.body.id, price, inventory should be able to be converted to numbers

//SERVER RESPONSES WITH FUNCTIONALITY
//get/id returns a product with that id
//post to products/ creates a new product
//put to /id edits a product
//delete to /id deletes a product

//SERVER RESPONSES
//should get the right header status
//should get the right error message

//SERVER REDIRECTING
// X - products/new submit returns the /products page - redirects
//products/id/edit submit returns the /id page - redirects
//products/id delete button returns the /products page - redirects

//TEMPLATE RENDERING
//get/products returns a view of all products
//products/new returns an editable form
//products/id/edit returns an editable form





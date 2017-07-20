class Product {
  constructor (id, name, price, inventory){
    Object.assign(this, {id, name, price, inventory});
  }
}

module.exports = Product;
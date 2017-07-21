class ProductDB {
  constructor (){
    this.products = [{id: 1, name: 'sticks', price: 2, inventory: 3}, {id: 2, name: 'carrots', price: 3, inventory: 5}];
  }

  remove(id){
    this.products.forEach((product, index, array) => {
      console.log('for looping');
      if(product.id === id){
        array.splice(index, 1);
        console.log('found and deleted');
      }
    });
  }
}

module.exports = new ProductDB();
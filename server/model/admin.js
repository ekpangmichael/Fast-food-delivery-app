const date = new Date();

function uid() {
  return Math.random().toString(13).replace('0.', '');
}

class FoodItems {
  //  class constructor
  constructor() {
    this.foodItems = [];
  }

  //  returns orders object

  createFoodItems(data) {
    const newFoodItems = {
      id: uid(),
      foodName: data.foodName || '',
      imgUrl: data.imgUrl || '',
      category: data.category || '',
      quantity: data.quantity || '',
      price: data.price || '',
      OrderDate: date,
      modifiedDate: date,
    };
    this.foodItems.push(newFoodItems);
    return newFoodItems;
  }

  //  returns a particular item

  findOneItem(id) {
    return this.foodItems.find(item => item.id === id);
  }

  //  returns all item


  findAllItems() {
    return this.foodItems;
  }
  //  Update item

  updateItem(id, data) {
    const item = this.findOneItem(id);
    const index = this.foodItems.indexOf(item);
    this.foodItems[index].foodName = data.foodName || item.foodName;
    this.foodItems[index].imgUrl = data.imgUrl || item.imgUrl;
    this.foodItems[index].category = data.category || item.category;
    this.foodItems[index].quantity = data.quantity || item.quantity;
    this.foodItems[index].price = data.price || item.price;
    this.foodItems[index].modifiedDate = date;
    return this.foodItems[index];
  }

  // Delete a particular order

  deleteItem(id) {
    const item = this.findOneItem(id);
    const index = this.foodItems.indexOf(item);
    this.foodItems.splice(index, 1);
    return {};
  }
}

export default new FoodItems();

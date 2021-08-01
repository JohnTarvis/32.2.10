const express = require("express")
const app = express();
app.use(express.json());
const router = express.Router();

global.items = [];

class Item {
  constructor(name, price) {
    this.name = name;
    this.price = price;
    items.push(this);
  }

  static findAll(){
    return items
  }

  static update(name, data) {
    let foundItem = Item.find(name);
    if (foundItem === undefined) {
      throw {message: "not found", status: 404}
    }
    foundItem.name = data.name;
    foundItem.price = data.price;

    return foundItem;
  }

  static find(name) {
    const foundItem = items.find(v => v.name === name);
    if(foundItem === undefined){
      throw { message: "not found", status: 404 }
    }
    return foundItem
  }

  static remove(name) {
    let foundIdx = items.findIndex(v => v.name === name);
    if (foundIdx === -1) {
      throw {message: "not found", status: 404}
    }
    items.splice(foundIdx, 1);
  }
}

router.get('', (req, res, next) => {
    try {
      return res.json({ items: Item.findAll() });
    } catch(err){
      return next(err)
    }
});

router.get('/:name', (req, res, next) => {
    try {
      let foundItem = Item.find(req.params.name);
      return res.json({item:foundItem});
    } catch(err){
      return next(err)
    }
});
  
  
router.post('', (req, res, next) => {
    try {
      let newItem = new Item(req.body.name, req.body.price);
      return res.json({item: newItem});
    } catch (err) {
      return next(err)
    }
});
  
router.patch('/:name', (req, res, next) => {
    try {
      let foundItem = Item.update(req.params.name, req.body);
      return res.json({ item: foundItem });
    } catch (err) {
      return next(err)
    }
});
  
  
router.delete('/:name', (req, res, next) => {
    try {
      Item.remove(req.params.name);
      return res.json({message:'deleted'});
    } catch (err) {
      return next(err)
    }
});

class ExpressError extends Error {
    constructor(message, status) {
      super();
      this.message = message;
      this.status = status;
      console.error(this.stack);
    }
}



app.use(function (req, res, next) {
  return new ExpressError("Not Found", 404);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.json({
    error: err.message,
  });
});

module.exports = app
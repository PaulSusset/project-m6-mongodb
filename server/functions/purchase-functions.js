const items = require('../data/items.json');
const { MongoClient } = require('mongodb');
const assert = require('assert');

// an array that will store all the orders that have been completed
let completedOrders = [];

// ************************************************************************** //
// function that stores a confirmation order and the order details in memory  //
// and sends back the confirmation number with a status 200                   //
// ************************************************************************** //
const confirmPurchase = async (req, res) => {
  const { order } = req.body;
  const { cartItems } = order;
  const random = Math.floor(Math.random() * 1000000);
  const safeOrder = {
    ...order,
    payment: 'Payment Confirmed',
  };

  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db('eComProj');
    const r = await db
      .collection('orders')
      .insertOne({ order: { ...safeOrder, confirmation: random } });
    assert.equal(r.insertedCount, 1);

    await cartItems.forEach(async (cartItem) => {
      const h = await db.collection('items').findOne({ _id: cartItem._id });
      const newTotal = h.numInStock - cartItem.quantity;
      console.log(h);
      const r = await db
        .collection('items')
        .updateOne({ _id: cartItem._id }, { $set: { numInStock: newTotal } });
      assert.equal(r.modifiedCount, 1);
    });

    res
      .status(200)
      .json({
        status: 200,
        order: { ...safeOrder, confirmation: random },
        confirmation: random,
      });
  } catch (err) {
    res.status(404).json({ status: 404, error: err.message });
  }

  //removing the sensitive payment info, replacing with basic confirmation

  //   // changes the number in stock of the item(s) purchased
  //   cartItems.forEach((cartItem) => {
  //     items.forEach((item) => {
  //       if (cartItem.id === item.id) {
  //         item.numInStock = item.numInStock - cartItem.quantity;
  //       }
  //     });
  //   });

  // creating a confirmation number which will be sent back to the user and stored in the server memory

  //   completedOrders.push({ confirmation: random, order: safeOrder });

  //   return { confirmation: random, status: 200 };
};

// ******************************************************************************************************* //
// function that will sort through the history of purchases and return the details of a specified purchase //
// ******************************************************************************************************* //
const orderHistory = async (req, res) => {
  const { confirmation } = req.params;
  console.log(confirmation);

  // will be used to determine the position of the required object in the array
  //   let position;
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db('eComProj');
    const r = await db
      .collection('orders')
      .findOne({ 'order.confirmation': confirmation * 1 }, (err, result) => {
        result
          ? res.status(200).json(result)
          : res
              .status(404)
              .json({ status: 404, data: 'Not found', error: err });
      });
  } catch (err) {
    res.status(404).json({ status: 404, error: err });
  }
  //   completedOrders.forEach((order, index) => {
  //     if (order.confirmation == confirmation) {
  //       position = index;
  //     }
  //   });

  //   return completedOrders[position];
};

module.exports = { confirmPurchase, orderHistory };

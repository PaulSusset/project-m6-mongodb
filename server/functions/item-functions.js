// const items = require('../data/items.json');
const { MongoClient } = require('mongodb');
const assert = require('assert');

// customized sort function (code found at https://www.sitepoint.com/sort-an-array-of-objects-in-javascript)
const sortByStock = (a, b) => {
  const stockA = a.numInStock;
  const stockB = b.numInStock;

  let comparison = 0;

  if (stockB > stockA) {
    comparison = 1;
  } else {
    comparison = -1;
  }

  return comparison;
};

// ****************************************************************** //
// function that will sort the data by category specified by the user //
// ****************************************************************** //
const sortCategory = async (req, res) => {
  //category of items specified in the url
  const { category } = req.params;
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db('eComProj');
    const r = await db
      .collection('items')
      .find({ 'category': category })
      .toArray();
    res.status(201).json(r);
  } catch (err) {
    res
      .status(404)
      .json({ status: 404, error: 'No items found under this category' });
  }
  client.close();
};

// ****************************************************************** //
// function that returns products related to the user's search query  //
// ****************************************************************** //
const getSearchResults = async (req, res) => {
  const { userInput } = req.params;
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db('eComProj');
    const r = await db
      .collection('items')
      .find({
        $text: {
          $search: userInput,
          $caseSensitive: false,
          // $diacriticSensitive: <boolean>
        },
      })
      .toArray();
    res.status(201).json(r);
  } catch (err) {
    res.status(404).json({
      status: 404,
      error: 'No items found with this query',
      err: err.message,
    });
  }
  client.close();
  // filters the items based on the user's input
  //   let getSearchResults = items.filter((item) => {
  //     if (item.name.toLowerCase().includes(userInput.toLowerCase())) {
  //       return item;
  //     }
  //   });

  // if the user has searched for a specific category, returns all items in the related category, priority goes to the names above
  //   items.filter((item) => {
  //     if (item.category.toLowerCase().includes(userInput.toLowerCase())) {
  //       getSearchResults.push(item);
  //     }
  //   });
};

// ********************************************** //
// returns the information of the specified item  //
// ********************************************** //
const getItemInformation = async (req, res) => {
  const { itemId } = req.params;

  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db('eComProj');
    const r = await db.collection('items').findOne({ '_id': itemId * 1 });
    res.status(201).json(r);
  } catch (err) {
    res.status(404).json({
      status: 404,
      error: 'No item found with this ID',
      error: err.message,
    });
  }
  client.close();
};

// *********************************** //
// returns the categories in an array  //
// *********************************** //
const getCategories = async (req, res) => {
  let types = [];

  unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db('eComProj');
    const r = await db.collection('items').find({}).toArray();

    const makeTypes = () => {
      r.forEach((item) => {
        types.push(item.category);
      });
    };
    makeTypes();

    res.status(201).json(types.filter(unique));
  } catch (err) {
    res.status(500).json({ status: 500, error: 'Something went wrong' });
  }
  client.close();
  //   const makeTypes = () => {
  //     items.forEach((item) => {
  //       types.push(item.category);
  //     });
  //   };

  //   makeTypes();

  //   return types.filter(unique);
};

// ******************************************************************************************************* //
// returns an array of the 3 items on special sorted by highest stock and 3 random items as featured items //
// ******************************************************************************************************* //
const getHomepage = async (req, res) => {
  // constant of how many items we want displayed
  const NUM_OF_ITEMS = 3;

  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db('eComProj');
    const r = await db.collection('items').find({}).toArray();
    r.sort(sortByStock);

    let itemsOnSale = [];
    let featuredItems = [];
    for (let i = 0; i < NUM_OF_ITEMS; ++i) {
      featuredItems.push(r[Math.floor(Math.random() * r.length)]);
      itemsOnSale.push(r[i]);
    }
    res.status(201).json({ sale: itemsOnSale, feature: featuredItems });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, error: 'Something went wrong', err: err.message });
  }
  client.close();
  // cloning the items file so as to not change the order
  //   const sortedItems = [...items];

  //   sortedItems.sort(sortByStock);

  // the arrays that are used to select the items displayed on the homepage

  // sets random items in the featuredItems array | sets the 3 first items with the highest stock in the itemsOnSale array
  //   for (let i = 0; i < NUM_OF_ITEMS; ++i) {
  //     featuredItems.push(items[Math.floor(Math.random() * items.length)]);
  //     itemsOnSale.push(sortedItems[i]);
  //   }

  //   return { sale: itemsOnSale, feature: featuredItems };
};

module.exports = {
  getHomepage,
  sortCategory,
  getCategories,
  getItemInformation,
  getSearchResults,
};

const router = require('express').Router();

const {
  getHomepage,
  sortCategory,
  getCategories,
  getItemInformation,
  getSearchResults,
} = require('../functions/item-functions');

// the endpoint for the home page of the app
router.get('/homepage', getHomepage);

// the endpoint for sorting by category
router.get('/products/:category', sortCategory);

// the endpoint who's only purpose is to return an array of all the available categories
router.get('/list/categories', getCategories);

// the endpoint for returning a specific item's information
router.get('/item/:itemId', getItemInformation);

// the endpoint for sorting by user's search query
router.get('/products/search/:userInput', getSearchResults);

module.exports = router;

const router = require('express').Router();

const {
  getCompanyProducts,
  getCompanyName,
} = require('../functions/company-functions');

// the endpoint for sorting by company Id
router.get('/products/sort/:companyId', getCompanyProducts);

// the endpoint for returning the company's name based on it's ID
router.get('/companyName/:companyId', getCompanyName);

module.exports = router;

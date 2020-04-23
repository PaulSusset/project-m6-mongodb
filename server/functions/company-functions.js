const items = require('../data/items.json');
const companies = require('../data/companies.json');
const { MongoClient } = require('mongodb');
const assert = require('assert');

// ********************************************************* //
// function that returns the products filtered by company ID //
// ********************************************************* //
const getCompanyProducts = async (req, res) => {
  const { companyId } = req.params;
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db('eComProj');
    const r = await db
      .collection('items')
      .find({ 'companyId': companyId * 1 })
      .toArray();
    res.status(201).json(r);
  } catch (err) {
    res
      .status(404)
      .json({ status: 404, error: 'No items found under this companyID' });
  }
  client.close();
  // filters through the items to find those released by that specific company
  // let filteredProducts = items.filter((item) => {
  //     if (item.companyId == companyId) {
  //         return item;
  //     }
  // });

  // return filteredProducts;
};

// ********************************************************* //
// function that returns the company's name based on its ID  //
// ********************************************************* //
const getCompanyName = async (req, res) => {
  const { companyId } = req.params;
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db('eComProj');
    const r = await db
      .collection('companies')
      .find({ '_id': companyId * 1 })
      .toArray();
    res.status(201).json({ companyName: r[0].name });
  } catch (err) {
    res
      .status(404)
      .json({ status: 404, error: 'No name found under this companyID' });
  }
  client.close();
  //   let companyName;

  //   companies.forEach((company) => {
  //     if (company.id == companyId) {
  //       companyName = company.name;
  //     }
  //   });

  //   return { companyName: companyName };
};

module.exports = {
  getCompanyProducts,
  getCompanyName,
};

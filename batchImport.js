const fs = require('file-system');
const { MongoClient } = require('mongodb');
const assert = require('assert');

const companies = require('./server/data/companies.json');
const items = require('./server/data/items.json');

const batchImport = async () => {
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db('eComProj');
    const r = await db.collection('companies').insertMany(companies);
    assert.equal(companies.length, r.insertedCount);
    console.log(201);
    const r2 = await db.collection('items').insertMany(items);
    assert.equal(items.length, r2.insertedCount);
  } catch (err) {
    console.log(err);
  }
  client.close();
};
batchImport();

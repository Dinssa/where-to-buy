const express = require('express');
const router = express.Router();

const listingsCtrl = require('../controllers/listings');

router.get('/', listingsCtrl.index); // GET /listings

router.get('/new', listingsCtrl.new); // GET /listings/new

router.get('/:id', listingsCtrl.show); // GET /listings/:id

router.post('/', listingsCtrl.create); // POST /listings

module.exports = router;
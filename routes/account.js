const express = require('express');
const router = express.Router();

const accountCtrl = require('../controllers/account');

router.get('/', accountCtrl.index); // GET /account

router.get('/bookmarks', accountCtrl.bookmarks); // GET /account/bookmarks

router.get('/listings', accountCtrl.listings); // GET /account/listings

router.get('/reviews', accountCtrl.reviews); // GET /account/reviews

module.exports = router;
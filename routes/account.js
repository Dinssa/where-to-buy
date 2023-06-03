const express = require('express');
const router = express.Router();

const accountCtrl = require('../controllers/account');

router.get('/', requireLogin, accountCtrl.index); // GET /account

router.get('/bookmarks', requireLogin, accountCtrl.bookmarks); // GET /account/bookmarks

router.get('/listings', requireLogin, accountCtrl.listings); // GET /account/listings

router.get('/reviews', requireLogin, accountCtrl.reviews); // GET /account/reviews

module.exports = router;

function requireLogin(req, res, next) {
    if (!req.user) {
      res.redirect('/login?r=1');
    } else {
      next();
    }
}
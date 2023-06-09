const express = require('express');
const router = express.Router();

const listingsCtrl = require('../controllers/listings');

router.get('/', listingsCtrl.index); // GET /listings

router.get('/new', requireLogin, listingsCtrl.new); // GET /listings/new

router.get('/:id', listingsCtrl.show); // GET /listings/:id

router.post('/', requireLogin, listingsCtrl.create); // POST /listings

router.get('/edit/:id', listingsCtrl.edit); // GET /listings/edit/:id

router.put('/:id', listingsCtrl.update); // PUT /listings/:id

module.exports = router;

function requireLogin(req, res, next) {
    if (!req.user) {
      res.redirect('/login?r=2');
    } else {
      next();
    }
}
const Listing = require('../models/listing');

module.exports = {
    index,
    show,
    new: newListing,
    create
};

async function index(req, res) {
    const listings = await Listing.find({});
    res.render('listings/index', {
        title: 'Listings',
        listings
    });
}

async function show(req, res) {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/show', {
        title: 'Listing',
        listing
    });
}

function newListing(req, res) {
    res.render('listings/new', {
        title: 'Add Listing',
        errorMessages: []
    });
}

async function create(req, res) {
    const listing = new Listing(req.body);
    try {
        await listing.save();
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.log(err);
        res.redirect('/listings/new');
    }
}
const Listing = require('../models/listing');
const Review = require('../models/review');
const { Client } = require("@googlemaps/google-maps-services-js");

const mapsClient = new Client({}); 

module.exports = {
    index,
    show,
    new: newListing,
    create
};

async function index(req, res) {
    const allListings = await Listing.find({});
    const allReviews = await Review.find({});
    const searchQuery = req.query.search;
    const searchGeo = await geocodeAddress(searchQuery);
    let listings = [];

    // console.log(searchGeo);

    
    listings = allListings;

    if (!searchGeo) {
        res.render('index', {
            title: 'Home',
            errorMessages: ['Invalid search location']
        });
    } else {
        res.render('listings/index', {
            title: 'Listings',
            listings,
            searchQuery,
            searchGeo
        });
    }
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

async function geocodeAddress(address){
    try {
        const response = await mapsClient.geocode({
            params: {
                address: address,
                region: 'uk',
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
    } catch (err) {
        console.log(err);
    }
}
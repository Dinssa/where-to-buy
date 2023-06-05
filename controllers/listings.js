const Listing = require('../models/listing');
const Review = require('../models/review');
const Location = require('../models/location');
const { Client } = require("@googlemaps/google-maps-services-js");

const mapsClient = new Client({}); 

module.exports = {
    index,
    show,
    new: newListing,
    create
};

async function index(req, res) {
    let listings = await Listing.find({});
    const reviews = await Review.find({});
    const locations = await Location.find({});

    const searchQuery = req.query.search;
    const sortBy = req.query['sort-by'];

    listings = addReviewData(listings, reviews);

    if (searchQuery == '' || !searchQuery) {
        res.render('listings/index', {
            title: 'Listings',
            listings,
            searchQuery,
            sortBy
        });
        return;
    }

    const searchGeo = await geocodeAddress(searchQuery);

    if (!searchGeo){
        res.render('index', {
            title: 'Home',
            errorMessages: ['Invalid search location']
        });
        return;
    }

    listings = calcDistance(listings, locations, searchGeo);
    listings = sortListings(listings, sortBy);

    res.render('listings/index', {
        title: 'Listings',
        listings,
        searchQuery,
        sortBy        
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

function sortListings(listings, sortBy) {
    switch (sortBy) {
        case 'distance':
            return listings.sort((a, b) => a.distance - b.distance);
        case 'ratings':
            return listings.sort((a, b) => b.rating - a.rating);
        case 'best-match':
            return listings // TODO: Implement best match sorting
        default:
            return listings.sort((a, b) => a.distance - b.distance);
    }
}

function addReviewData(listings, reviews) {
    listings.forEach((listing) => {
        const listingReviews = reviews.filter(review => review.listingId == listing.id);
        const listingRating = listingReviews.reduce((acc, review) => acc + review.rating, 0) / listingReviews.length;
        listing.rating = (!!listingRating) ? listingRating.toFixed(1) : 'No reviews yet';
        listing.numReviews = listingReviews.length;
        listing.stars = Math.round(listingRating * 2) / 2;
    });
    return listings;
}

function calcDistance(listings, locations, searchGeo) {
    listings.forEach((listing) => {
        const listingLocation = locations.find(location => location.listingId == listing.id);

        // * Haversine Forumla (calculate the distance between two points on Earth): https://en.wikipedia.org/wiki/Haversine_formula
        const R = 6371e3; // Earth's radius in meters
        const φ1 = listingLocation.latitude * Math.PI/180; // Convert latitude to radians
        const φ2 = searchGeo.lat * Math.PI/180; // Convert latitude to radians
        const Δφ = (searchGeo.lat - listingLocation.latitude) * Math.PI/180; // Convert latitude difference to radians
        const Δλ = (searchGeo.lng - listingLocation.longitude) * Math.PI/180; // Convert longitude difference to radians

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        listing.distance = ((R * c)/1000).toFixed(1);
    });
    return listings;
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
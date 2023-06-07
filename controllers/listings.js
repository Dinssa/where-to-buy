const Listing = require('../models/listing');
const Review = require('../models/review');
const Location = require('../models/location');
const User = require('../models/user');
const { Client } = require("@googlemaps/google-maps-services-js");

const mapsClient = new Client({}); 

module.exports = {
    index,
    show,
    new: newListing,
    create,
    edit: editListing,
    update: updateListing
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
    let listing = await Listing.findById(req.params.id);
    let isBookmarked = null;
    if (res.locals.user) {
        isBookmarked = res.locals.user.bookmarks.includes(listing.id);
    }
    const reviews = await Review.find({ listingId: req.params.id });
    const users = await User.find({});
    listing = addReviewData([listing], reviews, users);
    res.render('listings/show', {
        title: listing[0].title,
        listing: listing[0],
        reviews,
        isBookmarked
    });
}

function newListing(req, res) {
    res.render('listings/new', {
        title: 'Contribute',
        errorMessages: []
    });
}

async function editListing(req, res) {
    try {
        const listing = await Listing.findById(req.params.id);

        // Check if the user owns the listing
        if (listing.userId.toString() !== res.locals.user.id){
            return res.redirect('/account/listings');
        }

        res.render('listings/edit', {
            title: 'Edit Listing',
            listing
        });
    } catch (err) {
        res.redirect('/'); // 404
    }
}

async function updateListing(req, res) {
    try {
        const listing = await Listing.findById(req.params.id);

        // Check if the user owns the listing
        if (listing.userId.toString() !== res.locals.user.id){
            return res.redirect('/account/listings');
        }

        listing.title = req.body.title;
        listing.subtitle = req.body.subtitle;
        listing.description = req.body.description;
        listing.phoneNumber = req.body.phoneNumber;
        await listing.save();
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        res.redirect('/'); // 404
    }
}

async function create(req, res) {
    const products = [];
    const operationHours = [];

    for (let i = 1; i <= req.body.productCount; i++) {
        products.push({ 
            name : req.body[`productName${i}`], 
            weight : req.body[`productWeight${i}`], 
            price : req.body[`productPrice${i}`] 
        });   
    }
    
    const listing = new Listing({
        userId: req.body.userId,
        title: req.body.title,
        subtitle: req.body.subtitle,
        description: req.body.description,
        phoneNumber: req.body.phoneNumber,
    });
    
    const listingLocation = await geocodeAddress(listing.address) || { lat: 51.5048, lng: -0.1235 }; // Default to Trafalgar Square if address is invalid

    const location = new Location({ listingId: listing._id, address: listing.address, latitude: listingLocation.lat, longitude: listingLocation.lng });
    await location.save();

    try {
        await listing.save();
        await location.save();
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
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

function addReviewData(listings, reviews, users = null) {
    listings.forEach((listing) => {
        const listingReviews = reviews.filter(review => review.listingId == listing.id);
        if (users) {
            listingReviews.forEach((review) => {
                const reviewAuthor = users.find(user => user._id === review.userId);
            });
        }
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
        return null;
    }
}
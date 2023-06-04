const User = require('../models/user');
const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports = {
    index,
    bookmarks,
    listings,
    reviews
}

function index(req, res) {
    res.render('account/index', {
        title: 'Profile'
    });
}

async function bookmarks(req, res) {
    try {
        const user = await User.findById(res.locals.user.id);
        const bookmarks = await Listing.find({ _id: { $in: user.bookmarks } });
        res.render('account/bookmarks', {
            title: 'Bookmarks',
            bookmarks
        });
    } catch (err) {
        console.log(err);
        res.redirect('/account');
    }
}

async function listings(req, res) {
    try {
        const listings = await Listing.find({ userId: res.locals.user.id });
        const reviews = await Review.find({});
        listings.forEach((listing) => {
            const listingReviews = reviews.filter(review => review.listingId == listing.id);    
            const listingRating = listingReviews.reduce((acc, review) => acc + review.rating, 0) / listingReviews.length;
            listing.rating = (!!listingRating) ? listingRating.toFixed(1) : 'No reviews yet';
            listing.numReviews = listingReviews.length;
            listing.stars = Math.round(listingRating * 2) / 2;
        });
        res.render('account/listings', {
            title: 'Listings',
            listings
        });
    } catch (err) {
        console.log(err);
        res.redirect('/account');
    }
}

async function reviews(req, res) {
    try {
        const reviews = await Review.find({ userId: res.locals.user.id });
        console.log(res.locals.user.id);
        console.log(reviews);
        res.render('account/reviews', {
            title: 'Reviews',
            reviews
        });
    } catch (err) {
        console.log(err);
        res.redirect('/account');
    }
}


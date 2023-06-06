const User = require('../models/user');
const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports = {
    index,
    bookmarks,
    listings,
    reviews,
    deleteListing,
    deleteReview
}

function index(req, res) {
    res.render('account/index', {
        title: 'Profile'
    });
}

async function bookmarks(req, res) {
    try {
        const user = await User.findById(res.locals.user.id);
        const listings = await Listing.find({ _id: { $in: user.bookmarks } });
        const reviews = await Review.find({});
        listings.forEach((listing) => {
            const listingReviews = reviews.filter(review => review.listingId == listing.id);    
            const listingRating = listingReviews.reduce((acc, review) => acc + review.rating, 0) / listingReviews.length;
            listing.rating = (!!listingRating) ? listingRating.toFixed(1) : 'No reviews yet';
            listing.numReviews = listingReviews.length;
            listing.stars = Math.round(listingRating * 2) / 2;
        });
        res.render('account/bookmarks', {
            title: 'Bookmarks',
            listings
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
            title: 'My Listings',
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
        const listings = await Listing.find({});
        reviews.forEach((review) => {
            const listing = listings.find(listing => listing.id == review.listingId);
            review.listingTitle = listing.title;
        });
        res.render('account/reviews', {
            title: 'Reviews',
            reviews
        });
    } catch (err) {
        console.log(err);
        res.redirect('/account');
    }
}

async function deleteListing(req, res) {

    // Check if the user owns the listing
    const listing = await Listing.findById(req.params.id);
    if (listing.userId.toString() !== res.locals.user.id){
        return res.redirect('/account/listings');
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.redirect(`/${req.body.returnTo}`);
    } catch (err) {
        console.log(err);
        res.redirect('/listings');
    }
}

async function deleteReview(req, res) {

    // Check if the user owns the review
    const review = await Review.findById(req.params.id);
    if (review.userId.toString() !== res.locals.user.id){
        return res.redirect('/account/reviews');
    }

    try {
        await Review.findByIdAndDelete(req.params.id);
        res.redirect(`/${req.body.returnTo}`);
    } catch (err) {
        console.log(err);
        res.redirect('/listings');
    }
}

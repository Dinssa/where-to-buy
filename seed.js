// Description: Populates the database with seed data, including users, listings and reviews
// How to use: Run `node seed.js <numOfUsers>` in the terminal
// Why build this? To populate the database with seed data to ease development and testing

// Number of users, listings and reviews to create
const numOfUsers = process.argv[2] ? parseInt(process.argv[2]) : 20; // Accepts a command line argument for the number of users to create (default 20)
const numOfListings = Math.round (numOfUsers * (1 + 50/100)); // Number of listings is 50% more than the number of users
const numOfReviews = Math.round (numOfListings * (1 + 150/100)); // Number of reviews is 150% more than the number of listings

require('dotenv').config(); // Loads environment variables from a .env file into process.env
require('./config/database'); // Connects to the database

const { faker } = require('@faker-js/faker'); // Faker.js for generating fake data
const { Client } = require("@googlemaps/google-maps-services-js"); // Google Maps API

// Models to seed
const User = require('./models/user');
const Listing = require('./models/listing');
const Review = require('./models/review');
const Location = require('./models/location');

// Main function, runs when the file is executed
(async function() {
    try {
        // Delete existing data
        await User.deleteMany({});
        await Listing.deleteMany({});
        await Review.deleteMany({});
        await Location.deleteMany({});

        // Create new data
        await createUsers();
        await createListings();
        await createLocations();
        await createReviews();        
        await createBookmarks();

        console.log('Seed data populated!');
        process.exit();
    } catch (err) {
        console.log(err);
    }
})();

// Create users
async function createUsers(){
    const users = await User.create([...Array(numOfUsers)].map(() => {
        const sex = faker.person.sex();
        const firstName = faker.person.firstName(sex);
        const lastName = faker.person.lastName();
        const name = `${firstName} ${lastName}`
        const email = faker.internet.email({firstName, lastName});
        const avatar = faker.image.urlLoremFlickr({ category: 'animals' });
        const password = '12345';
        return { name, email, password, avatar };
    }));

    console.log(`${users.length} users created`);
}

// Create listings
async function createListings(){
    const users = await User.find({});

    const listings = await Listing.create([...Array(numOfListings)].map(() => {
        const user = users[Math.floor(Math.random() * users.length)];
        const userId = user._id;
        const title = faker.company.name();
        const subtitle = faker.company.catchPhrase();
        const description = faker.lorem.paragraph(3)
        const phoneNumber = faker.phone.number('07# #### ####')

        // Create random operation hours
        const operationHours = [];
        for (let i = 0; i < 7; i++) {
        const open = Math.random() < 0.8; // 80% chance of being open
        const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
            if (open) {
                const openHour = Math.floor(Math.random() * 12) + 6;
                const openMinute = Math.random() < 0.5 ? '00' : '30'; // 50% chance of being on the hour or half hour
                const closeHour = openHour + Math.floor(Math.random() * 6) + 6;
                const closeMinute = Math.random() < 0.5 ? '00' : '30';
                const openTime = `${openHour.toString().padStart(2, '0')}:${openMinute}`; // padStart() adds a leading 0 if the string is only 1 character long
                const closeTime = `${closeHour.toString().padStart(2, '0')}:${closeMinute}`;
                operationHours.push({ day, hours: `${openTime} - ${closeTime}` });
            } else {
                operationHours.push({ day, hours: 'Closed' });
            }
        }

        // Create random products
        const products = [...Array(Math.floor(Math.random() * 3) + 1)].map(() => ({
            name: faker.commerce.product(),
            price: faker.commerce.price({ min: 100, max: 200, dec: 0, symbol: '£' }),
            size: `${Math.floor(Math.random() * (1000 - 50 + 1) / 50) * 50 + 50} g` // 50g increments between 50g and 1000g
        }));

        return { userId, title, subtitle, description, phoneNumber, operationHours, products };
    }));

    console.log(`${listings.length} listings created`);
}

// Insert locations to each listing
async function createLocations(){
    const listings = await Listing.find({});
    const locations = [];
    const mapsClient = new Client({});

    for (const listing of listings) {
        let address;
        let postcode;
        let gpsCoordinates;
        do {
            gpsCoordinates = faker.location.nearbyGPSCoordinate({ origin: [51.5048, -0.1235], radius: 12, isMetric: true }) // Origin is Trafalgar Square, London
        
            const response = await mapsClient.reverseGeocode({
                params: {
                    latlng: [gpsCoordinates[0], gpsCoordinates[1]],
                    key: process.env.GOOGLE_MAPS_API_KEY,
                    result_type: 'street_address',
                }
            });

            for (const result of response.data.results) {
                if (result.formatted_address && result.address_components) {
                    const addressComponent = result.address_components.find(component => component.types.includes('postal_code'));
                    if (addressComponent) {
                        address = result.formatted_address;
                        postcode = addressComponent.long_name;
                    }
                }
            }
        } while (!(!!address && !!postcode)); // Keep looping until we get a valid address and postcode
        locations.push({ listingId: listing._id, address, postcode, latitude: gpsCoordinates[0], longitude: gpsCoordinates[1] });
    }

    await Location.create(locations);
    console.log(`${locations.length} locations created`);
}

// Create reviews
async function createReviews(){
    const users = await User.find({});
    const listings = await Listing.find({});

    const reviews = await Review.create([...Array(numOfReviews)].map(() => {
        const user = users[Math.floor(Math.random() * users.length)];
        const userId = user._id;
        
        const listing = listings[Math.floor(Math.random() * listings.length)];
        const listingId = listing._id;

        const comment = faker.lorem.sentence(9);
        const rating = Math.floor(Math.random() * 5) + 1;

        const helpedUsersIds = [...Array(Math.floor(Math.random() * 5) + 1)].map(() => {
            let randomUserId;
            do {
                randomUserId = users[Math.floor(Math.random() * users.length)]._id;
            } while (randomUserId.equals(user._id)); // Make sure the user isn't marking their own review as helpful
            return randomUserId;
        });

        return { userId, listingId, comment, rating, helpedUsersIds };
    }));

    console.log(`${reviews.length} reviews created`);
}

// Insert 1-4 bookmarks for each user
async function createBookmarks(){
    const users = await User.find({});
    const listings = await Listing.find({});

    for (const user of users) {
        const numBookmarks = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < numBookmarks; i++) {
            const listing = listings[Math.floor(Math.random() * listings.length)];
            user.bookmarks.push(listing);
        }
        await user.save();
    }

    console.log(`Bookmarks added to users`);
}
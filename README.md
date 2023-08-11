# Where To Buy
Where To Buy is a niche listings website that helps users find and share local stores that sell specific products. Unlike general listings websites like eBay or gumtree, Where To Buy focuses on one product category and one product with some variations (e.g. size). For example, if you are looking for a rare snack that is not available in supermarkets, but only in some convenience stores, you can use Where To Buy to see where other users have found it and post your own discoveries.

## This Repository
This ‘Where-To-Buy’ repository is my execution of building a dynamic website with a MongoDB database. I built this website as my second of four projects for the Software Engineering Immersive course from [General Assembly](https://generalassemb.ly/). This game was created in five days as a solo project, fulfilling the basic requirements.

This website…
- Follows the MVC (Model, View, Controller) design pattern, guiding the structure and organisation of its code.
- Leverages the power of ejs, a templating language that lets you embed JavaScript code into HTML.
- It uses express, a minimalist web framework for Node.js, to handle routing and middleware. 
- Users can sign in with Google (OAuth provider) or local accounts, thanks to Passport.js, a flexible and modular authentication middleware for Node.js. 
- All data, including listings, reviews, user accounts and user sessions are in MongoDB, a NoSQL and flexible document database. 
- Appearance is enhanced by Bootstrap SASS with a few customised variables.

# Live Peview
<p align="center">
Check out this site deployed on <a href="https://fly.io/">Fly.io</a>
<br>
  <a href="https://where-to-buy.fly.dev/" target="_blank"><strong>https://where-to-buy.fly.dev/</strong></a>
</p>

# Getting Started
## Prerequisites
- Node.js: This project is built using JavaScript and Node.js. You can download and install Node.js from the official website: https://nodejs.org/en/download/
- MongoDB: This project uses MongoDB as its database, so you’ll either need it installed and running locally on your machine or online on a service like MongoDB Atlas. You’ll need 2 databases, one for the site's data including listings and users and a second to store current user sessions.
- Google API credentials: This project uses Google OAuth and Google Maps APIs, so you will need to obtain API credentials from the Google Cloud Console.

## Installation
1. Clone the project repository: `git clone https://github.com/Dinssa/where-to-buy.git`
2. Open a terminal or command prompt and inside the project directory run the command `npm install` to install project dependencies
3. Create a .env file in the project root directory and add the following environment variables:
```
SECRET=<your_session_secret>  
GOOGLE_CLIENT_ID=<your_google_client_id>  
GOOGLE_CLIENT_SECRET=<your_google_client_secret>  
GOOGLE_CALLBACK_URL=http://localhost:3000/oauth2callback  
GOOGLE_MAPS_API_KEY=<your_google_maps_api_key>  
DATABASE_URL=<your_mongodb_url>  
SESSION_DATABASE_URL=<your_mongodb_sessiondb_url>
```
You can obtain the Google OAuth client ID and client secret by creating a new project in the Google Cloud Console and enabling the People API. You’d also need to enable Google Maps Platform, specifically the Geocoding API in the same project.

4. Run the command `npm start` to start the application
5. Open a web browser and navigate to http\:\/\/localhost:3000 to view the application

# Brief
General Project Requirements:
- Have at least 2 data entities (data resources) in addition to the User Model - one entity that represents the main functional idea for your app and another with a One:Many or Many:Many relationship with that main entity (embedded or referenced).
- Use OAuth authentication.
- Implement basic authorization that restricts access to features that need a logged in user in order to work (typically CUD data operations) by "protecting" those routes from anonymous users using the ensureLoggedIn middleware from the OAuth lesson. In addition, ensure that editing and deletion of a data resource can only be done by the user that created that data (this is done in the controller - refer to the Guide to User-Centric CRUD).
- Have full-CRUD data operations somewhere within the app's features. For example, you can have functionality that Creates & Updates a post and satisfies Delete functionality by implementing the ability to delete comments.
- Be styled such that the app looks and feels similar to apps we use on a daily basis - in other words, it should have a consistent and polished user interface.
- Be deployed online (Heroku).

Optionally:
- Consume a third-party API. If you choose to implement this option, it's likely that the data from the API will be a key data resource in your app, therefore it's important to consider how to implement whatever CRUD data operations will apply. For example, how will data from the API find its way into your database? Be sure to discuss with an instructor when planning your app's features.
- Expose its own API where it returns data resources as JSON.

# Planning
## Entity Relationship Diagram
[![ERD](https://onedrive.live.com/embed?resid=3AAE4294F4C93984%216545&authkey=%21AM-Q_gGxmuZNZn4&width=900)](#)

The ERD consists of 4 main models:
- User
- Listing
- Location
- Review

## Mockups
[![Home](https://onedrive.live.com/embed?resid=3AAE4294F4C93984%216546&authkey=%21AIEEcl0eneNRV3g&width=900)](#)
The home page features a prominent search box where users can type in their desired location or use their current location (with their permission) to find nearby stores.

[![Home, logged in](https://onedrive.live.com/embed?resid=3AAE4294F4C93984%216547&authkey=%21ACpU15OJ66Fznrs&width=900)](#)
By logging in, the user can access a few personalised views where they can manage their own listings and reviews (edit or delete them as needed). They can also update their account details, such as their profile image, username and login settings.

[![Search results](https://onedrive.live.com/embed?resid=3AAE4294F4C93984%216548&authkey=%21ABNCrC1qJt_Vn6U&width=900)](#)
This view shows the search results in a clear and concise way. Users can still modify their query in the search box at the top or use the filter menu on the side to narrow down the results. The main list displays the essential details from the listings: title, subtitle, product titles, average rating and distance from the search location.

[![Single listing page](https://onedrive.live.com/embed?resid=3AAE4294F4C93984%216551&authkey=%21AGBrFovx82gaZJA&width=900)](#)
This view shows a single listing page with all the important information.  It’s quite packed but there was plenty of whitespace once I began building it in HTML. The listing includes the following elements: title, subtitle, product list, description, contact details and reviews. A nice stretch goal was to implement the map view to the left. Users can report listings that are outdated or inappropriate with the “report” button. Each listing also has a verified status that indicates the owner of the listing has confirmed their ownership of the store through a manual process.

The following views are part of a single page, where users can switch between each tab using “Next” and “Back” buttons. With any good multi step form that I’ve ever used there has always been a progres bar and I’ve included one below to show the completion status. The goal of these pages is to make the form less daunting and more manageable by dividing it into small sections, with some extra information at the bottom to guide the user through each step.

[![New listing page start](https://onedrive.live.com/embed?resid=3AAE4294F4C93984%216549&authkey=%21AOmu9Q4REjizXXs&width=900)](#)
A simple Yes or No question to start with. This is the first step, prior to verification, to mark a listing as owned by a user.

[![New listing page to add a location](https://onedrive.live.com/embed?resid=3AAE4294F4C93984%216550&authkey=%21AD5MMN2iNGz0mA0&width=900)](#)
The site asks the user to enter the location of the store.

[![New listing page for details](https://onedrive.live.com/embed?resid=3AAE4294F4C93984%216552&authkey=%21AN2t3zcRWwxd6D0&width=900)](#)
Each listing needs a few details to be filled in, so the rest of the form pages look similar to this mockup with a scrollable area and multiple input boxes. The site collects details for the listing location (store name, subtitle and description); product details (one or more variations); contact details and operating hours.

# Build Process
## First Steps
To build this website, I used Node.js as the backend framework and Express Generator to create the basic structure of the app, which includes the routes, views and middleware. I installed ‘dotenv’ as a dependency to store sensitive information such as Google OAuth API key, Google Maps API key and MongoDB database URL in a .env file, which is not tracked by git. I used session middleware to handle user authentication and store user data in cookies. After setting up these core features, I was ready to start building the first functionality of logging in.

## Setup User Accounts
Before building the views, it was important to set up the login and logout functionality. Most views will require either knowing if someone is logged in or not and/or the logged in user’s account details. 

To set up user accounts, I had to do the following steps:
- Update the default user model that Express generator created for me. I added fields for Google ID, name and profile image (avatar).
- Add Passport and Google Strategy as dependencies. Passport is a middleware that handles user authentication and authorization. Google strategy is a plugin that allows users to log in with their Google account.
- Add routes for authentication. I created two routes: one for redirecting users to Google’s consent screen, and one for handling the callback from Google after the user grants permission.
- Make the user object available to the view engine. I used res.locals to store the user object in every request, so that I can access it in the views and display the user’s information.
- Add OAuth login and logout buttons to the nav partial. I added two buttons in the navigation bar: one for logging in with Google, and one for logging out. I used conditional rendering to show or hide the buttons depending on whether the user is logged in or not.

Later on, after developing the seed data (described in the next section), I decided to add a login page for users who don’t want to use their Google account. To do this, I modified the user schema to allow local accounts with email and password fields. I also added passport local strategy as a dependency and configured it to handle user authentication and authorisation with email and password. I created a login page with a form for users to enter their email and password and a route for validating their credentials.

## Seed Data
I felt it was beneficial to create seed data to help during the build process as I’d be able to see how the UI of each view would look before I added the CRUD functionality that lets users create, read, update and delete data. I could also log in as different users and navigate the site from their perspective and develop a user-friendly interface. I used faker.js, which is a library that generates fake data for various purposes, such as names, addresses, phone numbers, etc. I wrote a script that uses faker.js to make realistic user and listing data and put them in my mongoDB database. The script creates hundreds of users and listings with different attributes and variations. Each user also has some bookmarks and reviews they’ve left which can be viewed, edited or deleted. This way, I could see how the data would look like in the UI of each view, such as the home page, the search results page, the listing page and each user’s account pages.

## Code snippets
Most views have a similar structure. They have header, navigation bar and footer EJS partials. The header includes the name of the application, page title and references to stylesheets. The navigation includes a prominent link to “Contribute” (create a new listing), a persistent logo that can be clicked to return to the home page and a section rendered conditionally to show or hide a bookmarks button and user account details with child pages depending on whether the user is logged in or not.

```ejs
<%- include('./partials/header') %>
<%- include('./partials/nav') %>

<div class="search d-flex align-items-center justify-content-center">
    <section class="main-search d-flex flex-column justify-content-center">
        <div class="text-center mb-4">
            <h1 class="pb-1">Find you local listing</h1>
            <h4>Search for local stores and find out what others think</h4>
        </div>
        <div class="d-flex justify-content-center align-items-center mb-4">
            <form class="flex-grow-1" action="/listings" method="GET">
                <span class="input-group searchbar">
                    <input type="text" name="search" class="form-control" style="min-width: 200px;" placeholder="e.g. 'Acton', 'SW3' 'SW1 4IJ', 'Downing Street' ">
                    <button type="submit" class="btn btn-secondary"><i class="bi bi-search"></i></button>
                </span>
            </form>
            <button class="btn btn-secondary font-btn ms-4"><i class="bi bi-geo-alt-fill"></i> Use my location</button>
        </div>
        <div class="text-center">
            <h5 class="mb-3">or</h5>
            <a href="/listings" class="col-auto btn btn-secondary font-btn"><i class="bi bi-list-ul"></i> Browse all listings</a>
        </div>
        <div class="mt-4">
            <% if (errorMessages.length != 0) { %>
                <div class="alert alert-warning" role="alert" aria-live="assertive">
                    <% errorMessages.forEach(function (error) { %>
                        <i class="bi bi-exclamation-triangle-fill"></i> &nbsp;
                        <%= error %>
                    <% }) %>
                </div>
            <% } %>
        </div>
    </section>
</div>    

<%- include('./partials/footer') %>
```

Above is the home page of my application and it contains a search form that allows users to search for local stores or browse all listings. It takes prominence as the main section of the page and the form includes a text input field where users can enter their search query, and a submit button that triggers a GET request to the /listings route. Below the search form, the page includes a link that allows users to browse all listings using the same route but this time without any search query. If there are any error messages and a user is redirected back to this screen it’ll be shown with an alert at the bottom of the page, included using EJS conditionals.

You’ll probably notice a heavy usage of Bootstrap CSS throughout, I started this project using it only lightly for some styling but later chose to refactor most pages into primarily using Bootstrap. I found it useful in keeping each page consistent and responsive. Bootstrap's grid system is being used to create a responsive layout for the main section of the page. With a flexbox container as its parent the main-search section is being centred horizontally and vertically. The input-group class was really useful here and elsewhere to create text inputs with additional elements attached, in this case a search button. The use of Bootstrap CSS has created a user-friendly layout with styling classes e.g. button and alert, that help create a consistent and visually appealing design.

The following function is found within the listings controller and returns a full page of search results following the home page.

```javascript
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
```

Index() is an asynchronous function that handles the GET request to the /listings route. It retrieves all listings, reviews and locations from the database using Mongoose’s find method and await keyword to wait for the results. It also retrieves the search query and sort by option from the request query. 

Regardless of if there is a search query or not, each listing needs review data so the addReviewData function is called with the listings and reviews as arguments, it returns an updated ‘listings’ with review data added to each listing.

If there is no search query or the query is an empty string, the function renders the listings (index) view with all listings on show and no filtering or sorting. If there is a search query, the geocodeAddress function is called with the search query as an argument to retrieve the geographic coordinates of the search location. Using the wait keyword to wait for the results. If the function returns null, the function will then render the home page with an error message indicating that the search location is invalid. It’s invalid when Google Maps Geocoding API has been unable to create an address from the query. 

At this stage we’ve got a valid address and need to prepare the listing data accordingly. The calcDistance function is called with the listings, locations and search location as an argument and returns an array of listings with the distance between each listing and the search location added to each listing. The sortListings function is then called with the listings and sort by parameter with returns an updated array of listings either sorted by the distance just calculated in calcDistance, or the average rating calculated earlier on or a best match algorithm which I had planned to have more than one criteria in determining a listing’s position. Further information is in future improvements section of the readme.

Finally the function renders the listings (index) view with the following parameters: listings, search query and sort by option.

In order to protect views I’ve implemented middleware to check if a user is logged in or not and protect resources when using CRUD functions so that a user can only modify their own listing or review. The following is an example of protecting views, it first checks if the user is already logged in by calling the alreadyLoggedIn middleware function. If they are, they will be redirected to the home page. Otherwise, the function retrieves a ‘r’ parameter from the request query. The ‘r’ parameter is used to specify an error message that will be displayed on the login page. If ‘r’ is not present the message variable will be set to null.

```javascript
// Get login page
router.get('/login', alreadyLoggedIn, function(req, res, next) {
  let message = null;
  if (req.query.r) {
    switch (req.query.r) {
      case '1': message = 'You must be logged in to view that page'; break;
      case '2': message = 'Please login or signup to contribute. Thank you!'; break;
    }
  }
  res.render('login', { title: 'Login', message });
});
```

Overall, this function is just a route handler that renders the login page with an optional error message.

# Challenges
- Reading documentation and finding examples for Google Maps API was time-consuming and challenging. But I’m happy with the task as it taught me a new technology and skill.

# Wins
- The code seems well-structured and well-documented. I’ve worked hard to use best practices where I can and organise it into clear and logical files. I’ve added comments and named variables and functions such that they’re self documenting.
- The visual design was also successful and I got feedback that it looks very “final and professional”, which was my goal. Using Bootstrap SASS helped me achieve this quickly and I will practise more with customising Bootstrap next time.

# Key Learnings & Takeaways
- I feel a lot more confident with designing in a model view controller pattern and leveraging libraries in Node.js to create dynamic and interactive web applications.
- Using MongoDB Atlas, a cloud database service, was a great way to host my database online and access it from anywhere. MongoDB and Mongoose were flexible and powerful tools for web development that I enjoyed working with.

# Bugs
- The navigation bar does not collapse on small screens affecting usability and responsiveness of the website.
- Loading the listings page load time that could be reduced. The index function in the code snippets makes three database queries for listings, reviews, and locations. This slows down the page with large amounts of data. With a smaller sample data there is a noticeable difference in load time. The seed data file (seed.js) creates a liberal amount of listings and reviews. With an argument of 200 (where the argument is number of users, listings number 50% more than number of users and reviews number 150% more than listings) there is a noticeable difference in load time compared to an argument of 400 (current demo). Imagine if it was more, which it could easily be on a live website. To speed up the page, the website could use pagination, caching, or both. Geocoding takes some time to complete as does the distance calculation, which performs a complex mathematical calculation for each listing. The sorting algorithm complexity could be reduced by using a faster sorting algorithm such as QuickSort.

# Future Improvements
## Must-Haves
There are a few top priority improvements that I would like to implement first and they are as follows:
- Bookmarks: I was working on adding listings to your bookmarks towards the end of the project time but was unable to complete it. So this would probably be the first improvement I make.
- Reviews: All users should be able to leave reviews within a listing, unless they’ve already done so where they should be able to edit the review or delete it. I would implement this with a collapsible form at the top of the review section, just under the tile and in between the reviews (within the section with the scrollable class). It would by default be collapsed. When a user clicks edit within their own account/reviews view it should redirect them to the listing, focus on the review section (an anchor if necessary) and then be automatically expanded.
- Products: Currently the new form only allows for adding one product, I have yet to implement a one or many products input form. This would likely require another JavaScript script to listen for a request to add another product and edit the DOM with new form elements. This would also need to be stored as an embedded schema within listings, not an array of objects as it currently seems.
- Operational Hours: This also needs implementing similar to the product feature. Requiring a little processing of the data from the form to store all the operational hour input boxes in a single embedded schema within the listings model. 

## Nice-to-Haves 
I would classify the following features as “in an ideal world” if it weren’t for the fact that I do want to actually use this website for a personal project. Granted I’d probably want to rebuild it in React, but if I don’t the following features will be needed also:
- Google Maps embedded frame: Based on the documentation, I would use the Maps Embed API to display a map with markers for the listings. The mockups have a map element that I have not added yet. This is a nice-to-have feature that I can implement as designed, after finishing the prior improvements.
- Verified listings & an associated admin panel: To ensure the quality and accuracy of the listings on the platform, I would introduce a verification process for the contributors. This process will involve requesting a manual review of the listing and the credentials of the contributor by admins. The review will confirm that the contributor is the legitimate owner of the location that they have listed. Once verified, the contributor will receive a badge of ‘verified’ on their listing and will be able to access advanced features that will enhance their visibility and control. One of these features will be the ability to delete their listings without any hassle. Unverified owners will have to submit a deletion request to our admin, who will then evaluate the request and the reason provided by the user before approving or rejecting it. Verified owners will be able to bypass this step and delete their listings instantly whenever they want. Another feature that verified owners will enjoy is the option to pay for their listings to be promoted on our platform. This will make their listings appear at the top of the search results and attract more attention from potential customers. We will also reward verified owners by giving them preference in the search results over unverified ones. This will improve the user experience by showing them more reliable and trustworthy listings.

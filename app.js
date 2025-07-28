if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const multer = require('multer');
const {storage} = require('./cloudConfig.js');
const upload = multer({storage});

const Listing = require("./models/listing.js");
const Review = require('./models/review.js');
const User = require('./models/user.js');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const { isLoginedIn, saveRedirectUrl, isOwner, validateListings,validateReview, isReviewAuthor } = require('./middleware.js');


const listingController = require('./controllers/listings.js');
const reviewController = require('./controllers/reviews.js');
const userController = require('./controllers/users.js');
const { error } = require('console');


// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, '/public')));

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRATE,
    },
    touchAfter: 24*3600,
});

store.on('error', ()=>{
    console.log('ERROR in MONGO SESSION STRORE', error);
})

const sessionOptions = {
    store,
    secret: process.env.SECRATE,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// MongoDB connection
async function main() {
    await mongoose.connect(dbUrl);
    console.log('Connected to db');
}
main();

// Set locals for all views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

// Routes
// app.get('/', (req, res) => {
//     res.send('Hi, I am the root');
// });

app.get('/listings', wrapAsync(listingController.index));

app.get('/listings/new', isLoginedIn, listingController.renderNewForm);

app.get('/listings/:id', wrapAsync(listingController.showListing));

app.post('/listings', isLoginedIn, upload.single('listing[image]'), validateListings, wrapAsync(listingController.createListing));

app.get('/listings/:id/edit', isLoginedIn, isOwner, wrapAsync(listingController.renderEditForm));

app.put('/listings/:id', isLoginedIn, isOwner,upload.single('listing[image]'), validateListings, wrapAsync(listingController.updateListing));

app.delete('/listings/:id', isLoginedIn, isOwner, wrapAsync(listingController.destroyListing));

app.post('/listings/:id/reviews',isLoginedIn, validateReview, wrapAsync(reviewController.createReview));

app.delete('/listings/:id/reviews/:reviewId', isLoginedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

app.get('/signup', userController.renderSignupFOrm);

app.post('/signup', wrapAsync(userController.signup));

app.get('/login', userController.renderLoginForm);

app.post('/login',
saveRedirectUrl,
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }),
    userController.login
);

app.get('/logout', userController.logout);

// app.all('*', (req, res, next) => {
//     next(new ExpressError(404, 'Page not found'));
// });

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong!' } = err;
    res.status(statusCode).render('error', { message, statusCode });
});

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});

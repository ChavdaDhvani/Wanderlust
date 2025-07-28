const Listing = require("../models/listing");
const User = require('../models/user');

module.exports.renderSignupFOrm = (req, res) => {
    res.render('users/signup');
};

module.exports.signup = async (req, res) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Wanderlust!');
        res.redirect('/listings');
    });
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = async (req, res) => {
        req.flash('success', 'Welcome back to Wanderlust!');
        const redirectUrl = res.locals.redirectURL || '/listings';
        res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'You are logged out!');
        res.redirect('/listings');
    });
};

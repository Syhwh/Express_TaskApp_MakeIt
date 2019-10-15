const { Router } = require('express');
const authRouter = Router();
const User = require('../database/models/User');
const cookieSession = require('cookie-session');

const requireUser = (req, res, next) => {
    
    if (!res.locals.user) {
        return res.redirect('/login');
    }
    next();
}

authRouter.get('/register', (req, res) => {
    res.render('register')
});

authRouter.post('/register', async (req, res, next) => {
    try {
        const user = await User.create({
            email: req.body.email,
            password: req.body.password
        });
        res.redirect('/login');
    } catch (error) {
        return next(error)
    }
});

authRouter.get('/login', (req, res) => {
    res.render('login');
});

authRouter.post('/login', async (req, res, next) => {
    try {
        const user = await User.authenticate(req.body.email, req.body.password);
        if (user) {
            req.session.userId = user._id;
            return res.redirect('/');
        } else {
            res.render('login', { error: 'Wrong email or password. Try again!' });
        }
    } catch (error) {
        return next(error);
    }
});

authRouter.get('/logout', requireUser, (req, res) => {
    res.session = null;
    res.clearCookie('session');
    res.clearCookie('session.sig');
    res.redirect('/login');
});







module.exports = authRouter;

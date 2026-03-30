const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const initializePassport = require('./passport-config');
const users = [];

initializePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
)

const port = 3000;
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));




app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login', {
        messages: {
            error: req.flash('error'),
            success: req.flash('success')
        }
    });
});

app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated,(req, res) => {
    res.render('register');
});
app.post('/register',checkNotAuthenticated, async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');

    }
    console.log(users)
});

app.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut((err) => {
        if (err) {
            console.error('Error occurred while logging out:', err);
        }
        res.redirect('/login');
    });
});

function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}


const server = app.listen(port, () => {
    console.log('le serveur marche ');
});
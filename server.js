const express = require('express');
const fs = require('fs');
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
initializePassport(
    passport,
    username => user.find(user => user.username === username),
    id => user.find(user => user.id === id)


 )


const port = 3000;
const user = [];
app.set('view-engine','ejs');
app.use(express.express.urlencoded({extended: false}));
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.push({
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
});

const server = app.listen(port, () => {
    console.log('le serveur marche ');
});
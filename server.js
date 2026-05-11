const express = require('express');
const bcrypt = require ('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname)));

const initializePassport = require('./passport-config');
const users = [];

const emails = [
    { id: 0, sender: 'anonyma', subject: 'j\'ai ete victime de discrimination a cause de ma couleur de peau', content: 'Bonjour,<br><br>Je me permets de vous contacter car j\'ai récemment été victime d\'une discrimination à cause de ma couleur de peau. Je souhaiterais en parler et comprendre quelles démarches je peux entreprendre.<br><br>Merci de me répondre dans les meilleurs délais.<br><br>Cordialement,<br>Anonyma', date: '26 avr', time: '10:15', read: false },
    { id: 1, sender: 'Bob', subject: 'Facture disponible', content: 'Bonjour,<br><br>Votre facture du mois d\'avril est désormais disponible. Vous pouvez la consulter et la télécharger depuis votre espace client.<br><br>N\'hésitez pas à nous contacter si vous avez la moindre question.<br><br>Cordialement,<br>Bob', date: '25 avr', time: '06:50', read: false },
    { id: 2, sender: 'Service Client', subject: 'Bienvenue !', content: 'Bonjour et bienvenue !<br><br>Votre compte a bien été créé. Vous pouvez dès à présent accéder à tous nos services depuis votre espace personnel.<br><br>Si vous avez des questions, notre équipe est disponible du lundi au vendredi de 9h à 18h.<br><br>À bientôt,<br>Le Service Client', date: '24 avr', time: '09:00', read: true }
];

initializePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
)

const port = 3000;
app.use(express.urlencoded({extended: false}));
app.use(express.json());
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
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.redirect('/connexion.html');
    }
});

// Formulaire routes removed - using HTML/static files only

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'connexion.html'));
});

app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

// Register routes removed - using connexion.html only

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const passwordConfirm = req.body.passwordConfirm;
        
        // Validate input
        if (!username || !password || !passwordConfirm) {
            return res.redirect('/register?error=All%20fields%20required');
        }
        
        // Check if passwords match
        if (password !== passwordConfirm) {
            return res.redirect('/register?error=Passwords%20do%20not%20match');
        }
        
        // Check if user already exists
        if (users.find(user => user.username === username)) {
            return res.redirect('/register?error=User%20already%20exists');
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Add user to array
        const newUser = {
            id: users.length + 1,
            username: username,
            password: hashedPassword
        };
        users.push(newUser);
        
        console.log('New user registered:', username);
        res.redirect('/login');
    } catch (e) {
        console.error('Registration error:', e);
        res.redirect('/register');
    }
});

app.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut((err) => {
        if (err) {
            console.error('Error occurred while logging out:', err);
        }
        res.redirect('/login');
    });
});

app.get('/reception', checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'reception.html'));
});

app.get('/api/emails', checkAuthenticated, (req, res) => {
    res.json(emails);
});

app.post('/api/emails/:id/read', checkAuthenticated, (req, res) => {
    const id = parseInt(req.params.id);
    const email = emails.find(e => e.id === id);
    if (email) {
        email.read = true;
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
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
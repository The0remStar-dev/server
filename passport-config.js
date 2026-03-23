const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, password, done) => {
        const user = getUserByUsername(username);
        if(user == null){
            return done(null, false, {message: 'No user with that username'})
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else {
                return done(null, false, {message: 'Password incorrect'})
            }
        } catch(e){
            return done(e)
        }
        
    }
    passport.use(new localStrategy({usernameField: 'username'}, authenticateUser))
}


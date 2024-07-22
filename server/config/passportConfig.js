const  passport =require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authService =require('../services/authService');

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.CALLBACK_URL
},async (accessToken, refreshToken, profile,done)=>{
    try{
        const user =await authService.findOrCreateUser(profile);
        return done(null, user);
    }catch(err){
        return done(err);
    }
}));

passport.serializeUser((user,done)=>{
    done(null, user.username);
});

passport.deserializeUser(async (username, done)=>{
    try {
        const user = await authService.findUserByUsername(username);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
module.exports =passport;
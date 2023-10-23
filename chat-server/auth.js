const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: "371216924606-rgdtfalqj9tklp61rkv27d9ii14cenbe.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://lvh.me:3000/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

const FacebookTokenStrategy = require("passport-facebook-token");
const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const passport = require("passport");
const config = require("../../config");
const UserSchema = require("../models/users").UserSchema;
var mongoose = require("../common/mongoose.service").mongoose;

const User = mongoose.model("Users", UserSchema);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: config.secret
    },
    async (payload, done) => {
      try {
        //Find the user specified in token
        const user = await User.findById(payload.id);
        if (!user) {
          return done(null, false);
        }
        //If user doesn't exists, handle it

        //Otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: config.oauth.facebook.clientID,
      clientSecret: config.oauth.facebook.clientSecret
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log(accessToken);
        // console.log(refreshToken);
        // console.log(profile);

        const existingUser = await User.findOne({ "facebook.id": profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          email: profile.emails[0].value,
          name: profile.displayName,
          method: "facebook",
          facebook: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });

        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, false, err.message);
      }
    }
  )
);
